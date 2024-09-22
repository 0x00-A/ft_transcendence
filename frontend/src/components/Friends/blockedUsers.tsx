import React from 'react';
import css from './BlockedList.module.css';

interface BlockedUser {
  id: string;
  username: string;
  avatar: string;
}

const blockedUsers: BlockedUser[] = [
  { id: '1', username: 'abde latif', avatar: 'https://picsum.photos/201' },
  {
    id: '2',
    username: 'imad king og 1337',
    avatar: 'https://picsum.photos/208',
  },
  { id: '3', username: 'kasimo l9ra3', avatar: 'https://picsum.photos/209' },
  { id: '4', username: 'mehdi emouzzane', avatar: 'https://picsum.photos/210' },
];

const BlockedList: React.FC = () => {
  const handleUnblock = (userId: string) => {
    console.log(`Unblocked user with ID: ${userId}`);
  };

  return (
    <div className={css.blockedList}>
      <h1 className={css.title}>Blocked</h1>
      <div className={css.list}>
        {blockedUsers.map((user) => (
          <div key={user.id} className={css.userCard}>
            <img src={user.avatar} alt={user.username} className={css.avatar} />
            <span className={css.username}>{user.username}</span>
            <button
              className={css.unblockButton}
              onClick={() => handleUnblock(user.id)}
            >
              Unblock
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BlockedList;
