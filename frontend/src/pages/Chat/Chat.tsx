import { Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import css from './Chat.module.css';
import ChatHeader from '../../components/chat/ChatHeader';

const Chat = () => {
  const { isLoggedIn } = useAuth();

  if (!isLoggedIn) {
    return <Navigate to="/signup" />;
  }
  return (
    <main className={css.container}>
      <div className={css.sidebarLeft}></div>
      <div className={css.chatBody}>
        <ChatHeader />
        {/* Add more components for the chat messages here */}
      </div>
      <div className={css.sidebarRight}></div>
    </main>
  );
};

export default Chat;
