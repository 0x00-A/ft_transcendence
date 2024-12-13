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
  const [scrollPosition, setScrollPosition] = useState(0); // Track scroll position before loading more messages
  const [shouldScroll, setShouldScroll] = useState(true); // Whether to scroll to the bottom or not

  const { typing } = useTyping();
  const { selectedConversation } = useSelectedConversation();

  const isReceiver = typing.senderId === selectedConversation?.user_id;

  const handleLoadMore = () => {
    if (messageAreaRef.current) {
      // Record the current scroll position before loading more messages
      setScrollPosition(messageAreaRef.current.scrollTop);

      if (onLoadMore) {
        onLoadMore(); // Load more messages
      }

      setShouldScroll(false); // Prevent auto-scroll when loading more messages
    }
  };

  // Scroll to the bottom when new messages are added (if needed)
  useEffect(() => {
    if (shouldScroll && messageEndRef.current) {
      messageEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, shouldScroll]);

  // Ensure scroll position stays at the correct place when "Show More" is clicked
  useEffect(() => {
    if (!shouldScroll && messageAreaRef.current) {
      // After loading more messages, restore the previous scroll position
      messageAreaRef.current.scrollTop = scrollPosition;
      setShouldScroll(true); // Allow auto-scroll after the "Show More" is done
    }
  }, [shouldScroll, scrollPosition]);

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
