import React, { useEffect, useRef } from 'react';
import css from './MessageArea.module.css';
import Message from './Message';
import { useUser } from '@/contexts/UserContext';

interface MessageProps {
  id: number;
  conversation: number;
  sender: number;
  receiver: number;
  content: string;
  timestamp: string;
  seen?: boolean;
}

interface ConversationProps {
  user1_id: number;
  user2_id: number;
  id: number;
  avatar: string;
  name: string;
}

interface MessageAreaProps {
  messages: MessageProps[];
  conversationData: ConversationProps | null;
  typing: boolean;
}

const MessageArea: React.FC<MessageAreaProps> = ({ messages, typing, conversationData}) => {
  const messageEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (messageEndRef.current) {
      messageEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const { user } = useUser();
  const isSender = user?.id === conversationData?.user2_id;

  const showTypingIndicator = typing && !isSender;

  return (
    <div className={css.messageArea}>
      {messages.map((message, index) => (
        <Message
          key={index}
          message={message}
          conversationData={conversationData}
          
        />
      ))}
      {showTypingIndicator && (
        <div className={css.typingIndicator}>
          <span className={css.typingDot}></span>
          <span className={css.typingDot}></span>
          <span className={css.typingDot}></span>
      </div>
      )}
      <div className={css.scrollMessages} ref={messageEndRef} />
    </div>
  );
};

export default MessageArea;
