import { Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useState } from 'react';
import css from './Chat.module.css';
import ChatHeader from '../../components/chat/ChatHeader';

const Chat = () => {
  const { isLoggedIn } = useAuth();
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleSidebar = () => {
    setIsExpanded(!isExpanded);
  };

  if (!isLoggedIn) {
    return <Navigate to="/signup" />;
  }

  return (
    <main className={`${css.container} ${isExpanded ? css.expanded : ''}`}>
      <div className={css.sidebarLeft}></div>
      <div className={css.chatBody}>
        <ChatHeader toggleSidebar={toggleSidebar} isExpanded={isExpanded} />
        {/* Add more components for the chat messages here */}
      </div>
      {!isExpanded && <div className={css.sidebarRight}></div>}
    </main>
  );
};

export default Chat;
