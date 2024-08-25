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
    position: null,
    activeIndex: null,
  });
  const menuRef = useRef(null);
  const buttonRefs = useRef<(HTMLDivElement | null)[]>([]);

  const handleClick = (index: number, message: Message) => {
    setSelectedMessageIndex(index);
    onSelectMessage(message);
    onSelectedSearch(false);
  };

  const handleMoreClick = (e: React.MouseEvent, index: number) => {
    e.stopPropagation();
    const { top, left, height } = (
      e.currentTarget as HTMLElement
    ).getBoundingClientRect();

    console.log('activeIndex: ', menuState.activeIndex);
    console.log('Index: ', index);
    setMenuState((prevState) => {
      if (prevState.activeIndex === index) {
        return {
          isOpen: !prevState.isOpen,
          position: prevState.position,
          activeIndex: prevState.isOpen ? null : index,
        };
      } else {
        return {
          isOpen: true,
          position: { top: top + height, left },
          activeIndex: index,
        };
      }
    });
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
          style={{ top: menuState.position.top, left: menuState.position.left }}
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
        </div>
      )}
    </div>
  );
};

export default MessageList;
