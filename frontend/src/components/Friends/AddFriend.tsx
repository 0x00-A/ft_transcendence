import React, { useState, useEffect } from 'react';
import { FaSearch } from 'react-icons/fa';
import css from './AddFriend.module.css';
import { useGetData } from '../../api/apiHooks';
import Loading from './Loading';
import { apiAcceptFriendRequest, apiCancelFriendRequest, apiRejectFriendRequest, apiSendFriendRequest } from '../../api/friendApi';

interface Profile {
  user: number;
  avatar: string;
  age: number | null;
  level: number | null;
  stats: Record<string, unknown>;
  is_online: boolean;
}

interface User {
  id: number;
  username: string;
  email: string;
  is_oauth_user: boolean;
  first_name: string;
  last_name: string;
  profile: Profile;
  friend_request_status?: "accepted" | "pending" | "Add Friend" | "cancel";
}

interface SuggestedUser {
  user: User;
  status: "Friends" | "Pending" | "Add Friend";
}


const AddFriend: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<User[]>([]);
  const { data: suggestedConnections, isLoading: loadingSuggested, error: suggestedError } = useGetData<SuggestedUser[]>('suggested-connections');
  const { data: users, isLoading: loadingUsers, error: usersError, refetch } = useGetData<User[]>('users');
  const [notification, setNotification] = useState<string | null>(null);

  if (suggestedError) return <p>Error loading suggested connections: {suggestedError.message}</p>;
  if (usersError) return <p>Error loading users: {usersError.message}</p>;

  useEffect(() => {
    const filterUsers = () => {
      if (searchTerm) {
        const filteredUsers = users?.filter((user) => {
          const userName = user.username.toLowerCase();
          const fullName = `${user.first_name} ${user.last_name}`.toLowerCase();
          return userName.includes(searchTerm.toLowerCase()) || fullName.includes(searchTerm.toLowerCase());
        }) || [];
        setSearchResults(filteredUsers);
      } else {
        setSearchResults([]);
      }
    };
    filterUsers();
  }, [searchTerm, users]);

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const sendFriendRequest = async (username: string) => {
    try {
      const message = await apiSendFriendRequest(username);
      setNotification(message);
      refetch();
      setTimeout(() => setNotification(null), 3000);
    } catch (error: any) {
      setNotification(error.message || 'Failed to send friend request');
    } finally {
      setTimeout(() => setNotification(null), 3000);
    }
  };
  
  const rejectFriendRequest = async (username: string) => {
    try {
      const message = await apiRejectFriendRequest(username);
      setNotification(message);
      refetch();
      setTimeout(() => setNotification(null), 3000);
    } catch (error: any) {
      setNotification(error.message || 'Failed to reject friend request');
    } finally {
      setTimeout(() => setNotification(null), 3000);
    }
  };
  
  const acceptFriendRequest = async (username: string) => {
    try {
      const message = await apiAcceptFriendRequest(username);
      setNotification(message);
      refetch();
      setTimeout(() => setNotification(null), 3000);
    } catch (error: any) {
      setNotification(error.message || 'Failed to accept friend request');
    } finally {
      setTimeout(() => setNotification(null), 3000);
    }
  };

  const handleCancel = async (username: string) => {
    try {
      const message = await apiCancelFriendRequest(username);
      setNotification(message);
      refetch();
      setTimeout(() => setNotification(null), 3000);
    } catch (error: any) {
      setNotification(error.message || 'Failed to cancel friend request');
    } finally {
      setTimeout(() => setNotification(null), 3000);
    }
  };

  console.log("suggestedConnections: ", suggestedConnections)
  return (
    <div className={css.addFriend}>
      {notification && (
        <div className={css.notification}>
          {notification}
        </div>
      )}

      <h1 className={css.title}>Search & Add Friends</h1>
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

      {searchTerm === '' && suggestedConnections && suggestedConnections.length > 0 && (
        <div className={css.suggestedConnections}>
          <h3 className={css.suggestedConnectionsTitle}>Suggested Connections</h3>
          {loadingSuggested ? (
            <Loading /> 
          ) : (
            <div className={css.results}>
              {suggestedConnections.map(({ user, status }) => (
                <div key={user.username} className={css.userCard}>
                  <img src={user.profile.avatar} alt={user.username} className={css.avatar} />
                  <div className={css.userInfo}>
                    <span className={css.username}>{user.username}</span>
                  </div>
                  <div className={css.actions}>
                    {status === "Friends" ? (
                      <span className={css.friendsBtn}>Friends</span>
                    ) : status === "Pending" ? (
                      <span className={css.pendingBtn}>Pending</span>
                    ) : (
                      <button onClick={() => sendFriendRequest(user.username)} className={css.addFriendBtn}>Add Friend</button>
                    )}
                    <button className={css.viewProfileBtn}>View Profile</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

     {/* Display search results */}
      {searchTerm !== '' && (
        <div className={css.results}>
          {loadingUsers ? (
            <Loading />
          ) : searchResults.length > 0 ? (
            searchResults.map((user) => (
              <div key={user.username} className={css.userCard}>
                <img 
                  src={`${user.profile.avatar}`} 
                  alt={user.username} 
                  className={css.avatar} 
                />
                <div className={css.userInfo}>
                  <span className={css.username}>{user.username}</span>
                  <span className={css.fullName}>{`${user.first_name} ${user.last_name}`.trim()}</span>
                </div>
                <div className={css.actions}>
                  <button className={css.viewProfileBtn}>View Profile</button>

                  {user.friend_request_status === "accepted" ? (
                    <span className={css.friendsStatus}>Friends</span>
                  ) : user.friend_request_status === "pending" ? (
                    <>
                      <button onClick={() => acceptFriendRequest(user.username)} className={css.acceptBtn}>
                        Accept
                      </button>
                      <button onClick={() => rejectFriendRequest(user.username)} className={css.rejectBtn}>
                        Reject
                      </button>
                    </>
                  ) : user.friend_request_status === "cancel" ? (
                    <button onClick={() => handleCancel(user.username)} className={css.cancelBtn}>
                      Cancel
                    </button>
                  ) : (
                    <button onClick={() => sendFriendRequest(user.username)} className={css.addFriendBtn}>
                      Add Friend
                    </button>
                  )}
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
