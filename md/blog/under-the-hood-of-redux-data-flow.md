---
title: Understanding how the redux data flow really works
subtitle: Looking into the source code itself
datePublished: 1629421982000
published: true
tags: 
    - javascript
    - redux
    - in-depth
    - immutability
---

## Introduction

Redux is one of the most used state management libraries available today for web applications. Most of the developers use that, but did not know how it works behind the scenes.

Some time ago I decided to read the Redux codebase, to better understand the implementation of the library that I used in some jobs. In this work, I did some notes, and this article is a more complete version of that.

**Disclaimer**: This article tries to be a deep dive into Redux. It is not a tutorial and it requires a basic knowledge about Redux, the idea here is to understand the internals and not teach how to use.

## Dataflow

The data flow of Redux is the base of the library. It is one of the first things that we learn when we start to study Redux.

You dispatch an action, that is a plain object, to the store. This updates the state using the reducer function and this new state returns to the application, updating the UI.

!["Redux data flow diagram, showing store, reducer, state and event handler and dispatch blocks interacting"](/img/redux-data-flow.gif)

One important thing to understand here is the architecture of Redux. It consists of the core that handles the basic features, such as dispatch actions, update the store and notify the state updates.

Another part is the bindings, the most popular one that is supported by the Redux core team is the React one, called react-redux. This module connects the Redux core to react applications, creating HOC and Hooks that the react developers use to develop the UIs in the end.

Our focus in this article will be the Redux core. Mainly, the store object. There is the place where the state tree is created and where it is provided the `dispatch` and `subscribe` methods. The both are the most important methods to Redux data flow work.

To create the store, you have a function called `createStore`. This function accepts 3 arguments: 
- the reducer function.
- the preloaded state object or most known as **initialState**. This is useful for universal apps or SSR applications, because it allows the user to add a first state before the hydration process. Another use for this is when some library stores the state in local storage and reloads the state in the next section.
- the enhancer (this is the argument that allows the use of middlewares, and will be the theme of another article).

In the creation of the store, the function does a lot of verifications to see if the reducer passed is really a function and if the preloadedState is a real object.

```javascript
if (
    (typeof preloadedState === 'function' && typeof enhancer === 'function') ||
    (typeof enhancer === 'function' && typeof arguments[3] === 'function')
  ) {
    throw new Error(
      'It looks like you are passing several store enhancers to ' +
        'createStore(). This is not supported. Instead, compose them ' +
        'together to a single function. See https://redux.js.org/tutorials/fundamentals/part-4-store#creating-a-store-with-enhancers for an example.'
    )
  }

  if (typeof preloadedState === 'function' && typeof enhancer === 'undefined') {
    enhancer = preloadedState as StoreEnhancer<Ext, StateExt>
    preloadedState = undefined
  }

  if (typeof reducer !== 'function') {
    throw new Error(
      `Expected the root reducer to be a function. Instead, received: '${kindOf(
        reducer
      )}'`
    )
  }
