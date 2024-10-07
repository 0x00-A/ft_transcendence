import React from 'react';
import css from './ButtonSection.module.css';
// import { FaUserCircle, FaSearch, FaUserPlus } from 'react-icons/fa';

const ButtonSection: React.FC = () => {
  return (
    <div className={css.buttonSection}>
      <div className={css.button}>
        <img className={css.icon} src="/icons/chat/Profile.svg" alt="I" />
        {/* <FaUserCircle className={css.icon} /> */}
        <p>Profile</p>
      </div>
      <div className={css.button}>
        <img className={css.icon} src="/icons/chat/Search.svg" alt="I" />
        {/* <FaSearch className={css.icon} /> */}
        <p>Search</p>
      </div>
      <div className={css.button}>
        <img className={css.icon} src="/icons/chat/Invite.svg" alt="I" />
        <p>Invite</p>
      </div>
    </div>
  );
};

export default ButtonSection;
