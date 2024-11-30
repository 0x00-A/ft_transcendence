import React from 'react';
import css from './NoOnlineFriends.module.css';
import { CircleDot } from 'lucide-react';


const NoOnlineFriends: React.FC = () => {
  return (
    <div className={css.container}>
      <CircleDot size={80} color='#6b7280' />
      <h2 className={css.title}>No Friends Online</h2>
      <p className={css.description}>
        It seems like none of your friends are online right now. 
        Invite some friends or check back later!
      </p>
    </div>
  );
};

export default NoOnlineFriends;