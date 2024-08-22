import React, { useState } from 'react';
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
  onSelectedSearch: (selectedSearch: boolean) => void;
}

const MessageList: React.FC<MessageListProps> = ({
  messages,
  onSelectMessage,
  isSearchActive,
  onSelectedSearch,
}) => {
  const [selectedMessageIndex, setSelectedMessageIndex] = useState<
    number | null
  >(null);

  const handleClick = (index: number, message: Message) => {
    setSelectedMessageIndex(index);
    onSelectMessage(message);
    onSelectedSearch(false);
  };

  return (
    <div className={css.messageList}>
      {messages.map((message, index) =>
        isSearchActive ? (
          <SearchResultItem
            key={index}
            avatar={message.avatar}
            name={message.name}
            onClick={() => handleClick(index, message)}
          />
        ) : (
          <MessageItem
            key={index}
            avatar={message.avatar}
            name={message.name}
            lastMessage={message.lastMessage}
            time={message.time}
            unreadCount={message.unreadCount}
            isSelected={index === selectedMessageIndex}
            onClick={() => handleClick(index, message)}
          />
        )
      )}
    </div>
  );
};

export default MessageList;
