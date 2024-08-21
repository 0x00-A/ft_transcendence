import React from 'react';
import css from './ChatHeader.module.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
// import { FaAngleLeft } from 'react-icons/fa6';
// import { FaAngleRight } from 'react-icons/fa6';
import { FaCircleInfo } from 'react-icons/fa6';

interface ChatHeaderProps {
  isExpanded: boolean;
  toggleSidebar: () => void;
}

const ChatHeader: React.FC<ChatHeaderProps> = ({
  toggleSidebar,
  isExpanded,
}) => {
  return (
    <header className={css.chatHeader}>
      <div className={css.chatHeaderContent}>
        <div className={css.userInfo}>
          <img
            src="https://picsum.photos/200"
            alt="User"
            className={css.userAvatar}
          />
          <div className={css.userDetails}>
            <h2 className={css.userName}>Rachid el ismaili</h2>
            <p className={css.userStatus}>Typing...</p>
          </div>
        </div>
        <div className={css.chatActions}>
          <button className={css.backButton} onClick={toggleSidebar}>
            <i>
              <FaCircleInfo color="#F8F3E3" />
            </i>
          </button>
        </div>
      </div>
    </header>
  );
};

export default ChatHeader;
