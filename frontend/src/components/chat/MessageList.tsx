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
  const [menuState, setMenuState] = useState<{
    isOpen: boolean;
    position: { top: number; left: number } | null;
    activeIndex: number | null;
  }>({
    isOpen: false,
    position: { top: 0, left: 0 },
    activeIndex: null,
  });
  const menuRef = useRef(null);
  const buttonRefs = useRef<(HTMLDivElement | null)[]>([]);

  const handleClick = (index: number, message: Message) => {
    setSelectedMessageIndex(index);
    onSelectMessage(message);
    onSelectedSearch(false);
    setMenuState((prevState) => ({
      ...prevState,
      isOpen: false,
      activeIndex: null,
    }));
  };
  const messageListRef = useRef<HTMLDivElement>(null);

  const handleMoreClick = (e: React.MouseEvent, index: number) => {
    e.stopPropagation();
    const messageListRect = messageListRef.current?.getBoundingClientRect();
    const buttonRect = (e.currentTarget as HTMLElement).getBoundingClientRect();

    if (messageListRect) {
      const scrollOffsetTop = messageListRef.current?.scrollTop || 0;
      const scrollOffsetLeft = messageListRef.current?.scrollLeft || 0;

      const spaceBelow = messageListRect.bottom - buttonRect.bottom;
      const spaceAbove = buttonRect.top - messageListRect.top;
      const menuHeight = 400;

      let top, left;

      if (spaceBelow >= menuHeight || spaceBelow > spaceAbove) {
        top = buttonRect.bottom - messageListRect.top + 25 + scrollOffsetTop;
        left = buttonRect.left - messageListRect.left - 185 + scrollOffsetLeft;
      } else {
        top =
          buttonRect.top -
          messageListRect.top -
          menuHeight +
          35 +
          scrollOffsetTop;
        left = buttonRect.left - messageListRect.left - 185 + scrollOffsetLeft;
      }

      setMenuState((prevState) => ({
        isOpen: prevState.activeIndex !== index || !prevState.isOpen,
        position: { top, left },
        activeIndex:
          prevState.activeIndex !== index || !prevState.isOpen ? index : null,
      }));
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      const isOutsideMenu =
        menuRef.current && !menuRef.current.contains(target);
      const isOutsideButtons = !buttonRefs.current.some(
        (ref) => ref && ref.contains(target)
      );

      if (isOutsideMenu && isOutsideButtons) {
        setMenuState((prevState) => ({
          ...prevState,
          isOpen: false,
          activeIndex: null,
        }));
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div ref={messageListRef} className={css.messageList}>
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
            {...message}
            isSelected={selectedMessageIndex === index}
            onClick={() => handleClick(index, message)}
            onMoreClick={(e) => handleMoreClick(e, index)}
            showMoreIcon={true}
            isActive={menuState.activeIndex === index}
            ref={(el) => (buttonRefs.current[index] = el)}
          />
        )
      )}
      {menuState.isOpen && menuState.position && (
        <div
          ref={menuRef}
          className={css.menu}
          style={{
            top: `${menuState.position.top}px`,
            left: `${menuState.position.left}px`,
          }}
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
