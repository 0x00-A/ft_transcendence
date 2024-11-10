import React from 'react';
import css from './NoOnlineFriends.module.css';

const NoOnlineFriends: React.FC = () => {
  return (
    <div className={css.container}>
      <div className={css.iconContainer}>
        <img src="/icons/friend/onlineFriend.svg" alt="" />
        <div className={css.offlineIndicator}></div>
      </div>
      <h2 className={css.title}>No Friends Online</h2>
      <p className={css.description}>
        It seems like none of your friends are online right now. 
        Invite some friends or check back later!
      </p>
    </div>
  );
};

export default NoOnlineFriends;