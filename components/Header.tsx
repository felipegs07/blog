import React from 'react';
import { globals } from '../globals';

export const Header: React.FC = () => (
  <div className="content header-wrapper">
    <div className="header">
      <a className="header-title" href="/">{globals.siteName}</a>
      <div className="flex-spacer" />
      {
        globals.siteLinks.map(link => (
          <a href={link.path} target="_blank" rel="noopener noreferrer" key={link.path}>
            {link.name}
          </a>
        ))
      }
    </div>
  </div>
);
