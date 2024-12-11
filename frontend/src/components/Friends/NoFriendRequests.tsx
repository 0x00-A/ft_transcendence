import React from 'react';
import css from './NoFriendRequests.module.css';
import { UserCog } from 'lucide-react';


const NoFriendRequests: React.FC = () => {
  return (
    <div className={css.container}>
      <UserCog size={80} color='#6b7280' />
      <h2 className={css.title}>No Friend Requests</h2>
      <p className={css.description}>
        You don't have any pending friend requests right now. 
        Connect with more people to expand your network!
      </p>
    </div>
  );
};

export default NoFriendRequests;