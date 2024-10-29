import React, { useState } from 'react';
import css from './FriendRequests.module.css';
import { useGetData } from '../../api/apiHooks';
import axios from 'axios';

interface Profile {
  id: number;
  username: string;
  full_name: string;
  avatar: string;
  level: number;
}

interface FriendRequest {
  id: number;
  sender: Profile;
  receiver: Profile;
  status: string;
  timestamp: string;
}

const FriendRequests: React.FC = () => {
  const [notification, setNotification] = useState<string | null>(null);
  const { data: friendPending, isLoading, error } = useGetData<FriendRequest[]>('friend-requests/pending');

  const handleAccept = async (username: string) => { 
    try {
      const response = await axios.post(
        `http://localhost:8000/api/friend-request/accept/${username}/`,
        null,
        {
          headers: { 'Authorization': `Bearer ${localStorage.getItem('access_token')}` },
        }
      );
      console.log("Response: ", response.data);
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

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error fetching friend requests: {error.message}</div>;
  }

  return (
    <div className={css.friendRequests}>
      <h1 className={css.title}>Friend Requests</h1>
      {notification && (
        <div className={css.notification}>
          {notification}
        </div>
      )}
      <div className={css.list}>
        {friendPending?.map((request) => (
          <div key={request.id} className={css.requestCard}>
            <img
              src={"http://localhost:8000" + request.sender.avatar}
              alt={request.sender.username}
              className={css.avatar}
            />
            <span className={css.username}>{request.sender.username}</span>
            <button
              className={css.acceptButton}
              onClick={() => handleAccept(request.sender.username)}
            >
              Accept
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FriendRequests;
