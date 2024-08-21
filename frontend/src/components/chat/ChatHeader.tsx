import React from 'react';
import css from './ChatHeader.module.css';
import { FaCircleInfo } from 'react-icons/fa6';

interface ChatHeaderProps {
  toggleSidebar: () => void;
  selectedMessage: {
    avatar: string;
    name: string;
  } | null;
}

const ChatHeader: React.FC<ChatHeaderProps> = ({
  toggleSidebar,
  selectedMessage,
}) => {
  return (
    <header className={css.chatHeader}>
      {selectedMessage ? (
        <div className={css.chatHeaderContent}>
          <div className={css.userInfo}>
            <img
              src={selectedMessage.avatar}
              alt="User"
              className={css.userAvatar}
            />
            <div className={css.userDetails}>
              <h2 className={css.userName}>{selectedMessage.name}</h2>
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
      ) : (
        <div className={css.placeholderHeader}>Select a chat</div>
      )}
    </header>
  );
};

export default ChatHeader;
