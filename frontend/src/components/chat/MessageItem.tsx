import React, { forwardRef } from 'react';
import css from './MessageItem.module.css';
import { CgMoreO } from 'react-icons/cg';
import { useTyping } from '@/contexts/TypingContext';
import { conversationProps } from '@/types/apiTypes';
import moment from 'moment';

interface conversationListProps {
  isSelected: boolean;
  onClick: () => void;
  onMoreClick: (e: React.MouseEvent) => void;
  showMoreIcon: boolean;
  isActive: boolean;
  conversation: conversationProps;
}

const MessageItem = forwardRef<HTMLDivElement, conversationListProps>(
  (
    {
      conversation,
      isSelected,
      onClick,
      onMoreClick,
      showMoreIcon,
      isActive,
    },
    ref
  ) => {
    const { typing } = useTyping();

  const formatTime = (timestamp: string | number | Date) => {
      const now = moment();
      const time = moment(timestamp);
    
      const diffSeconds = now.diff(time, 'seconds');
    
      if (diffSeconds < 60) return 'Just now';
    
      const diffMinutes = now.diff(time, 'minutes');
      if (diffMinutes < 60) return `${diffMinutes} minute${diffMinutes > 1 ? 's' : ''} ago`;
    
      const diffHours = now.diff(time, 'hours');
      if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    
      const diffDays = now.diff(time, 'days');
      if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    
      const diffWeeks = now.diff(time, 'weeks');
      if (diffWeeks < 52) return `${diffWeeks} week${diffWeeks > 1 ? 's' : ''} ago`;
    
      const diffYears = now.diff(time, 'years');
      return `${diffYears} year${diffYears > 1 ? 's' : ''} ago`;
    };

    const isReceiver = typing.senderId == conversation.user_id;

    return (
      <div
        ref={ref}
        className={`${css.messageItemWrapper} ${isSelected ? css.selected : ''}`}
        onClick={onClick}
      >
        <div className={css.messageItem}>
          <div className={`${css.userAvatar} ${conversation.status && !(typing.typing && isReceiver) ? css.online : ''}`}>
              <img
                src={conversation.avatar}
                alt="User"
                className={css.imageAvatar}
              />
              {typing.typing && isReceiver && (
                <div className={css.typingIndicator}>
                  <span className={css.typingDot}></span>
                  <span className={css.typingDot}></span>
                  <span className={css.typingDot}></span>
                </div>
              )}
          </div>
          <div className={css.messageContent}>
            <div className={css.messageHeader}>
              <span className={css.name}>{conversation.name}</span>
              <span className={css.time}>{formatTime(conversation.time)}</span>
            </div>
            <div className={css.messageBody}>
              <span className={`${css.lastMessage}`}>
                {conversation.lastMessage}
              </span>
              {conversation.unreadCount && conversation.unreadCount > 0 && (
                <span className={css.unreadCount}>{conversation.unreadCount}</span>
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
