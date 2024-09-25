import React, { useState } from 'react';
import { FaSearch } from 'react-icons/fa';
import css from './AddFriend.module.css';

interface User {
  id: string;
  username: string;
  fullName: string;
  avatar: string;
}

const exampleUsers: User[] = [
  {
    id: '1',
    username: 'relimsa',
    fullName: 'Rachid El Ismaiyly',
    avatar: 'https://picsum.photos/200',
  },
  {
    id: '2',
    username: 'johndoe',
    fullName: 'John Doe',
    avatar: 'https://picsum.photos/200',
  },
  {
    id: '3',
    username: 'janedoe',
    fullName: 'Jane Doe',
    avatar: 'https://picsum.photos/200',
  },
];

const AddFriend: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<User[]>([]);

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const term = event.target.value;
    setSearchTerm(term);

    if (term) {
      const filteredUsers = exampleUsers.filter(
        (user) =>
          user.username.toLowerCase().includes(term.toLowerCase()) ||
          user.fullName.toLowerCase().includes(term.toLowerCase())
      );
      setSearchResults(filteredUsers);
    } else {
      setSearchResults([]);
    }
  };

  return (
    <div className={css.addFriend}>
      <h1 className={css.title}>Add Friend</h1>
      <div className={css.searchContainer}>
        <FaSearch className={css.searchIcon} />
        <input
          type="text"
          placeholder="Find your friend"
          value={searchTerm}
          onChange={handleSearch}
          className={css.searchInput}
        />
      </div>

      {searchTerm === '' && (
        <div className={css.emptyState}>
          <div className={css.emptyStateCenter}>
            <img src="/icons/friend/searchFriend.svg" alt="Search" />
            <p className={css.emptyStateText}>
              Search for friends by typing their name or username above.
            </p>
          </div>
        </div>
      )}

      {searchTerm !== '' && (
        <div className={css.results}>
          {searchResults.length > 0 ? (
            searchResults.map((user) => (
              <div key={user.id} className={css.userCard}>
                <img
                  src={user.avatar}
                  alt={user.username}
                  className={css.avatar}
                />
                <div className={css.userInfo}>
                  <span className={css.username}>{user.username}</span>
                  <span className={css.fullName}>{user.fullName}</span>
                </div>
                <div className={css.actions}>
                  <button className={css.viewProfileBtn}>View Profile</button>
                  <button className={css.addFriendBtn}>Add Friend</button>
                </div>
              </div>
            ))
          ) : (
            <p>No users found</p>
          )}
        </div>
      )}
    </div>
  );
};

export default AddFriend;
