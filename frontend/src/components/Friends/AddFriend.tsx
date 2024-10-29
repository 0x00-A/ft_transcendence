import React, { useState, useEffect } from 'react';
import { FaSearch } from 'react-icons/fa';
import css from './AddFriend.module.css';
import { useGetData } from '../../api/apiHooks';
import axios from 'axios';

interface User {
  id: string;
  username: string;
  full_name: string;
  avatar: string;
  level: number;
}

const AddFriend: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<User[]>([]);
  const [topPlayers, setTopPlayers] = useState<User[]>([]);
  const { data, isLoading, error } = useGetData<User[]>('users');

  if (error) return <p>Error: {error.message}</p>;

  useEffect(() => {
    if (data) {
      const sortedPlayers = [...data]
        .sort((a, b) => b.level - a.level) 
        .slice(0, 5);
      setTopPlayers(sortedPlayers);
    }
  }, [data]);

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const term = event.target.value;
    setSearchTerm(term);

    if (term && Array.isArray(data)) {
      const filteredUsers = data.filter((user) => {
        const userName = user.username?.toLowerCase() || '';
        const fullName = user.full_name?.toLowerCase() || '';
        return userName.includes(term.toLowerCase()) || fullName.includes(term.toLowerCase());
      });
      setSearchResults(filteredUsers);
    } else {
      setSearchResults([]);
    }
  };

  const sendFriendRequest = async (username: string) => {
    try {
      await axios.post(`http://localhost:8000/api/friend-request/send/${username}/`, null, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('access_token')}` }
      });
      alert('Friend request sent');
    } catch (error) {
      console.error('Error sending friend request:', error);
      alert('Failed to send friend request');
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

      {searchTerm === '' && topPlayers.length > 0 && (
        <div className={css.topPlayers}>
          <h3 className={css.topPlayersTitle}>Top Players</h3>
          {isLoading ? (
            <p>Loading top players...</p>
          ) : (
            topPlayers.map((user) => (
              <div key={user.id} className={css.userCard}>
                <img src={"http://localhost:8000"+user.avatar} alt={user.username} className={css.avatar} />
                <div className={css.userInfo}>
                  <span className={css.username}>{user.username}</span>
                  <span className={css.level}>Level: {user.level}</span>
                </div>
                <div className={css.actions}>
                  <button className={css.viewProfileBtn}>View Profile</button>
                  <button onClick={() => sendFriendRequest(user.username)} className={css.addFriendBtn}>Add Friend</button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {searchTerm !== '' && (
        <div className={css.results}>
          {isLoading ? (
            <p>Loading users...</p>
          ) : searchResults.length > 0 ? (
            searchResults.map((user) => (
              <div key={user.id} className={css.userCard}>
                <img src={ "http://localhost:8000"+user.avatar} alt={user.username} className={css.avatar} />
                <div className={css.userInfo}>
                  <span className={css.username}>{user.username}</span>
                  <span className={css.fullName}>{user.full_name}</span>
                </div>
                <div className={css.actions}>
                  <button className={css.viewProfileBtn}>View Profile</button>
                  <button className={css.addFriendBtn}>Add Friend</button>
                </div>
              </div>
            ))
          ) : (
            <div className={css.notFound}>
              <img src="/icons/friend/notFound.svg" alt="Not Found" />
              <p className={css.notFoundText}>No User Found</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AddFriend;
