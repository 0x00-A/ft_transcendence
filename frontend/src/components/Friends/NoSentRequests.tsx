import React from 'react';
import css from './NoSentRequests.module.css';

const NoSentRequests: React.FC = () => {
  return (
    <div className={css.container}>
      <div className={css.iconContainer}>
        <img src="/icons/friend/sentRequests.svg" alt="" />
      </div>
      <h2 className={css.title}>No Sent Requests</h2>
      <p className={css.description}>
        You don't have any sent requests right now. 
        Connect with more people to expand your network!
      </p>
    </div>
  );
};

export default NoSentRequests;