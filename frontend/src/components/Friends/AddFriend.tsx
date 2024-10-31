import React, { useState, useEffect } from 'react';
import { FaSearch } from 'react-icons/fa';
import css from './AddFriend.module.css';
import { useGetData } from '../../api/apiHooks';
import axios from 'axios';
import Loading from './Loading';

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
  friend_request_status?: "accepted" | "pending" | "Add Friend";
}

interface SuggestedUser {
  user: User;
  status: "Accepted" | "Pending" | "Add Friend";
}

const AddFriend: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<User[]>([]);
  const { data: suggestedConnections, isLoading: loadingSuggested, error: suggestedError } = useGetData<SuggestedUser[]>('suggested-connections');
  const { data: users, isLoading: loadingUsers, error: usersError } = useGetData<User[]>('users');
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
      await axios.post(`http://localhost:8000/api/friend-request/send/${username}/`, null, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('access_token')}` }
      });
      setNotification('Friend request sent');
      setTimeout(() => setNotification(null), 3000);
    } catch (error) {
      console.error('Error sending friend request:', error);
      setNotification('Failed to send friend request');
      setTimeout(() => setNotification(null), 3000);
    }
  };

  const rejectFriendRequest = async (username: string) => {
    try {
      await axios.post(
        `http://localhost:8000/api/friend-request/reject/${username}/`,
        null,
        {
          headers: { 'Authorization': `Bearer ${localStorage.getItem('access_token')}` },
        }
      );
      setNotification('Friend request rejected');
      setTimeout(() => {
        setNotification(null);
      }, 3000);
    } catch (error) {
      console.error('Error rejecting friend request:', error);
      setNotification('Failed to reject friend request');
      setTimeout(() => {
        setNotification(null);
      }, 3000);
    }
  };

  
  const acceptFriendRequest = async (username: string) => {
    try {
      await axios.post(
        `http://localhost:8000/api/friend-request/accept/${username}/`,
        null,
        {
          headers: { 'Authorization': `Bearer ${localStorage.getItem('access_token')}` },
        }
      );
      setNotification('Friend request accepted');
      setTimeout(() => {
        setNotification(null);
      }, 3000);
    } catch (error) {
      console.error('Error accepting friend request:', error);
      setNotification('Failed to accept friend request');
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

      {searchTerm === '' && suggestedConnections && (
        <div className={css.suggestedConnections}>
          <h3 className={css.suggestedConnectionsTitle}>Suggested Connections</h3>
          {loadingSuggested ? (
            <Loading /> 
          ) : (
            <div className={css.results}>
              {suggestedConnections.map(({ user, status }) => (
                <div key={user.username} className={css.userCard}>
                  <img src={`http://localhost:8000${user.profile.avatar}`} alt={user.username} className={css.avatar} />
                  <div className={css.userInfo}>
                    <span className={css.username}>{user.username}</span>
                  </div>
                  <div className={css.actions}>
                    {status === "Accepted" ? (
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
          <img src={`http://localhost:8000${user.profile.avatar}`} alt={user.username} className={css.avatar} />
          <div className={css.userInfo}>
            <span className={css.username}>{user.username}</span>
            <span className={css.fullName}>{`${user.first_name} ${user.last_name}`.trim()}</span>
          </div>
          <div className={css.actions}>
            <button className={css.viewProfileBtn}>View Profile</button>
            
            {/* Conditionally render buttons based on friend_request_status */}
            {user.friend_request_status === "accepted" ? (
              <span className={css.friendsStatus}>Friends</span>
            ) : user.friend_request_status === "pending" ? (
              <>
                <button onClick={() => acceptFriendRequest(user.username)} className={css.acceptBtn}>Accept</button>
                <button onClick={() => rejectFriendRequest(user.username)} className={css.rejectBtn}>Reject</button>
              </>
            ) : (
              <button onClick={() => sendFriendRequest(user.username)} className={css.addFriendBtn}>Add Friend</button>
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
