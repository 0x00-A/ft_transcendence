import React from 'react';
import css from './OnlineFriends.module.css';

interface OnlineFriendsProps {
  id: string;
  username: string;
  avatar: string;
}

const friendRequests: OnlineFriendsProps[] = [
  { id: '1', username: 'abde latif', avatar: 'https://picsum.photos/202' },
  {
    id: '2',
    username: 'imad king og 1337',
    avatar: 'https://picsum.photos/206',
  },
  { id: '3', username: 'kasimo l9ra3', avatar: 'https://picsum.photos/207' },
];

const OnlineFriends: React.FC = () => {
  return (
    <div className={css.onlineFriends}>
      <h1 className={css.title}>Online Friends</h1>
      <div className={css.list}>
        {friendRequests.map((request) => (
          <div key={request.id} className={css.requestCard}>
            <img
              src={request.avatar}
              alt={request.username}
              className={css.avatar}
            />
            <div className={css.userInfo}>
              <span className={css.username}>{request.username}</span>
              <span className={css.online}>Online</span>
            </div>

            <button
              className={css.cancelButton}
              // onClick={() => handleAccept(request.id)}
            >
              Message
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OnlineFriends;
