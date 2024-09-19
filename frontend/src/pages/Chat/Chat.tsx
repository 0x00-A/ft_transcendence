import css from './Chat.module.css';
import moment from 'moment';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useState, useRef, useEffect } from 'react';
import ChatHeader from '../../components/chat/ChatHeader';
import MessageList from '../../components/chat/MessageList';
import SearchMessages from '../../components/chat/SearchMessages';
import OptionsButton from '../../components/chat/OptionsButton';
import NoChatSelected from '../../components/chat/NoChatSelected';
import SideInfoChat from '../../components/chat/SideInfoChat';
import MessageInput from '../../components/chat/MessageInput';
import MessageArea from '../../components/chat/MessageArea';
import chatData from './chatdata';
import messages from './messages';

interface SelectedMessageProps {
  avatar: string;
  name: string;
  lastMessage: string;
  time: string;
  unreadCount?: number;
  status: 'online' | 'offline' | 'typing';
  lastSeen?: string;
}
interface ChatMessage {
  name: string;
  content: string;
  sender: boolean;
  avatar: string;
  time: string;
}

const Chat = () => {
  const { isLoggedIn } = useAuth();
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const [selectedMessage, setSelectedMessage] =
    useState<SelectedMessageProps | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedSearch, setSelectedSearch] = useState<boolean>(false);
  const sidebarLeftRef = useRef<HTMLDivElement | null>(null);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [customSticker, setCustomSticker] = useState(
    '<img src="/icons/chat/like.svg" alt="love" />'
  );

  const [block, setBlock] = useState<boolean>(false);
  const [blockedUsers, setBlockedUsers] = useState<Map<string, boolean>>(
    new Map()
  );

  const handleClickOutside = (e: MouseEvent) => {
    if (
      sidebarLeftRef.current &&
      !sidebarLeftRef.current.contains(e.target as Node)
    ) {
      setSelectedSearch(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (selectedMessage) {
      setChatMessages(chatData[selectedMessage.name] || []);
    }
  }, [selectedMessage]);

  const toggleSidebar = () => {
    setIsExpanded(!isExpanded);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  if (!isLoggedIn) {
    return <Navigate to="/signup" />;
  }

  const filteredMessages = messages.filter((message) =>
    message.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSendMessage = (
    newMessage: string,
    isSticker: boolean = false
  ) => {
    if (selectedMessage) {
      const message = {
        name: 'You',
        content: newMessage,
        sender: true,
        avatar: 'https://picsum.photos/200',
        time: moment().format('HH:mm A'),
      };

      if (isSticker) {
        message.content = newMessage;
      }

      setChatMessages((prevMessages) => [...prevMessages, message]);
    }
  };

  const handleStickerChange = (newSticker: string) => {
    setCustomSticker(newSticker);
  };

  // Handle block/unblock for the selected user
  const handleBlock = () => {
    if (selectedMessage) {
      setBlockedUsers((prevBlockedUsers) => {
        const updatedBlockedUsers = new Map(prevBlockedUsers);
        const isBlocked = updatedBlockedUsers.get(selectedMessage.name);
        updatedBlockedUsers.set(selectedMessage.name, !isBlocked);
        return updatedBlockedUsers;
      });
    }
  };

  const isUserBlocked = selectedMessage
    ? blockedUsers.get(selectedMessage.name)
    : false;

  return (
    <main className={css.CenterContainer}>
      <div className={`${css.container} ${isExpanded ? css.expanded : ''}`}>
        <div className={css.sidebarLeft} ref={sidebarLeftRef}>
          <OptionsButton />
          <SearchMessages
            onSearch={handleSearch}
            onSelectedSearch={setSelectedSearch}
            query={searchQuery}
            setQuery={setSearchQuery}
          />
          <MessageList
            messages={selectedSearch ? filteredMessages : messages}
            onSelectMessage={setSelectedMessage}
            isSearchActive={selectedSearch}
            onSelectedSearch={setSelectedSearch}
            setQuery={setSearchQuery}
            setBlock={setBlock}
            block={block}
          />
        </div>
        <div className={css.chatBody}>
          {selectedMessage ? (
            <>
              <ChatHeader
                toggleSidebar={toggleSidebar}
                selectedMessage={selectedMessage}
              />
              <div className={css.messageArea}>
                <MessageArea messages={chatMessages} />
              </div>
              <MessageInput
                onSendMessage={handleSendMessage}
                customSticker={customSticker}
                setBlock={setBlock}
                block={block}
              />
            </>
          ) : (
            <NoChatSelected />
          )}
        </div>
        {selectedMessage && !isExpanded && (
          <div className={css.sidebarRight}>
            <SideInfoChat
              selectedMessage={selectedMessage}
              onEmojiChange={handleStickerChange}
            />
          </div>
        )}
      </div>
    </main>
  );
};

export default Chat;
