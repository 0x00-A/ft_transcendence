import React from 'react';
import css from './MessageItem.module.css';

interface MessageItemProps {
  avatar: string;
  name: string;
  lastMessage: string;
  time: string;
  unreadCount?: number;
  isSelected: boolean;
  onClick: () => void;
}

const MessageItem: React.FC<MessageItemProps> = ({
  avatar,
  name,
  lastMessage,
  time,
  unreadCount,
  isSelected,
  onClick,
}) => {
  return (
    <div
      className={`${css.messageItem} ${isSelected ? css.selected : ''}`}
      onClick={onClick}
    >
      <img src={avatar} alt={name} className={css.avatar} />
      <div className={css.messageContent}>
        <div className={css.messageHeader}>
          <span className={css.name}>{name}</span>
          <span className={css.time}>{time}</span>
        </div>
        <div className={css.messageBody}>
          <span className={css.lastMessage}>{lastMessage}</span>
          {unreadCount && unreadCount > 0 && (
            <span className={css.unreadCount}>{unreadCount}</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default MessageItem;
