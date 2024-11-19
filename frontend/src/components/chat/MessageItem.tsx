import React, { forwardRef } from 'react';
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
  onMoreClick: (e: React.MouseEvent) => void;
  showMoreIcon: boolean;
  isActive: boolean;
}

const MessageItem = forwardRef<HTMLDivElement, MessageItemProps>(
  (
    {
      avatar,
      name,
      lastMessage,
      time,
      unreadCount,
      isSelected,
      onClick,
      onMoreClick,
      showMoreIcon,
      isActive,
    },
    ref
  ) => {

    return (
      <div
        ref={ref}
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
          {showMoreIcon && (
            <CgMoreO
              className={`${css.icon} ${isActive ? css.active : ''}`}
              onClick={(e) => {
                e.stopPropagation();
                onMoreClick(e);
              }}
            />
          )}
        </div>
      </div>
    );
  }
);

export default MessageItem;
