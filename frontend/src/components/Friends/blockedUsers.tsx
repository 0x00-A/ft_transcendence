import React, { useState } from 'react';
import css from './BlockedList.module.css';
import { FaSearch } from 'react-icons/fa';
import { useGetData } from '../../api/apiHooks';
import Loading from './Loading';
import moment from 'moment';
import { apiUnBlockRequest } from '@/api/friendApi';
import { toast } from 'react-toastify';


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

  const unBlockRequest = async (username: string) => {
    try {
      const message = await apiUnBlockRequest(username);
      toast.success(message)
      refetch();
      console.log(message);
    } catch (error: any) {
      toast.error(error.message || 'Failed to accept friend request')
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

  const formatTimestamp = (timestamp: string) => {
    return moment(timestamp).calendar();
  };

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
                src={user.blocked.profile.avatar}
                alt={user.blocked.username}
                className={css.avatar}
              />
              <div className={css.userInfo}>
              <span className={css.username}>{user.blocked.username}</span>
                <span className={css.timestamp}>{formatTimestamp(user.date_blocked)}</span>
              </div>
              <button
                className={css.unblockButton}
                onClick={() => unBlockRequest(user.blocked.username)}
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
