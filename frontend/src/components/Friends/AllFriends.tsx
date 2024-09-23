import React from 'react';
import css from './AllFriends.module.css';

interface Friend {
  id: string;
  username: string;
  avatar: string;
  isOnline: boolean;
}

const allFriends: Friend[] = [
  {
    id: '1',
    username: 'abde latif',
    avatar: 'https://picsum.photos/215',
    isOnline: true,
  },
  {
    id: '2',
    username: 'abde latif',
    avatar: 'https://picsum.photos/214',
    isOnline: false,
  },
  {
    id: '3',
    username: 'abde latif',
    avatar: 'https://picsum.photos/212',
    isOnline: true,
  },
  {
    id: '4',
    username: 'abde latif',
    avatar: 'https://picsum.photos/213',
    isOnline: false,
  },
];

const AllFriends: React.FC = () => {
  return (
    <div className={css.allFriends}>
      <h1 className={css.title}>All Friends</h1>
      <div className={css.friendList}>
        {allFriends.map((friend) => (
          <div key={friend.id} className={css.friendCard}>
            <img
              src={friend.avatar}
              alt={friend.username}
              className={css.avatar}
            />
            <div className={css.userInfo}>
              <span className={css.username}>{friend.username}</span>
              {friend.isOnline ? (
                <span className={css.Online}>Online</span>
              ) : (
                <span className={css.Offline}>Offline</span>
              )}
            </div>
            <div className={css.actions}>
              <button className={css.actionButton}>Block</button>
              <button className={css.actionButton}>Message</button>
              <button className={css.actionButton}>Invite</button>
              <button className={css.actionButton}>View Profile</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AllFriends;
