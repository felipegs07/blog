import React from 'react';
import { format } from 'fecha';
import { globals } from '../globals';

type Author = {
  title: string;
  description?: string;
  date?: number;
};

export const FollowButton = () => {
  return (
    <a href="/newsletter">
      <div className="follow-button">Follow</div>
    </a>
  );
};

export const Author = ({ title, description, date }: Author) => {
  return (
    <div className="author-container">
      <div className="author">
        {globals.authorPhoto && (
          <img alt="Felipe Gustavo's photo, with dark background" src={globals.authorPhoto} className="author-image" />
        )}
        <AuthorLines title={title} description={description} date={date} />
      </div>
    </div>
  );
};

export const AuthorLines = ({ title, description, date }: Author) => {
  return (
    <div>
      <p className="author-line">
        {title && <span>{title}</span>}
        {globals.yourName && <a
              href={`https://twitter.com/${globals.twitterHandle}`}
              target="_blank"
              rel="noopener noreferrer"
              className="special-link"
            >{globals.yourName}</a>}

        {/* {props.post.authorTwitter && (
          <span>
            {' '}
            <a
              href={`https://twitter.com/${props.post.authorTwitter}`}
            >{`@${props.post.authorTwitter}`}</a>{' '}
          </span>
        )}*/}
      </p>
      <p className="author-line subtle">
        {date
          ? format(new Date(date), 'MMMM Do, YYYY')
          : description}
      </p>
    </div>
  );
};
