import { Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import css from './Chat.module.css';

const Chat = () => {
  const { isLoggedIn } = useAuth();

  if (!isLoggedIn) {
    return <Navigate to="/signup" />;
  }
  return (
    <main className={css.container}>
      <div className={css.sidebarLeft}></div>
      <div className={css.chatBody}></div>
      <div className={css.sidebarRight}></div>
    </main>
  );
};

export default Chat;
