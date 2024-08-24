import React from 'react';
import css from './MessageItem.module.css';
import { CgMoreO } from 'react-icons/cg';

interface MessageItemProps {
  avatar: string;
  name: string;
  lastMessage: string;
  time: string;
  unreadCount?: number;
  isSelected: boolean;
  onClick: () => void;
  onMoreClick: (position: { top: number; left: number }) => void;
}

const MessageItem: React.FC<MessageItemProps> = ({
  avatar,
  name,
  lastMessage,
  time,
  unreadCount,
  isSelected,
  onClick,
  onMoreClick,
}) => {
  const handleIconClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    const { top, left, height } = (
      e.currentTarget as HTMLElement
    ).getBoundingClientRect();
    onMoreClick({ top: top + height, left });
  };

  return (
    <div
      className={`${css.messageItemWrapper} ${isSelected ? css.selected : ''}`}
      onClick={onClick}
    >
      <div className={css.messageItem}>
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
        <CgMoreO className={css.icon} onClick={handleIconClick} />
      </div>
    </div>
  );
};

export default MessageItem;
