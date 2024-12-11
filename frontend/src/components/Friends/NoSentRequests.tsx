import React from 'react';
import css from './NoSentRequests.module.css';
import { UserX } from 'lucide-react';

const NoSentRequests: React.FC = () => {
  return (
    <div className={css.container}>
      <UserX size={80} color='#6b7280' />
      <h2 className={css.title}>No Sent Requests</h2>
      <p className={css.description}>
        You don't have any sent requests right now. 
        Connect with more people to expand your network!
      </p>
    </div>
  );
};

export default NoSentRequests;