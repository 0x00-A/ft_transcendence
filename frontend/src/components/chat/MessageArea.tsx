import React, { useEffect, useRef, useState } from 'react';
import css from './MessageArea.module.css';
import Message from './Message';
import { useUser } from '@/contexts/UserContext';
import { useTyping } from '@/contexts/TypingContext';
import { conversationProps } from '@/types/apiTypes';

interface MessageProps {
  id: number;
  conversation: number;
  sender: number;
  receiver: number;
  content: string;
  timestamp: string;
  seen?: boolean;
}



interface MessageAreaProps {
  messages: MessageProps[];
  conversationData: conversationProps | null;
}

const MessageArea: React.FC<MessageAreaProps> = ({ messages, conversationData}) => {
  const messageEndRef = useRef<HTMLDivElement | null>(null);
  const { user } = useUser(); 
  const { typing } = useTyping();
  const isReceiver = user?.id === typing.receiverId; 

  console.log("typing: ", typing);
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
      {typing.typing && isReceiver && (
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
