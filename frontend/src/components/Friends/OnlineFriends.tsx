import React from 'react';
import css from './OnlineFriends.module.css';
import { useNavigate } from 'react-router-dom';
import { useGetData } from '../../api/apiHooks';
import NoOnlineFriends from './NoOnlineFriends';
import { MessageSquareText } from 'lucide-react';
import FriendSkeleton from './FriendSkeleton';
import { useUser } from '@/contexts/UserContext';
import { useWebSocket } from '@/contexts/WebSocketContext';


interface Friend {
  id: number;
  username: string;
  profile: {
    id: number;
    avatar: string;
    is_online: boolean;
  }
}

const OnlineFriends: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useUser();
  const { sendMessage } = useWebSocket();
  const { data: onlineFriends, isLoading, error } = useGetData<Friend[]>('online-friends');

  const handleMessageClick = (friend: Friend) => {
    navigate('/chat', { state: { selectedFriend: friend } });
  };

  const handleSendInvite = (username: string) => {
    sendMessage({
      event: 'game_invite',
      from: user?.username,
      to: username,
    });
  };


  return (
    <div className={css.onlineFriends}>
      <h1 className={css.title}>Online Friends</h1>
      <div className={css.friendList}>
        {isLoading ? (
          <FriendSkeleton/>
        ) : error ? (
          <p>Error: loading</p>
        ) : onlineFriends && onlineFriends.length > 0 ? (
          onlineFriends.map((friend) => (
            <div key={friend.id} className={css.friendCard}>
              <img
                src={friend.profile.avatar}
                alt={friend.username}
                className={css.avatar}
              />
              <div className={css.userInfo}>
                <span className={css.username}>{friend.username}</span>
                <span className={css.online}>Online</span>
              </div>
              <div className={css.actions}>
              <button
                  className={`${css.actionButton} ${css.messageButton}`}
                  onClick={() => handleMessageClick(friend)}
                  title="Message"
                >
                  <MessageSquareText size={20} />
                </button>
                <button
                  className={css.actionButton}
                  onClick={ () =>  handleSendInvite(friend.username)}
                  title='Invite'
                  >
                  <img
                    src="/icons/chat/Invite.svg" alt="Invite"
                  />
                </button>
              </div>
            </div>
          ))
        ) : (
          <NoOnlineFriends />
        )}
      </div>
    </div>
  );
};

export default OnlineFriends;