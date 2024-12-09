import css from './ButtonSection.module.css';
import { useWebSocket } from '@/contexts/WebSocketContext';
import { useUser } from '@/contexts/UserContext';
import { useSelectedConversation } from '@/contexts/SelectedConversationContext';
import { useNavigate } from 'react-router-dom';
import { User } from 'lucide-react';


const ButtonSection: React.FC = () => {
  const { user } = useUser();
  const { sendMessage } = useWebSocket();
  const { selectedConversation } = useSelectedConversation();
  const navigate = useNavigate();
  
  const handleSendInvite = () => {
    sendMessage({
      event: 'game_invite',
      from: user?.username,
      to: selectedConversation?.name,
    });
  };
  
  return (
    <div className={css.buttonSection}>
      <div className={css.button}>
        <div className={css.icon} onClick={() => navigate(`/profile/${selectedConversation?.name}`)}>
          <User size={35} color="#F8F3E3" />
        </div>
        <p>Profile</p>
      </div>
      <div className={css.button}>
        <img
          onClick={handleSendInvite}
          className={css.icon}
          src="/icons/chat/Invite.svg"
          alt="Invite Button"
        />
        <p>Invite</p>
      </div>
    </div>
  );
};


export default ButtonSection;
