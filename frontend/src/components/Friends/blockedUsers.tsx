import React, { useState } from 'react';
import css from './BlockedList.module.css';
import { Search, Unlock, Ban } from 'lucide-react';
import { useGetData } from '../../api/apiHooks';
import moment from 'moment';
import { apiUnBlockRequest } from '@/api/friendApi';
import { toast } from 'react-toastify';
import FriendSkeleton from './FriendSkeleton';



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
      // console.log(message);
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
      <Ban size={80} color='#6b7280'/>
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
        <Search className={css.searchIcon} />

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
          <FriendSkeleton/>
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
                title='UnBlock'
              >
                <Unlock size={20}/>
              </button>
            </div>
          ))
        ) : (
          renderNoBlockedUsers()
        )}
      </div>
    </div>
  );
};

export default BlockedList;
