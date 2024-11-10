import React from 'react';
import css from './NoFriendRequests.module.css';

const NoFriendRequests: React.FC = () => {
  return (
    <div className={css.container}>
      <div className={css.iconContainer}>
        <img src="/icons/friend/requestsFriend.svg" alt="" />
      </div>
      <h2 className={css.title}>No Friend Requests</h2>
      <p className={css.description}>
        You don't have any pending friend requests right now. 
        Connect with more people to expand your network!
      </p>
    </div>
  );
};

export default NoFriendRequests;