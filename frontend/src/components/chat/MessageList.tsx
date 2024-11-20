import React, { useState, useEffect, useRef, useMemo } from 'react';
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
import { useGetData } from '@/api/apiHooks';
import moment from 'moment';
import { useUser } from '@/contexts/UserContext';
import { apiCreateConversation } from '@/api/chatApi';

interface conversationProps {
  user1_id: number;
  id: number;
  avatar: string;
  name: string;
  lastMessage: string;
  time: string;
  unreadCount?: number;
  status: boolean;
  lastSeen?: string;
  blocked: boolean;
}

interface MessageListProps {
  onSelectMessage: (message: conversationProps | null) => void;
  onBlockUser: (userName: string) => void;
}

interface FriendProfile {
  avatar: string;
}

interface Friend {
  id: string;
  username: string;
  profile: FriendProfile;
}

interface Conversations {
  id: number; 
  user1: string; 
  user2: string;
  user1_id: number;
  user1_username: string;
  user2_username: string;
  user1_avatar: string;
  user2_avatar: string;
  last_message: string;
  unread_messages: number;
  is_online: boolean;
  created_at: string; 
  updated_at: string; 
}




const MessageList: React.FC<MessageListProps> = ({
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
    const {user} = useUser()
  const menuRef = useRef(null);
  const buttonRefs = useRef<(HTMLDivElement | null)[]>([]);
  const messageListRef = useRef<HTMLDivElement>(null);
  const searchContainerRef = useRef<HTMLDivElement>(null);
  const location = useLocation();
  const { data: friendsData, isLoading, error} = useGetData<Friend[]>('friends');
  const { data: ConversationList, refetch} = useGetData<Conversations[]>('chat/conversations');
  
  
  console.log("rander MessageList >>>>>>>>>>>>>>>>>>>>>>>>>")

  const formatConversationTime = (timestamp: string) => {
    const now = moment();
    const messageTime = moment(timestamp);
    if (messageTime.isSame(now, 'minute')) {
      return 'Just now';
    }
    if (now.diff(messageTime, 'minutes') < 60) {
      return `${now.diff(messageTime, 'minutes')} minutes ago`;
    }
    if (now.diff(messageTime, 'hours') < 24) {
      return `${now.diff(messageTime, 'hours')} hour${now.diff(messageTime, 'hours') === 1 ? '' : 's'} ago`;
    }
    if (now.diff(messageTime, 'days') < 7) {
      return `${now.diff(messageTime, 'days')} day${now.diff(messageTime, 'days') === 1 ? '' : 's'} ago`;
    }
    if (now.diff(messageTime, 'weeks') < 52) {
      return `${now.diff(messageTime, 'weeks')} week${now.diff(messageTime, 'weeks') === 1 ? '' : 's'} ago`;
    }
    return `${now.diff(messageTime, 'years')} year${now.diff(messageTime, 'years') === 1 ? '' : 's'} ago`;
  };
  
  
  const transformedMessages = useMemo(() => {
    return ConversationList?.map(conversation => {
      const isCurrentUserUser1 = user?.id === conversation.user1_id;
      const otherUserUsername = isCurrentUserUser1 ? conversation.user2_username : conversation.user1_username;
      const otherUserAvatar = isCurrentUserUser1 ? conversation.user2_avatar : conversation.user1_avatar;
      let lastMessage = conversation.last_message || 'send first message';
      if (lastMessage.length > 10) {
        lastMessage = lastMessage.slice(0, 10) + "...";
      }
      return {
        id: conversation.id,
        avatar: otherUserAvatar,
        name: otherUserUsername,
        lastMessage: lastMessage,
        time: formatConversationTime(conversation.updated_at),
        unreadCount: conversation.unread_messages || undefined,
        status: conversation.is_online,
        blocked: false,
        conversationId: conversation.id,
        user1_id: conversation.user1_id,
      };
    }) || [];
  }, [ConversationList, user, formatConversationTime]);
  

  const filteredFriends = friendsData?.filter((friend) =>
    friend.username.toLowerCase().includes(searchQuery.toLowerCase()) ) || [];

  useEffect(() => {
    const selectedFriend = location.state?.selectedFriend;
    if (selectedFriend) {
      const messageIndex = transformedMessages.findIndex(
        (transformedMessages) => transformedMessages.name === selectedFriend.username
      );

      if (messageIndex !== -1) {
        const foundMessage = transformedMessages[messageIndex];
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

  const handleClick = (index: number, conversation: conversationProps) => {
    refetch();
    onSelectMessage(conversation);
    setSelectedMessageIndex(index);
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

  
  
  useEffect(() => {
    
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Node;
    
      const isOutsideSearch = searchContainerRef.current && !searchContainerRef.current.contains(target);
      const isOutsideMainContainer = messageListRef.current && !messageListRef.current.contains(target);
    
      if (isOutsideSearch && isOutsideMainContainer) {
        setIsSearchActive(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);


  if (isLoading) {
    return <div className={css.loading}>Loading...</div>;
  }

  if (error) {
    return <div className={css.error}>Error loading friends</div>;
  }

  
  const handleSearchItemClick = async (friend: Friend, index: number) => {
    try {
      console.log("newConversation>>>> friend id: ", friend.id);

      const newConversation: Conversations = await apiCreateConversation(friend.id);
      console.log("newConversation>>>>: ", newConversation);
      
      const transformedConversation: conversationProps = {
        id: newConversation.id,
        user1_id: newConversation.user1_id,
        avatar: user?.id === newConversation.user1_id ? newConversation.user2_avatar : newConversation.user1_avatar,
        name: user?.id === newConversation.user1_id ? newConversation.user2_username : newConversation.user1_username,
        lastMessage: newConversation.last_message || 'Send first message',
        time: formatConversationTime(newConversation.created_at),
        status: newConversation.is_online,
        blocked: false,
      };

      refetch();
      setSelectedMessageIndex(index);
      onSelectMessage(transformedConversation);
      setIsSearchActive(false);
      setSearchQuery('');
      setMenuState((prevState) => ({
        ...prevState,
        isOpen: false,
        activeIndex: null,
      }));

    } catch (error) {
      console.error('Failed to create conversation:', error);
    }
  };

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
      {isLoading ? (
          <div className={css.statusMessage}>
            <div className={css.spinner}></div>
            <span>Loading friends...</span>
          </div>
        ) : error ? (
          <div className={css.statusMessage}>
            <span className={css.error}>Failed to load friends. Please try again.</span>
          </div>
        ) : isSearchActive ? (
          <>
            {searchQuery && filteredFriends.length === 0 ? (
              <div className={css.statusMessage}>
                <span>No users found matching "{searchQuery}"</span>
              </div>
            ) : (
              filteredFriends.map((friend, index) => (
                <SearchResultItem
                  key={index}
                  avatar={friend.profile.avatar}
                  name={friend.username}
                  onClick={() => handleSearchItemClick(friend, index)}
                />
              ))
            )}
          </>
        ) : (
          transformedMessages.map((conversation, index) => (
            <MessageItem
              key={index}
              {...conversation}
              isSelected={selectedMessageIndex === index}
              onClick={() => handleClick(index, conversation)}
              onMoreClick={(e) => handleMoreClick(e, index)}
              showMoreIcon={true}
              isActive={menuState.activeIndex === index}
              ref={(el) => (buttonRefs.current[index] = el)}
            />
          ))
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
              onClick={() => handleBlock(transformedMessages[menuState.activeIndex!].name)}
            >
              <FaBan />
              <span>
                {transformedMessages[selectedMessageIndex!]?.blocked ? 'Unblock' : 'Block'}
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