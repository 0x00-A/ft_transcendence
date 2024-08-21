import css from './MessageList.module.css';
import MessageItem from './MessageItem';

const MessageList = ({ messages }) => {
  return (
    <div className={css.messageList}>
      {messages.map((message, index) => (
        <MessageItem
          key={index}
          avatar={message.avatar}
          name={message.name}
          lastMessage={message.lastMessage}
          time={message.time}
          unreadCount={message.unreadCount}
        />
      ))}
    </div>
  );
};

export default MessageList;
