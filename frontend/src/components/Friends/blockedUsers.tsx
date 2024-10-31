import React, { useState } from 'react';
import css from './BlockedList.module.css';
import { FaSearch } from 'react-icons/fa';
import { useGetData } from '../../api/apiHooks';
import Loading from './Loading';

import axios from 'axios';

interface BlockedUser {
  blocker: {
    id: string;
    username: string;
    profile: {
      avatar: string;
    };
  };
  blocked: {
    id: string;
    username: string;
    profile: {
      avatar: string;
    };
  };
  date_blocked: string;
}

const BlockedList: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const { data: blockedUsers = [], isLoading, error, refetch } = useGetData<BlockedUser[]>('blocked');

  const handleUnblock = async (username: string) => {
    try {
      await axios.post(
        `http://localhost:8000/api/unblock/${username}/`,
        null,
        {
          headers: { 'Authorization': `Bearer ${localStorage.getItem('access_token')}` },
        }
      );
      console.log(`Unblocked user: ${username}`);
      // Optionally refetch blocked users after unblocking
      refetch();
    } catch (error) {
      console.error('Error unblocking user:', error);
    }
  };

  const filteredUsers = blockedUsers.filter((user) =>
    user.blocked.username.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (error) {
    return <p className={css.error}>Error fetching blocked users: {error.message}</p>;
  }

  const renderNoBlockedUsers = () => (
    <div className={css.emptyState}>
      <svg 
        xmlns="http://www.w3.org/2000/svg" 
        width="80" 
        height="80" 
        viewBox="0 0 24 24" 
        fill="none" 
        stroke="currentColor" 
        strokeWidth="1.5" 
        strokeLinecap="round" 
        strokeLinejoin="round" 
        className={css.emptyIcon}
      >
        <circle cx="12" cy="12" r="10" />
        <line x1="12" y1="8" x2="12" y2="12" />
        <line x1="12" y1="16" x2="12.01" y2="16" />
      </svg>
      <h3 className={css.emptyTitle}>No Blocked Users</h3>
      <p className={css.emptyDescription}>
        You haven't blocked any users. Users you block will appear here.
      </p>
    </div>
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
      {isLoading ? (
          <Loading /> 
        ) : error ? (
          <p>Error loading friends</p>
        ) : 
        filteredUsers.length > 0 ? (
          filteredUsers.map((user) => (
            <div key={user.blocked.id} className={css.userCard}>
              <img
                src={"http://localhost:8000" + user.blocked.profile.avatar}
                alt={user.blocked.username}
                className={css.avatar}
              />
              <span className={css.username}>{user.blocked.username}</span>
              <button
                className={css.unblockButton}
                onClick={() => handleUnblock(user.blocked.username)}
              >
                Unblock
              </button>
            </div>
          ))
        ) : (
          // <p>No blocked users found</p>
          renderNoBlockedUsers()
        )}
      </div>
    </div>
  );
};

export default BlockedList;
