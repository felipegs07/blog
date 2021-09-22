---
title: Understanding BEMCSS
subtitle: Architecture for CSS? Oh yes!
datePublished: 1573953182000
published: true
tags:
- CSS3
- Begginer
- Architecture
---

When the use of CSS is no longer just the stylization of personal websites or small projects and moves to large, scalable and complex projects, there is a need to organize and think about the architecture for the CSS. Simple things like class naming can become a huge problem in future maintenance.

To correct problems like these, organizational architectures and methodologies were created and one of the most popular is BEMCSS.
## What is it?

The acronym comes from Block-Element-Modifier, which is the way designated to create names for the classes. The idea is to create a rigid standard for class naming, making it easy to read and understand what the class does and what component it targets.
The class names follow the line:

```css
.block__element--modifier {}
```

Two underlines that separate the block from the element and two lines that separate the element from the modifier.

## Block:
The Block is the element or component that that class is assigned to. You don't need to respect the name of the element, the idea is that it describes what the component is in the scope of the project. For example, if you create a class for a login form, the name would not be .form, even though in HTML you do create a form.

In the scope of the project the class could be **. Login **, which would make it clear to everyone what it is about. A general naming rule is to separate compound names with a single dash, for example, **. Formulario-de-cadastr ** would be the correct way to write a name with three words

## Element:
The Element are internal parts of the component. In the example used above, inside the login block there would be at least two inputs for the username or email, password and an action button.

The appointment of these elements would be:

```css
.login__email {}
.login__password {}
.login__button {}
```

## Modifier:
The modifier usually applies to changes and varied shapes for the elements or for the block itself as a whole. In the example of the article, when the user put something that does not match the password or email in the inputs and there was a check to confirm this, the visual feedback of the error, for example, could be done by changing the colors of the edges of the incorrect inputs to red.

The modifier class would be used to create this, being used in this way:

```css
.login__email--error {}
```


The modifiers can also be used for the block as a whole, and can be applied directly over it in the class, ignoring the existence of the elements. For example:

```css
.login--error {}
```

Remembering that each element has its class in an isolated way. For example, if an element has another element within it, it is not correct to join the elements into a single class, such as:

```css
.bloco__elemento1__elemento2__elemento3 {}
```

In these cases each element has its own class, ignoring the order of the HTML structure

```css
.bloco {}
.bloco__elemento1 {}
.bloco__elemento2 {}
.bloco__elemento3 {}
```

## A new way of thinking CSS:

When using a methodology like BEM, it is interesting to think that you are not just naming classes in a standard way. It is important to rethink how to create the elements, thinking about the layout in a modular way, separating each piece into components, which would correspond to the blocks, elements and so on.

Separating the layout in this way, the creation of the code itself becomes more organized. Using BEM is just the way to formalize this new structure.
It is important to note that BEM is a highly flexible methodology, adapting and fitting in several different CSS project architectures, another very positive point

## Conclusion:

The methodology is simple, but very functional and useful in the day-to-day development, in addition to being something that is often requested in job openings in the current market. Creating a scalable and quality CSS avoids rework and increases the quality of a software, therefore, it is an increasingly required skill in high-level projects.

### Research source: 
 - [getbem](http://getbem.com/)