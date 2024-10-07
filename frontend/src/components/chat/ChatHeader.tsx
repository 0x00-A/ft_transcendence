import React from 'react';
import css from './ChatHeader.module.css';
import { FaCircleInfo } from 'react-icons/fa6';

interface ChatHeaderProps {
  toggleSidebar: () => void;
  selectedMessage: {
    avatar: string;
    name: string;
    status: 'online' | 'offline' | 'typing';
    lastSeen?: string;
  } | null;
}

const ChatHeader: React.FC<ChatHeaderProps> = ({
  toggleSidebar,
  selectedMessage,
}) => {
  const renderUserStatus = () => {
    if (!selectedMessage) return null;

    switch (selectedMessage.status) {
      case 'online':
        return <p className={`${css.userStatus} ${css.online}`}>Online</p>;
      case 'typing':
        return <p className={`${css.userStatus} ${css.typing}`}>Typing...</p>;
      case 'offline':
        return (
          <p className={`${css.userStatus} ${css.offline}`}>
            Last seen at {selectedMessage.lastSeen}
          </p>
        );
    }
  };

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
              {renderUserStatus()}
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
        <div className={css.placeholderHeader}>No chats selected</div>
      )}
    </header>
  );
};

export default ChatHeader;
