import React, { useState } from 'react';
import css from './BlockedList.module.css';
import { FaSearch } from 'react-icons/fa';

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
  const [searchTerm, setSearchTerm] = useState('');

  const handleUnblock = (userId: string) => {
    console.log(`Unblocked user with ID: ${userId}`);
  };

  const filteredUsers = blockedUsers.filter((user) =>
    user.username.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className={css.blockedList}>
      <h1 className={css.title}>Blocked List</h1>

      {/* Search input */}
      <div className={css.searchContainer}>
        <FaSearch className={css.searchIcon} />

        <input
          type="text"
          className={css.searchInput}
          placeholder="Search blocked users..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className={css.list}>
        {filteredUsers.length > 0 ? (
          filteredUsers.map((user) => (
            <div key={user.id} className={css.userCard}>
              <img
                src={user.avatar}
                alt={user.username}
                className={css.avatar}
              />
              <span className={css.username}>{user.username}</span>
              <button
                className={css.unblockButton}
                onClick={() => handleUnblock(user.id)}
              >
                Unblock
              </button>
            </div>
          ))
        ) : (
          <p>No blocked users found</p>
        )}
      </div>
    </div>
  );
};

export default BlockedList;
