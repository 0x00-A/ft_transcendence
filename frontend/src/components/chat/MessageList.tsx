// MessageList.tsx
import React, { useState, useEffect, useRef } from 'react';
import css from './MessageList.module.css';
import MessageItem from './MessageItem';
import SearchResultItem from './SearchResultItem';
import {
  FaCheck,
  FaBell,
  FaUser,
  FaBan,
  FaArchive,
  FaTrash,
  FaThumbtack,
} from 'react-icons/fa';

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
  const [showMenu, setShowMenu] = useState<boolean>(false);
  const [menuPosition, setMenuPosition] = useState<{
    top: number;
    left: number;
  } | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  const handleClick = (index: number, message: Message) => {
    setSelectedMessageIndex(index);
    onSelectMessage(message);
    onSelectedSearch(false);
  };

  const handleMoreClick = (position: { top: number; left: number }) => {
    setShowMenu(!showMenu);
    setMenuPosition(position);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

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
            onMoreClick={handleMoreClick}
          />
        )
      )}
      {showMenu && menuPosition && (
        <div
          className={css.menu}
          ref={menuRef}
          style={{ top: menuPosition.top + 28, left: menuPosition.left - 190 }}
        >
          <div className={css.menuItem}>
            <FaCheck /> Mark as read
          </div>
          <div className={css.menuItem}>
            <FaBell /> Mute notifications
          </div>
          <div className={css.menuItem}>
            <FaUser /> View Profile
          </div>
          <hr />
          <div className={css.menuItem}>
            <FaBan /> Block
          </div>
          <div className={css.menuItem}>
            <FaArchive /> Archive chat
          </div>
          <div className={css.menuItem}>
            <FaTrash /> Delete chat
          </div>
          <div className={css.menuItem}>
            <FaThumbtack /> Pin chat
          </div>
        </div>
      )}
    </div>
  );
};

export default MessageList;
