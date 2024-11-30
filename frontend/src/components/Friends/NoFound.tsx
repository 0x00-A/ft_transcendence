import React from 'react';
import css from './NoFound.module.css';
import { Users } from 'lucide-react';


const NoFound: React.FC = () => {
  return (
    <div className={css.container}>
      <Users size={80} color='#6b7280'/>
      <h2 className={css.title}>No Friends Yet</h2>
      <p className={css.description}>
        Looks like your friends list is empty. Start connecting by searching for friends or sending invites!
      </p>
    </div>
  );
};

export default NoFound;