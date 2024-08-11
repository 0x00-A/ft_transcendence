import css from './Chat.module.css';
import Sidebar from '../../components/Sidebar/Sidebar';

const Chat = () => {
  return (
    <div className={css.container}>
      <Sidebar />
      <main className={css.dashboard}>
        <p>Chat</p>
      </main>
    </div>
  );
};

export default Chat;
