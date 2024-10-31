import React from 'react';
import css from './NoFound.module.css';

const NoFound: React.FC = () => {
  return (
    <div className={css.container}>
      <div className={css.iconContainer}>
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          width="80" 
          height="80" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="1.5" 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          className={css.icon}
        >
          <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
          <path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
      </div>
      <h2 className={css.title}>No Friends Yet</h2>
      <p className={css.description}>
        Looks like your friends list is empty. Start connecting by searching for friends or sending invites!
      </p>
    </div>
  );
};

export default NoFound;