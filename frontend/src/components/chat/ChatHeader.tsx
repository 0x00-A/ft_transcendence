import React from 'react';
import css from './ChatHeader.module.css';
import { FaCircleInfo } from 'react-icons/fa6';


interface ChatHeaderProps {
  toggleSidebar: () => void;
  onSelectedConversation: {
    avatar: string;
    name: string;
    time: string;
    status: boolean;
  } | null;
}

const ChatHeader: React.FC<ChatHeaderProps> = ({
  toggleSidebar,
  onSelectedConversation,
}) => {
  const renderUserStatus = () => {
    if (!onSelectedConversation) return null;

    switch (onSelectedConversation.status) {
      case true:
        return <p className={`${css.userStatus} ${css.online}`}>Online</p>;
      case false:
        return (
          <p className={`${css.userStatus} ${css.offline}`}>
            Last seen at {onSelectedConversation.time}
          </p>
        );
    }
  };

  return (
    <header className={css.chatHeader}>
      {onSelectedConversation ? (
        <div className={css.chatHeaderContent}>
          <div className={css.userInfo}>
            <img
              src={onSelectedConversation.avatar}
              alt="User"
              className={css.userAvatar}
            />
            <div className={css.userDetails}>
              <h2 className={css.userName}>{onSelectedConversation.name}</h2>
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
