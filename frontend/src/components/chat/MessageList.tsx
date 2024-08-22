import React from 'react';
import css from './MessageList.module.css';
import MessageItem from './MessageItem';
import SearchResultItem from './SearchResultItem';

interface Message {
  avatar: string;
  name: string;
  lastMessage: string;
  time: string;
  unreadCount?: number;
}

interface MessageListProps {
  messages: Message[];
  onSelectMessage: (message: Message) => void;
  isSearchActive: boolean;
}

const MessageList: React.FC<MessageListProps> = ({
  messages,
  onSelectMessage,
  isSearchActive,
}) => {
  const handleClick = (message: Message) => {
    onSelectMessage(message);
  };

  return (
    <div className={css.messageList}>
      {messages.map((message, index) =>
        isSearchActive ? (
          <SearchResultItem
            key={index}
            avatar={message.avatar}
            name={message.name}
            onClick={() => handleClick(message)}
          />
        ) : (
          <MessageItem
            key={index}
            avatar={message.avatar}
            name={message.name}
            lastMessage={message.lastMessage}
            time={message.time}
            unreadCount={message.unreadCount}
            isSelected={false}
            onClick={() => handleClick(message)}
          />
        )
      )}
    </div>
  );
};

export default MessageList;
