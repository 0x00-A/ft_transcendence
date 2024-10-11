import { useEffect, useRef } from 'react';
import css from './MessageArea.module.css';
import Message from './Message';

interface MessageProps {
  name: string;
  content: string;
  sender: boolean;
  avatar: string;
  time: string;
}
interface MessageAreaProps {
  messages: MessageProps[];
}

const MessageArea = ({ messages }: MessageAreaProps) => {
  const messageEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (messageEndRef.current) {
      messageEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  return (
    <div className={css.messageArea}>
      {messages.map((message, index) => (
        <Message key={index} {...message} />
      ))}
      <div className={css.scrollMessages} ref={messageEndRef} />
    </div>
  );
};

export default MessageArea;
