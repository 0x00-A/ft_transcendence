import React, { useEffect, useRef, useState } from 'react';
import css from './MessageArea.module.css';
import Message from './Message';
import { useTyping } from '@/contexts/TypingContext';
import { useSelectedConversation } from '@/contexts/SelectedConversationContext';
import { MessageProps } from '@/types/apiTypes';

interface MessageAreaProps {
  messages: MessageProps[];
  onLoadMore?: () => void;
  hasMore?: boolean;
}

const MessageArea: React.FC<MessageAreaProps> = ({ messages, onLoadMore, hasMore }) => {
  const messageEndRef = useRef<HTMLDivElement | null>(null);
  const messageAreaRef = useRef<HTMLDivElement | null>(null);
  const [shouldScroll, setShouldScroll] = useState(true);

  const { typing } = useTyping();
  const { selectedConversation } = useSelectedConversation();

  const isReceiver = typing.senderId === selectedConversation?.user_id;

  const handleLoadMore = () => {
    if (messageAreaRef.current) {
      const scrollFromBottom = messageAreaRef.current.scrollHeight - 
                                messageAreaRef.current.scrollTop - 
                                messageAreaRef.current.clientHeight;

      setShouldScroll(false);

      if (onLoadMore) {
        onLoadMore();
      }

      setTimeout(() => {
        if (messageAreaRef.current) {
          messageAreaRef.current.scrollTop = 
            messageAreaRef.current.scrollHeight - 
            messageAreaRef.current.clientHeight - 
            scrollFromBottom;
        }
      }, 0);
    }
  };

  useEffect(() => {
    if (shouldScroll && messageEndRef.current) {
      messageEndRef.current.scrollIntoView({ behavior: 'smooth' });
      
      const timer = setTimeout(() => {
        setShouldScroll(false);
      }, 100);

      return () => clearTimeout(timer);
    }
  }, [messages, typing.typing, shouldScroll]);

  return (
    <div className={css.messageArea} ref={messageAreaRef}>
      {hasMore && (
        <button className={css.loadMoreButton} onClick={handleLoadMore}>
          Show More
        </button>
      )}
      {messages.map((message, index) => (
        <Message key={index} message={message} />
      ))}
      {typing.typing && isReceiver && (
        <div className={css.typingIndicator}>
          <span className={css.typingDot}></span>
          <span className={css.typingDot}></span>
          <span className={css.typingDot}></span>
        </div>
      )}
      <div ref={messageEndRef} />
    </div>
  );
};

export default MessageArea;