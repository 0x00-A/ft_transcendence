import { Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useState } from 'react';
import css from './Chat.module.css';
import ChatHeader from '../../components/chat/ChatHeader';
import MessageList from '../../components/chat/MessageList';

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
];

const Chat = () => {
  const { isLoggedIn } = useAuth();
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const [selectedMessage, setSelectedMessage] =
    useState<SelectedMessageProps | null>(null);

  const toggleSidebar = () => {
    setIsExpanded(!isExpanded);
  };

  if (!isLoggedIn) {
    return <Navigate to="/signup" />;
  }

  return (
    <main className={`${css.container} ${isExpanded ? css.expanded : ''}`}>
      <div className={css.sidebarLeft}>
        <MessageList messages={messages} onSelectMessage={setSelectedMessage} />
      </div>
      <div className={css.chatBody}>
        <ChatHeader
          toggleSidebar={toggleSidebar}
          selectedMessage={selectedMessage}
        />
      </div>
      {!isExpanded && <div className={css.sidebarRight}></div>}
    </main>
  );
};

export default Chat;
