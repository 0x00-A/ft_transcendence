import React, { useEffect, useRef } from 'react';
import css from './MessageArea.module.css';
import Message from './Message';

interface MessageProps {
  id: number;
  conversation: number;
  sender: number;
  receiver: number;
  content: string;
  timestamp: string;
  seen: boolean;
}

interface ConversationProps {
  user1_id: number;
  id: number;
  avatar: string;
  name: string;
  lastMessage: string;
  time: string;
  unreadCount?: number;
  status: boolean;
  blocked: boolean;
}

interface MessageAreaProps {
  messages: MessageProps[];
  conversationData: ConversationProps | null;
}

const MessageArea: React.FC<MessageAreaProps> = ({ messages, conversationData}) => {
  const messageEndRef = useRef<HTMLDivElement | null>(null);

  console.log("rander MessageArea >>>>>>>>>>>>>>>>>>>>>>>>>")

  useEffect(() => {
    if (messageEndRef.current) {
      messageEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  return (
    <div className={css.messageArea}>
      {messages.map((message) => (
        <Message
          key={message.id}
          message={message}
          conversationData={conversationData}
        />
      ))}
      <div className={css.scrollMessages} ref={messageEndRef} />
    </div>
  );
};

export default MessageArea;
