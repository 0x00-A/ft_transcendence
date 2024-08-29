import css from './Chat.module.css';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useState, useRef, useEffect } from 'react';
import ChatHeader from '../../components/chat/ChatHeader';
import MessageList from '../../components/chat/MessageList';
import SearchMessages from '../../components/chat/SearchMessages';
import OptionsButton from '../../components/chat/OptionsButton';
import NoChatSelected from '../../components/chat/NoChatSelected';
import SideInfoChat from '../../components/chat/SideInfoChat';

interface SelectedMessageProps {
  avatar: string;
  name: string;
  lastMessage: string;
  time: string;
  unreadCount?: number;
}

const messages: SelectedMessageProps[] = [
  {
    avatar: 'https://picsum.photos/200',
    name: 'Rachid el ismaili',
    lastMessage: 'wfin akhouy l3ziz hani.....',
    time: '21:15 PM',
    unreadCount: 3,
  },
  {
    avatar: 'https://picsum.photos/200',
    name: 'abde latif',
    lastMessage: 'wakhdmo adrari.....',
    time: '21:15 PM',
    unreadCount: 99,
  },
  {
    avatar: 'https://picsum.photos/200',
    name: 'mehadi f',
    lastMessage: 'chni 9alih.....',
    time: '21:15 PM',
  },
  {
    avatar: 'https://picsum.photos/200',
    name: 'Yassmine',
    lastMessage: 'nmchiw ntghdaw',
    time: '21:15 PM',
  },
  {
    avatar: 'https://picsum.photos/200',
    name: 'hamza',
    lastMessage: 'waaa3 lminisheeeel',
    time: '21:15 PM',
    unreadCount: 1,
  },
  {
    avatar: 'https://picsum.photos/200',
    name: 'hex01e',
    lastMessage: 'appah',
    time: '21:15 PM',
    unreadCount: 99,
  },
  {
    avatar: 'https://picsum.photos/200',
    name: 'hex01e',
    lastMessage: 'appah',
    time: '21:15 PM',
    unreadCount: 99,
  },
  {
    avatar: 'https://picsum.photos/200',
    name: 'hex01e',
    lastMessage: 'appah',
    time: '21:15 PM',
    unreadCount: 99,
  },
  {
    avatar: 'https://picsum.photos/200',
    name: 'hex01e',
    lastMessage: 'appah',
    time: '21:15 PM',
    unreadCount: 99,
  },
];

const Chat = () => {
  const { isLoggedIn } = useAuth();
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const [selectedMessage, setSelectedMessage] =
    useState<SelectedMessageProps | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedSearch, setSelectedSearch] = useState<boolean>(false);
  const sidebarLeftRef = useRef<HTMLDivElement | null>(null);

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

  return (
    <main className={css.CenterContainer}>
      <div className={`${css.container} ${isExpanded ? css.expanded : ''}`}>
        <div className={css.sidebarLeft} ref={sidebarLeftRef}>
          <OptionsButton />
          <SearchMessages
            onSearch={handleSearch}
            onSelectedSearch={setSelectedSearch}
          />
          <MessageList
            messages={selectedSearch ? filteredMessages : messages}
            onSelectMessage={setSelectedMessage}
            isSearchActive={selectedSearch}
            onSelectedSearch={setSelectedSearch}
          />
        </div>
        <div className={css.chatBody}>
          {selectedMessage ? (
            <ChatHeader
              toggleSidebar={toggleSidebar}
              selectedMessage={selectedMessage}
            />
          ) : (
            <NoChatSelected />
          )}
        </div>
        {selectedMessage && !isExpanded && (
          <div className={css.sidebarRight}>
            <SideInfoChat selectedMessage={selectedMessage} />
          </div>
        )}
      </div>
    </main>
  );
};

export default Chat;
