import React, { useEffect, useRef, useState } from 'react';
import css from './MessageArea.module.css';
import Message from './Message';
import { useUser } from '@/contexts/UserContext';
import { useTyping } from '@/contexts/TypingContext';

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
}

const MessageArea: React.FC<MessageAreaProps> = ({ messages, conversationData}) => {
  const messageEndRef = useRef<HTMLDivElement | null>(null);
  const { user } = useUser(); 
  const { typing } = useTyping();
  const isSender = user?.id === typing.senderId; 


  useEffect(() => {
    if (messageEndRef.current) {
      messageEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, typing.typing]);


  return (
    <div className={css.messageArea}>
      {messages.map((message, index) => (
        <Message
          key={index}
          message={message}
          conversationData={conversationData}
        />
      ))}
      {typing.typing && !isSender && (
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
