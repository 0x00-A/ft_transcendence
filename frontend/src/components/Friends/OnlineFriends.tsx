import React from 'react';
import css from './OnlineFriends.module.css';
import { useNavigate } from 'react-router-dom';
import { useGetData } from '../../api/apiHooks';

interface Friend {
  id: number;
  username: string; 
  profile: {
    id: number;
    avatar: string;
    is_online: boolean;
  };
}

const OnlineFriends: React.FC = () => {
  const navigate = useNavigate();
  const { data: onlineFriends, isLoading, error } = useGetData<Friend[]>('friends/online');

  console.log("onlineFriends: ", onlineFriends);
  const handleMessageClick = (friend: Friend) => {
    navigate('/chat', { state: { selectedFriend: friend } });
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <div className={css.onlineFriends}>
      <h1 className={css.title}>Online Friends</h1>
      <div className={css.friendList}>
        {onlineFriends?.map((friend) => (
          <div key={friend.id} className={css.friendCard}>
            <img
              src={"http://localhost:8000" + friend.profile.avatar}
              alt={friend.username}
              className={css.avatar}
            />
            <div className={css.userInfo}>
              <span className={css.username}>{friend.username}</span>
              <span className={css.online}>Online</span>
            </div>
            <div className={css.actions}>
              <button
                className={css.actionButton}
                onClick={() => handleMessageClick(friend)}
              >
                Message
              </button>
              <button className={css.actionButton}>Invite</button>
              <button className={css.actionButton}>View Profile</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OnlineFriends;
