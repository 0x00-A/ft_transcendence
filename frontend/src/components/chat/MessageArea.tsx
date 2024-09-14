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
  return (
    <div className={css.messageArea}>
      {messages.map((message, index) => (
        <Message key={index} {...message} />
      ))}
    </div>
  );
};

export default MessageArea;
