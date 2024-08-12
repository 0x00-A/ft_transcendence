import { IoMdNotificationsOutline } from 'react-icons/io';

import css from './Topbar.module.css';

const Topbar = () => {
  return (
    <button type={css.button} className={css.iconButton}>
      <IoMdNotificationsOutline size={37} color="#F8F3E3" />
      <span className={css.counter}></span>
    </button>
  );
};

export default Topbar;
