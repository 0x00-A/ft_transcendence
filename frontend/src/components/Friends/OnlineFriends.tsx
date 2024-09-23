import React from 'react';
import css from './OnlineFriends.module.css';

interface Friend {
  id: string;
  username: string;
  avatar: string;
}

const onlineFriends: Friend[] = [
  { id: '1', username: 'abde latif', avatar: 'https://picsum.photos/209' },
  { id: '2', username: 'abde latif', avatar: 'https://picsum.photos/209' },
  { id: '3', username: 'abde latif', avatar: 'https://picsum.photos/209' },
  { id: '4', username: 'abde latif', avatar: 'https://picsum.photos/209' },
  { id: '5', username: 'abde latif', avatar: 'https://picsum.photos/209' },
];

const OnlineFriends: React.FC = () => {
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
            <span className={css.username}>{friend.username}</span>
            <span className={css.status}>Online</span>
            <div className={css.actions}>
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

export default OnlineFriends;
