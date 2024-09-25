import React from 'react';
import css from './OnlineFriends.module.css';
import { useNavigate } from 'react-router-dom';

interface Friend {
  id: string;
  username: string;
  avatar: string;
}

const onlineFriends: Friend[] = [
  { id: '1', username: 'yasmine', avatar: 'https://picsum.photos/209' },
  { id: '2', username: 'oussama', avatar: 'https://picsum.photos/209' },
  { id: '3', username: 'mehadi f', avatar: 'https://picsum.photos/209' },
  {
    id: '4',
    username: 'imad king of 1337',
    avatar: 'https://picsum.photos/209',
  },
  { id: '5', username: 'kasimo l9re3', avatar: 'https://picsum.photos/209' },
];

const OnlineFriends: React.FC = () => {
  const navigate = useNavigate();

  const handleMessageClick = (friend: Friend) => {
    navigate('/chat', { state: { selectedFriend: friend } });
  };

  return (
    <div className={css.onlineFriends}>
      <h1 className={css.title}>Online Friends</h1>
      <div className={css.friendList}>
        {onlineFriends.map((friend) => (
          <div key={friend.id} className={css.friendCard}>
            <img
              src={friend.avatar}
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
