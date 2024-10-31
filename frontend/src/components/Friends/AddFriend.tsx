import React, { useState, useEffect } from 'react';
import { FaSearch } from 'react-icons/fa';
import css from './AddFriend.module.css';
import { useGetData } from '../../api/apiHooks';
import axios from 'axios';

interface User {
  id: number;
  username: string;
  email: string;
  is_oauth_user: boolean;
  first_name: string;
  last_name: string;
  profile: {
    id: number;
    avatar: string;
    age: number | null;
    level: number | null;
    stats: Record<string, unknown>;
    is_online: boolean;
  };
}

const AddFriend: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<User[]>([]);
  const [topPlayers, setTopPlayers] = useState<User[]>([]);
  const { data, isLoading, error } = useGetData<User[]>('users');
  const [notification, setNotification] = useState<string | null>(null);

  if (error) return <p>Error: {error.message}</p>;

  useEffect(() => {
    if (data) {
      // const playersWithLevel = data.filter((user) => user.profile.level !== null);
      // const sortedPlayers = playersWithLevel
      const sortedPlayers = [...data]
        .sort((a, b) => (b.profile.level ?? 0) - (a.profile.level ?? 0))
        .slice(0, 5);
      setTopPlayers(sortedPlayers);
    }
  }, [data]);

  useEffect(() => {
    console.log("Top Players:", topPlayers);
  }, [topPlayers]);

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const term = event.target.value;
    setSearchTerm(term);

    if (term && Array.isArray(data)) {
      const filteredUsers = data.filter((user) => {
        const userName = user.username?.toLowerCase() || '';
        const fullName = `${user.first_name} ${user.last_name}`.toLowerCase();
        return userName.includes(term.toLowerCase()) || fullName.includes(term.toLowerCase());
      });
      setSearchResults(filteredUsers);
    } else {
      setSearchResults([]);
    }
  };

  const sendFriendRequest = async (username: string) => {
    try {
      const response = await axios.post(`http://localhost:8000/api/friend-request/send/${username}/`, null, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('access_token')}` }
      });
      console.log("response: ", response.data);
      setNotification('Friend request sent');
      setTimeout(() => {
        setNotification(null);
      }, 3000);
    } catch (error) {
      console.error('Error sending friend request:', error);
      setNotification('Failed to send friend request');
      setTimeout(() => {
        setNotification(null);
      }, 3000);
    }
  };

  return (
    <div className={css.addFriend}>
      {notification && (
        <div className={css.notification}>
          {notification}
        </div>
      )}

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
                <img src={`http://localhost:8000${user.profile.avatar}`} alt={user.username} className={css.avatar} />
                <div className={css.userInfo}>
                  <span className={css.username}>{user.username}</span>
                  <span className={css.level}>Level: {user.profile.level}</span>
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
                <img src={`http://localhost:8000${user.profile.avatar}`} alt={user.username} className={css.avatar} />
                <div className={css.userInfo}>
                  <span className={css.username}>{user.username}</span>
                  <span className={css.fullName}>{`${user.first_name} ${user.last_name}`.trim()}</span>
                </div>
                <div className={css.actions}>
                  <button className={css.viewProfileBtn}>View Profile</button>
                  <button onClick={() => sendFriendRequest(user.username)} className={css.addFriendBtn}>Add Friend</button>
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
