import React from 'react';
import css from './ChatHeader.module.css';
import { FaCircleInfo } from 'react-icons/fa6';
import { useTyping } from '@/contexts/TypingContext';
import { useUser } from '@/contexts/UserContext';
import { conversationProps } from '@/types/apiTypes';


interface ChatHeaderProps {
  toggleSidebar: () => void;
  onSelectedConversation: conversationProps | null;
}

const ChatHeader: React.FC<ChatHeaderProps> = ({
  toggleSidebar,
  onSelectedConversation,
}) => {

  const { typing } = useTyping();
  const isReceiver = typing.senderId == onSelectedConversation?.user_id;

  console.log("onSelectedConversation: ", onSelectedConversation?.status);

const renderUserStatus = () => {
    if (!onSelectedConversation) return null;

    if (typing.typing && isReceiver ) {
      return <p className={`${css.userStatus} ${css.typing}`}>Typing...</p>;
    }

    switch (onSelectedConversation.status) {
      case true:
        return <p className={`${css.userStatus} ${css.online}`}>Active now</p>;
      case false:
        return (
          <p className={`${css.userStatus} ${css.offline}`}>
            Last seen at {onSelectedConversation.last_seen}
          </p>
        );
    }
  };

  return (
    <header className={css.chatHeader}>
      {onSelectedConversation ? (
        <div className={css.chatHeaderContent}>
          <div className={css.userInfo}>
            <div className={`${css.userAvatar} ${onSelectedConversation.status ? css.online : ''}`}>
              <img
                src={onSelectedConversation.avatar}
                alt="User"
                className={css.imageAvatar}
              />
            </div>
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