```

Then, the function returns the store object.

Internally, they create some important variables, these variables work as properties of the store object.

```typescript
let currentReducer = reducer
let currentState = preloadedState as S
let currentListeners: (() => void)[] | null = []
let nextListeners = currentListeners
let isDispatching = false
```

- **currentReducer**: this variable receives the reducer function argument, that will be used to create the new state.  
- **currentState**: this variable will keep the state itself, it starts receiving the 
- **preloadedState**, but can be updated by other methods.
currentListeners: this variable keeps the array of listeners, that is callback functions that are executed when the state is updated. (we will dive deep into this topic later in this article).
- **nextListeners**: this variable works as a temporary list to new listeners, to avoid some bugs when new listeners when a dispatch or notify work is in progress.

## isDispatching FLAG

The redux library has a lot of verifications, but one appears a lot of times: this is the verification of `isDispatching`. The idea of that is to prevent changes on the variables when the dispatch function is being called. The point is to prevent bugs with changes being made on the execution.

The default value is false. The value is changed to true inside the try that updates the state. At that moment, if other methods as `getState`, `subscribe`, `unsubscribe`, `dispatch` are called, this function has verifications that throw an error, warning that these methods can not be executed correctly at that time.

See an example of isDispatching verification below:

```javascript
if (isDispatching) {
  throw new Error(
  'You may not call store.getState() while the reducer is executing. ' +
      'The reducer has already received the state as an argument. ' +
      'Pass it down from the top reducer instead of reading it from the store.'
  )
}
```

Returning to the dataflow, it can be divided in 2 big parts:
- **Dispatch** action and update state.
- **Notify** state change to subscribers.

## Dispatch

As shown on this basic example of Redux Documentation (https://redux.js.org/introduction/getting-started#basic-example), after using `createStore` and having the store object available, the way to dispatch an action is to call the `dispatch` method.

```typescript
function dispatch(action: A) {
  if (!isPlainObject(action)) {
    throw new Error(
      `Actions must be plain objects. Instead, the actual type was: '${kindOf(
        action
      )}'. You may need to add middleware to your store setup to handle dispatching other values, such as 'redux-thunk' to handle dispatching functions. See https://redux.js.org/tutorials/fundamentals/part-4-store#middleware and https://redux.js.org/tutorials/fundamentals/part-6-async-logic#using-the-redux-thunk-middleware for examples.`
    )
  }

  if (typeof action.type === 'undefined') {
    throw new Error(
      'Actions may not have an undefined "type" property. You may have misspelled an action type string constant.'
    )
  }

  if (isDispatching) {
    throw new Error('Reducers may not dispatch actions.')
  }

  try {
    isDispatching = true
    currentState = currentReducer(currentState, action)
  } finally {
    isDispatching = false
  }

  const listeners = (currentListeners = nextListeners)
  for (let i = 0; i < listeners.length; i++) {
    const listener = listeners[i]
    listener()
  }

  return action
}
```

The dispatch method is a simple function with only one objective, **update the state**.

It receives a plain object as an argument called action. It is mandatory to have a property called `type` on the action, this `type` will be used on the reducer to identify the script that will create a new version of state. To make sure that an action used on the `dispatch` call follows these rules, Redux does some verifications with the action argument.

```typescript
if (!isPlainObject(action)) {
  throw new Error(
    `Actions must be plain objects. Instead, the actual type was: '${kindOf(
      action
    )}'. You may need to add middleware to your store setup to handle dispatching other values, such as 'redux-thunk' to handle dispatching functions. See https://redux.js.org/tutorials/fundamentals/part-4-store#middleware and https://redux.js.org/tutorials/fundamentals/part-6-async-logic#using-the-redux-thunk-middleware for examples.`
  )
}

if (typeof action.type === 'undefined') {
  throw new Error(
    'Actions may not have an undefined "type" property. You may have misspelled an action type string constant.'
  )
}
```

Basically, it verifies if the action is a plain object, calling a util function called `isPlainObject`. Then, it verifies if the action object has a `type` property and if it is `undefined`. In these cases, they throw Errors to warn the user.

```javascript
try {
  isDispatching = true
  currentState = currentReducer(currentState, action)
} finally {
  isDispatching = false
}
```
 
After the verifications, they do a try statement to update the state. First, they update the isDispatching flag to true (as we explained above), and then, they call the reducer function passing the last version of the state variable and the action object.

The reducer will get the type of the action and based on that, will create a new version of the state. Then, they return this new state and that is assigned to the `currentState` variable.

This part of the code is inside a try statement, so basically, if the reducer function throws any error, this does not break the redux work. This makes the code safer on runtime. Finally, they update the `isDispatching` to false, to maintain that work of the `isDispatching` flag verifications.

Another important point here, that explains the reason that Redux documentation says that the reducer function has to be a pure function, can be understood here. As you can see, Redux uses a simple variable to hold the state and use this variable as argument to the reducer function. 

As the state is an object, it is a reference pointer, so if you mutate the argument on the reducer function, you mutate the `currentState` variable that is inside the store. And as the return of the reducer will be assigned to the `currentState` variable, if you mutate that, will basically set to the same reference that was assigned before.

It generates some issues as:
- Break time-travel features because all state changes, that should create different state ‘versions’, will be always the same, with the same content.
- Can cause bugs related with the huge number of mutations and reassign to the same reference at the same time.
- Can impact on changes verification, because some libraries, such as react-redux, for example, use shallow equality as the way to compare changes, as shallow equality relies on reference comparison, sometimes the state changed, but will not cause updates and re-renders.

After all this state update, they need to run the listeners to notify the subscribers that the state changed. We will talk more about this in the next section.

## Notify

The notification process of Redux is made by the method called `subscribe`. It is basically an observer design pattern, this method allows adding a listener function that is executed after a state update.

![Observer pattern diagram showing the Subject connect with a lot of Observer blocks](/img/observer-pattern.png)

We can see the hole code of the `subscribe` method below:

```typescript
function subscribe(listener: () => void) {
  if (typeof listener !== 'function') {
    throw new Error(
      `Expected the listener to be a function. Instead, received: '${kindOf(
        listener
      )}'`
    )
  }

  if (isDispatching) {
    throw new Error(
      'You may not call store.subscribe() while the reducer is executing. ' +
        'If you would like to be notified after the store has been updated, subscribe from a ' +
        'component and invoke store.getState() in the callback to access the latest state. ' +
        'See https://redux.js.org/api/store#subscribelistener for more details.'
    )
  }

  let isSubscribed = true

  ensureCanMutateNextListeners()
  nextListeners.push(listener)

  return function unsubscribe() {
    if (!isSubscribed) {
      return
    }

    if (isDispatching) {
      throw new Error(
        'You may not unsubscribe from a store listener while the reducer is executing. ' +
          'See https://redux.js.org/api/store#subscribelistener for more details.'
      )
    }

    isSubscribed = false

    ensureCanMutateNextListeners()
    const index = nextListeners.indexOf(listener)
    nextListeners.splice(index, 1)
    currentListeners = null
  }
}
```

In the subscribe method, first, it is made 2 basic verifications, one for the `isDispatching` and another to the listener argument, verifying if the type of the argument is really a function, to make sure that it will not break when it is called on state changes.

Then, it came to the main point of this function: **add a new listener as a subscriber**.

```typescript
let isSubscribed = true

