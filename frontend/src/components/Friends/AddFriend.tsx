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
    avatar: '/avatar1.jpg',
  },
  {
    id: '2',
    username: 'johndoe',
    fullName: 'John Doe',
    avatar: '/avatar2.jpg',
  },
  {
    id: '3',
    username: 'janedoe',
    fullName: 'Jane Doe',
    avatar: '/avatar3.jpg',
  },
];

const AddFriend: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<User[]>([]);

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const term = event.target.value;
    setSearchTerm(term);

    const filteredUsers = exampleUsers.filter(
      (user) =>
        user.username.toLowerCase().includes(term.toLowerCase()) ||
        user.fullName.toLowerCase().includes(term.toLowerCase())
    );

    setSearchResults(filteredUsers);
  };

  return (
    <div className={css.addFriend}>
      <div className={css.topSearch}>
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
        <h1 className={css.title}>Add Friend</h1>
      </div>
      <div className={css.results}>
        {searchResults.map((user) => (
          <div key={user.id} className={css.userCard}>
            <img src={user.avatar} alt={user.username} className={css.avatar} />
            <div className={css.userInfo}>
              <span className={css.username}>{user.username}</span>
              <span className={css.fullName}>{user.fullName}</span>
            </div>
            <div className={css.actions}>
              <button className={css.viewProfileBtn}>View Profile</button>
              <button className={css.addFriendBtn}>Add Friend</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AddFriend;
