import React, { useState, useEffect } from 'react';
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

  const [isInviteDisabled, setIsInviteDisabled] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);

  const handleSendInvite = () => {
    if (isInviteDisabled) return;

    sendMessage({
      event: 'game_invite',
      from: user?.username,
      to: selectedConversation?.name,
    });

    setIsInviteDisabled(true);
    setTimeLeft(10);
  };

  useEffect(() => {
    let timer: NodeJS.Timeout;

    if (isInviteDisabled && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    }

    if (timeLeft === 0 && isInviteDisabled) {
      setIsInviteDisabled(false);
    }

    return () => clearInterval(timer);
  }, [isInviteDisabled, timeLeft]);

  return (
    <div className={css.buttonSection}>
      <div className={css.button}>
        <div
          className={css.icon}
          onClick={() => navigate(`/profile/${selectedConversation?.name}`)}
        >
          <User size={30} color="#F8F3E3" />
        </div>
        <p>Profile</p>
      </div>
      <div className={css.button}>
        <img
          onClick={handleSendInvite}
          className={`${css.iconInvite} ${isInviteDisabled ? css.disabled : ''}`}
          src="/icons/chat/Invite.svg"
          alt="Invite Button"
        />
        <p>Invite</p>
        {isInviteDisabled && (
          <span className={css.cooldownTimer}>{timeLeft}s</span>
        )}
      </div>
    </div>
  );
};

export default ButtonSection;
