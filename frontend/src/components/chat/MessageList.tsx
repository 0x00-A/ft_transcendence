import React, { useState, useEffect, useRef } from 'react';
import css from './MessageList.module.css';
import MessageItem from './MessageItem';
import SearchResultItem from './SearchResultItem';
import { useLocation } from 'react-router-dom';
import { FiSearch } from 'react-icons/fi';
import { HiArrowLeft } from 'react-icons/hi';
import {
  FaCheck,
  FaBell,
  FaUser,
  FaBan,
  FaArchive,
  FaTrash,
  FaThumbtack,
  FaTimes,
} from 'react-icons/fa';

interface Message {
  avatar: string;
  name: string;
  lastMessage: string;
  time: string;
  unreadCount?: number;
  status: 'online' | 'offline' | 'typing';
  lastSeen?: string;
  blocked: boolean;
}

interface MessageListProps {
  messages: Message[];
  onSelectMessage: (message: Message | null) => void;
  onBlockUser: (userName: string) => void;
}

const MessageList: React.FC<MessageListProps> = ({
  messages,
  onSelectMessage,
  onBlockUser,
}) => {
  const [selectedMessageIndex, setSelectedMessageIndex] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isSearchActive, setIsSearchActive] = useState<boolean>(false);
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
  const messageListRef = useRef<HTMLDivElement>(null);
  const searchContainerRef = useRef<HTMLDivElement>(null);
  const location = useLocation();

  const filteredMessages = messages.filter((message) =>
    message.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  useEffect(() => {
    const selectedFriend = location.state?.selectedFriend;
    if (selectedFriend) {
      const messageIndex = messages.findIndex(
        (message) => message.name === selectedFriend.username
      );

      if (messageIndex !== -1) {
        const foundMessage = messages[messageIndex];
        onSelectMessage(foundMessage);
        setSelectedMessageIndex(messageIndex);
        setIsSearchActive(false);
        setSearchQuery('');
        setMenuState((prevState) => ({
          ...prevState,
          isOpen: false,
          activeIndex: null,
        }));
      }
    }
  }, [location.state]);

  const handleClick = (index: number, message: Message) => {
    setSelectedMessageIndex(index);
    onSelectMessage(message);
    setIsSearchActive(false);
    setSearchQuery('');
    setMenuState((prevState) => ({
      ...prevState,
      isOpen: false,
      activeIndex: null,
    }));
  };

  const handleMoreClick = (e: React.MouseEvent, index: number) => {
    e.stopPropagation();
    const messageListRect = messageListRef.current?.getBoundingClientRect();
    const buttonRect = (e.currentTarget as HTMLElement).getBoundingClientRect();

    if (messageListRect) {
      const spaceBelow = messageListRect.bottom - buttonRect.bottom;
      const spaceAbove = buttonRect.top - messageListRect.top;
      const menuHeight = 400;

      let top, left;

      if (spaceBelow >= menuHeight || spaceBelow > spaceAbove) {
        top = buttonRect.bottom - messageListRect.top + 110;
        left = buttonRect.left - messageListRect.left;
      } else {
        top = buttonRect.top - messageListRect.top - menuHeight + 190;
        left = buttonRect.left - messageListRect.left;
      }

      setMenuState((prevState) => ({
        isOpen: prevState.activeIndex !== index || !prevState.isOpen,
        position: { top, left },
        activeIndex:
          prevState.activeIndex !== index || !prevState.isOpen ? index : null,
      }));
    }
  };

  const handleBlock = (userName: string) => {
    onBlockUser(userName);
    setMenuState((prevState) => ({
      ...prevState,
      isOpen: false,
      activeIndex: null,
    }));
  };

  const handleClose = () => {
    if (selectedMessageIndex !== null) {
      onSelectMessage(null);
      setSelectedMessageIndex(null);
    }
    setMenuState((prevState) => ({
      ...prevState,
      isOpen: false,
      activeIndex: null,
    }));
  };

  const handleSearchInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setIsSearchActive(true);
  };

  const handleSearchClose = () => {
    setIsSearchActive(false);
    setSearchQuery('');
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      const isOutsideMenu = menuRef.current && !menuRef.current.contains(target);
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

  const handleClickOutside = (e: MouseEvent) => {
    if (
      searchContainerRef.current &&
      !searchContainerRef.current.contains(e.target as Node)
    ) {
      setIsSearchActive(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className={css.container}>
      <div ref={searchContainerRef} className={css.searchContainer}>
        <div className={`${css.searchBar} ${isSearchActive ? css.showIcon : ''}`}>
          {isSearchActive && (
            <HiArrowLeft className={css.arrowIcon} onClick={handleSearchClose} />
          )}
          <FiSearch
            className={`${css.searchIcon} ${isSearchActive ? css.searchInSide : ''}`}
          />
          <input
            type="text"
            placeholder="Search Friends"
            value={searchQuery}
            onChange={handleSearchInput}
            onClick={() => setIsSearchActive(true)}
            className={`${css.searchInput} ${isSearchActive ? css.shrinkWidth : ''}`}
          />
        </div>
      </div>

      <div ref={messageListRef} className={css.messageList}>
        {(isSearchActive ? filteredMessages : messages).map((message, index) =>
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
              <FaCheck /> <span>Mark as read</span>
            </div>
            <div className={css.menuItem} onClick={handleClose}>
              <FaTimes /> <span>Close Chat</span>
            </div>
            <div className={css.menuItem}>
              <FaBell /> <span>Mute notifications</span>
            </div>
            <div className={css.menuItem}>
              <FaUser /> <span>View Profile</span>
            </div>
            <hr />
            <div
              className={css.menuItem}
              onClick={() => handleBlock(messages[menuState.activeIndex!].name)}
            >
              <FaBan />
              <span>
                {messages[selectedMessageIndex!]?.blocked ? 'Unblock' : 'Block'}
              </span>
            </div>
            <div className={css.menuItem}>
              <FaArchive /> <span>Archive chat</span>
            </div>
            <div className={css.menuItem}>
              <FaTrash />
              <span>Delete chat</span>
            </div>
            <div className={css.menuItem}>
              <FaThumbtack />
              <span>Pin chat</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MessageList;