ensureCanMutateNextListeners()

nextListeners.push(listener)
```

To do that, first they create a variable called `isSubscribed` assigning to true. The idea of this variable is to keep the internal state of that listener on the subscribers array, if it is there or not. It is important to notice that the return of the `subscribe` function is an `unsubscribe` function.

So, using the concept of closure, this variable `isSubscribed` is held in this `unsubscribe` function. The idea is use this variable as a verification, if the listener is subscribed, the function executes the work to remove this listener from the array, if not, then do nothing.

```typescript
return function unsubscribe() {
  if (!isSubscribed) {
    return
  }
...
```

Besides that, other 2 functions are executed: 
- One called `ensureCanMutateNextListeners`
- The push of the `nextListeners` array, that actually adds the listener to be executed in the future.

About the `ensureCanMutateNextListeners`:

```typescript
function ensureCanMutateNextListeners() {
  if (nextListeners === currentListeners) {
    nextListeners = currentListeners.slice()
  }
}
```

To understand this function, we need to understand the difference between currentListeners and nextListeners.
- `currentListeners`: is the variable that keeps the listeners that are being executed or that were executed on runtime.
- `nextListeners`: is the variable that keeps the next version of listeners to be executed. This is the variable that gives the push on the subscribe function, to add a new listener. On the dispatch function, after the state update, the currentListener receives the reference of nextListeners, so if there are new listeners, they will be executed.

The point of this function is that after the dispatch, the `nextListeners` and `currentListeners` are basically the same, pointing to the same reference. The issue is that if we just give a push to `nextListeners`, we are affecting the `currentListeners` variable and if a dispatch is happening at that moment, it can cause bugs.

To avoid that, they created this `ensureCanMutateNextListeners` function.The idea is just do a shallow copy of `currentListeners`, creating a new reference. This way, if we update `nextListeners`, we do not affect `currentListeners`.

Finally, to close the notify process, on `dispatch` function, after the state update, all the actual listeners callbacks are called.

```typescript
const listeners = (currentListeners = nextListeners)

for (let i = 0; i < listeners.length; i++) {
  const listener = listeners[i]
  listener()
}
```

As explained above, the currentListeners receive the nextListeners reference and this is assigned in the listeners variable. Then, they use a simple for loop to call all the listeners. This way, redux notifies all subscribers that a state update happened.

## Get state

Imagine that a subscriber is called after a state update and wants to use the new state on the UI. How to do this? There is a function called `getState`.

```typescript
function getState(): S {
  if (isDispatching) {
    throw new Error(
      'You may not call store.getState() while the reducer is executing. ' +
        'The reducer has already received the state as an argument. ' +
        'Pass it down from the top reducer instead of reading it from the store.'
    )
  }

  return currentState as S
}
```

This function is the simplest of the entire library. A basic verification about the `isDispatching` is executed and after that, it is just returned the `currentState` variable.


### Research source:
- [Redux Essentials Docs: Reducers and Immutable Updates](https://redux.js.org/tutorials/essentials/part-2-app-structure#reducers-and-immutable-updates)
- [Redux Fundamentals Docs: Data Flow](https://redux.js.org/tutorials/fundamentals/part-2-concepts-data-flow)
- [Redux source code on master v4.1.1](https://github.com/reduxjs/redux/blob/master/src/createStore.ts)
