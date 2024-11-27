import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
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
import { useUser } from '@/contexts/UserContext';
import { apiCreateConversation, apiDeleteConversation } from '@/api/chatApi';
import { toast } from 'react-toastify';
import { conversationProps } from '@/types/apiTypes';
import { useWebSocket } from '@/contexts/WebSocketChatProvider';
import { useNavigate } from 'react-router-dom';




interface MessageListProps {
  onSelectMessage: (message: conversationProps | null) => void;
}

interface FriendProfile {
  avatar: string;
}

interface Friend {
  id: string;
  username: string;
  profile: FriendProfile;
}

const MessageList: React.FC<MessageListProps> = ({
  onSelectMessage,
}) => {
  const navigate = useNavigate();
  const [selectedConversation, setSelectedConversation] = useState<conversationProps | null>(null);
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
  const { lastMessage, updateActiveConversation, markAsReadData, markAsRead} = useWebSocket();

  const { 
    data: friendsData, 
    isLoading: friendsLoading, 
    error: friendsError 
  } = useGetData<Friend[]>('friends');
  
  const { 
    data: ConversationList, 
    refetch,
    isLoading: conversationsLoading,
    error: conversationsError 
  } = useGetData<conversationProps[]>('chat/conversations');
  
  
  console.log(" >> << ConversationList: ", ConversationList)
  useEffect(() => {
    if (lastMessage || markAsReadData?.status) {
      console.log("*************markAsReadData: ", markAsReadData)
      refetch();
    }
  }, [lastMessage, markAsReadData]);


  const filteredFriends = useMemo(() => {
    return friendsData?.filter((friend) =>
      friend.username.toLowerCase().includes(searchQuery.toLowerCase())
    ) || [];
  }, [friendsData, searchQuery]);


  useEffect(() => {
    const selectedFriend = location.state?.selectedFriend;
    
    if (selectedFriend) {
      const matchedConversation = ConversationList?.find(
        conversation => conversation.name === selectedFriend.username
      );
  
      if (matchedConversation) {
        handleConversationSelect(matchedConversation);
        
        setIsSearchActive(false);
        setSearchQuery('');
        setMenuState((prevState) => ({
          ...prevState,
          isOpen: false,
          activeIndex: null,
        }));
      } else {
        const friendToStart = friendsData?.find(
          friend => friend.username === selectedFriend.username
        );
  
        if (friendToStart) {
          handleSearchItemClick(friendToStart);
        }
      }
    }
  }, [
    location.state,
  ]);


  const handleMoreClick = (e: React.MouseEvent, index: number) => {
    e.stopPropagation();
    console.log("eeeeeeeeeeeeeee: ", e);
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


  const handleDelete = async (id: Number) => {
    try {
      const response = await apiDeleteConversation(id);
      
      toast.success(response.message);
      setMenuState((prevState) => ({
        ...prevState,
        isOpen: false,
        activeIndex: null,
      }));
      refetch();
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const handleClose = () => {
    if (selectedConversation !== null) {
      updateActiveConversation(-1);
      handleConversationSelect(null);
    }
    setMenuState((prevState) => ({
      ...prevState,
      isOpen: false,
      activeIndex: null,
    }));
  };
  
  
  const handleMarkAsRead = (id: number) => {
    if (ConversationList && menuState.activeIndex !== null) {
      markAsRead(id);
      setMenuState((prevState) => ({
        ...prevState,
        isOpen: false,
        activeIndex: null,
      }));
    }
  };

  const handleViewProfile = (name: string) => {
    if (ConversationList && menuState.activeIndex !== null) {
      navigate(`/profile/${name}`)
      setMenuState((prevState) => ({
        ...prevState,
        isOpen: false,
        activeIndex: null,
      }));
    }
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
  
  
  const handleConversationSelect = useCallback((conversation: conversationProps | null) => {
    console.log(">>>>setSelectedConversation: ", conversation)
    setSelectedConversation(conversation);
    onSelectMessage(conversation);
  }, [onSelectMessage]);

  
  const handleConversationClick = useCallback((conversation: conversationProps) => {
    handleConversationSelect(conversation);
    setIsSearchActive(false);
    setSearchQuery('');
    setMenuState(prev => ({
      ...prev,
      isOpen: false,
      activeIndex: null,
    }));
  }, [ConversationList, handleConversationSelect]);

  const handleSearchItemClick = useCallback(async (friend: Friend) => {
    try {
      const newConversation = await apiCreateConversation(friend.id);
      console.log("newConversation: ", newConversation);
      
      if (newConversation && newConversation.id) {
        await refetch();
        handleConversationSelect(newConversation);
        setIsSearchActive(false);
        setSearchQuery('');
        setMenuState(prev => ({
          ...prev,
          isOpen: false,
          activeIndex: null,
        }));
      } else {
        console.error('Invalid conversation created');
      }
    } catch (error) {
      console.error('Failed to create conversation:', error);
    }
 }, [user, refetch, handleConversationSelect]);

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
      {(friendsLoading || conversationsLoading) ? (
          <div className={css.statusMessage}>
            <div className={css.spinner}></div>
            <span >
              {friendsLoading 
                ? "Loading friends..." 
                : "Loading conversations..."}
            </span>
          </div>
        ) : friendsError || conversationsError ? (
          <div className={css.statusMessage}>
            <span className={css.error}>
              {friendsError 
                ? "Failed to load friends. " 
                : "Failed to load conversations. "}
              Please try again.
            </span>
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
                  onClick={() => handleSearchItemClick(friend)}
                />
              ))
            )}
          </>
        ) : (
          ConversationList?.map((conversation, index) => (
            <MessageItem
              key={index}
              conversation={conversation}
              isSelected={selectedConversation?.id === conversation.id}
              onClick={() => handleConversationClick(conversation)}
              onMoreClick={(e) => handleMoreClick(e, index)}
              showMoreIcon={true}
              isActive={menuState.activeIndex === index}
              ref={(el) => (buttonRefs.current[index] = el)}
            />
          ))
        )}

        {menuState.isOpen && menuState.position  && ConversationList && menuState.activeIndex !== null && (
          <div
            ref={menuRef}
            className={css.menu}
            style={{
              top: `${menuState.position.top}px`,
              left: `${menuState.position.left}px`,
            }}
          >
            <div 
              className={css.menuItem}
              onClick={() => handleMarkAsRead(ConversationList[menuState.activeIndex!].id)}>
              <FaCheck /> <span>Mark as read</span>
            </div>
            <div className={css.menuItem} onClick={handleClose}>
              <FaTimes /> <span>Close Chat</span>
            </div>
            <div className={css.menuItem}>
              <FaBell /> <span>Mute notifications</span>
            </div>
            <div
              className={css.menuItem}
              onClick={() => handleViewProfile(ConversationList[menuState.activeIndex!].name)}
            >
              <FaUser /> <span>View Profile</span>
            </div>
            <hr />
            <div
              className={css.menuItem}
            >
              <FaBan />
              <span>
                block
              </span>
            </div>
            <div className={css.menuItem}>
              <FaArchive /> <span>Archive chat</span>
            </div>
            <div 
              className={css.menuItem}
              onClick={() => handleDelete(ConversationList[menuState.activeIndex!].id)}
              >
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