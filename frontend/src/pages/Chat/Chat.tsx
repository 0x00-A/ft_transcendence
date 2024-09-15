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
    name: 'oussama',
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
    name: 'yasmine',
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
    name: 'naima',
    lastMessage: 'waa333',
    time: '21:15 PM',
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
  ,
  {
    avatar: 'https://picsum.photos/200',
    name: 'naima',
    lastMessage: 'waa333',
    time: '21:15 PM',
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

interface ChatMessage {
  name: string;
  content: string;
  sender: boolean;
  avatar: string;
  time: string;
}

const messageschats: ChatMessage[] = [
  {
    name: 'rachid el ismaiyly',
    content: 'Hey, how are you? fdjhjkdf jkdf dmgdf hg hjdf ghasfdgf dsds sd',
    sender: false,
    avatar: 'https://picsum.photos/200',
    time: '21:15 PM',
  },
  {
    name: 'rachid el ismaiyly',
    content:
      'I’m good, how about you fdjhjkdf jkdf dmgdf hg hjdf ghasfdgf dsds sd?',
    sender: true,
    avatar: 'https://picsum.photos/200',
    time: '21:16 PM',
  },
  {
    name: 'rachid el ismaiyly',
    content: 'Doing well, thanks!',
    sender: false,
    avatar: 'https://picsum.photos/200',
    time: '21:17 PM',
  },
  {
    name: 'rachid el ismaiyly',
    content:
      'It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution',
    sender: true,
    avatar: 'https://picsum.photos/200',
    time: '21:18 PM',
  },
  {
    name: 'rachid el ismaiyly',
    content:
      'It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution',
    sender: true,
    avatar: 'https://picsum.photos/200',
    time: '21:18 PM',
  },
  {
    name: 'rachid el ismaiyly',
    content:
      'It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution',
    sender: true,
    avatar: 'https://picsum.photos/200',
    time: '21:18 PM',
  },
  {
    name: 'rachid el ismaiyly',
    content:
      'It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution',
    sender: true,
    avatar: 'https://picsum.photos/200',
    time: '21:18 PM',
  },
  {
    name: 'rachid el ismaiyly',
    content:
      'It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution',
    sender: true,
    avatar: 'https://picsum.photos/200',
    time: '21:18 PM',
  },
  {
    name: 'rachid el ismaiyly',
    content:
      'It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution',
    sender: true,
    avatar: 'https://picsum.photos/200',
    time: '21:18 PM',
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
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);

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
    setChatMessages(messageschats);
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

  const handleSendMessage = (newMessage: string) => {
    if (selectedMessage) {
      const message = {
        name: 'You',
        content: newMessage,
        sender: true,
        avatar: 'https://picsum.photos/200',
        time: moment().format('HH:mm A'),
      };
      setChatMessages((prevMessages) => [...prevMessages, message]);
    }
  };

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
            <>
              <ChatHeader
                toggleSidebar={toggleSidebar}
                selectedMessage={selectedMessage}
              />
              <div className={css.messageArea}>
                <MessageArea messages={chatMessages} />
              </div>
              <MessageInput onSendMessage={handleSendMessage} />
            </>
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
