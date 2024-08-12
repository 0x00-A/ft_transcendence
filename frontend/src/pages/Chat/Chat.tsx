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
      <p>Chat</p>
    </main>
  );
};

export default Chat;
