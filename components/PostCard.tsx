import React from 'react';
import { format } from 'fecha';
import { PostData } from '../loader';
import { Tag } from './Tag';

export const PostCard: React.FC<{ post: PostData, complete: boolean }> = (props) => {
  const post = props.post;
  return (
    <a className="post-card" href={`/${post.path}`}>
      <div className="post-card-inner">
        {/* {post.thumbnailPhoto && (
          <div
            className="post-card-thumbnail"
            style={{ backgroundImage: `url(${post.thumbnailPhoto})` }}
          />
        )} */}
        <div className="post-card-title">
          {post.title && <h2>{post.title}</h2>}
          {post.subtitle && <p>{post.subtitle}</p>}
          <strong className="post-card-date">
            {props.post.datePublished
              ? format(new Date(props.post.datePublished), 'MMMM Do, YYYY')
              : ''}
          </strong>
          <div className="flex-spacer"> </div>
            <div className="tag-container">
              {props.complete && post.tags && (post.tags || []).map((tag) => <Tag tag={tag} />)}
            </div>
        </div>
      </div>
    </a>
  );
};
