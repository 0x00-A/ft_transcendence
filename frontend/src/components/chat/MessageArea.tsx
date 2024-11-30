import React, { useEffect, useRef } from 'react';
import css from './MessageArea.module.css';
import Message from './Message';
import { useTyping } from '@/contexts/TypingContext';
import { useSelectedConversation } from '@/contexts/SelectedConversationContext';

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
}

const MessageArea: React.FC<MessageAreaProps> = ({ messages}) => {
  const messageEndRef = useRef<HTMLDivElement | null>(null);
  const { typing } = useTyping();
  const { selectedConversation } = useSelectedConversation();

  const isReceiver = typing.senderId == selectedConversation?.user_id;

  // console.log("typing: ", typing);
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
