import { IoMdNotificationsOutline } from 'react-icons/io';

import css from './Topbar.module.css';
import { useNavigate } from 'react-router-dom';
import NotificationsDropdown from './NotificationsDropdown';


const Topbar = () => {

  const navigate = useNavigate();
  return (
    <div className={css.topbar}>
      <NotificationsDropdown />
      <div className={css.userAccount}  onClick={() => navigate('/profile')}>
        <p className={css.userName}>Mad Max</p>
        <img className={css.userIcon} src="https://picsum.photos/200" alt="" />
      </div>
    </div>
  );
};

export default Topbar;
