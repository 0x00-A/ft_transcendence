import React, { forwardRef } from 'react';
import css from './MessageItem.module.css';
import { CgMoreO } from 'react-icons/cg';
import { useTyping } from '@/contexts/TypingContext';
import { useUser } from '@/contexts/UserContext';
import { conversationProps } from '@/types/apiTypes';

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
    
    const isReceiver = typing.senderId == conversation.user_id;
    const typingIndicator = typing.typing && isReceiver
      ? 'Typing...'
      : conversation.lastMessage;

    return (
      <div
        ref={ref}
        className={`${css.messageItemWrapper} ${isSelected ? css.selected : ''}`}
        onClick={onClick}
      >
        <div className={css.messageItem}>
          <div className={`${css.userAvatar} ${conversation.status ? css.online : ''}`}>
              <img
                src={conversation.avatar}
                alt="User"
                className={css.imageAvatar}
              />
          </div>
          <div className={css.messageContent}>
            <div className={css.messageHeader}>
              <span className={css.name}>{conversation.name}</span>
              <span className={css.time}>{conversation.time}</span>
            </div>
            <div className={css.messageBody}>
              <span className={`${css.lastMessage} ${typing.typing && isReceiver ? css.typing : ''}`}>
                {typingIndicator}
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
