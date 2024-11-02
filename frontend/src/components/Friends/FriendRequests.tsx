import React, { useState } from 'react';
import css from './FriendRequests.module.css';
import { useGetData } from '../../api/apiHooks';
import axios from 'axios';
import moment from 'moment';
import Loading from './Loading';
import NoFriendRequests from './NoFriendRequests';

interface Profile {
  id: number;
  username: string;
  profile: {
    avatar: string;
    level: number | null;
  };
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

  const { 
    data: friendPending, 
    isLoading, 
    error, 
    refetch 
  } = useGetData<FriendRequest[]>('friend-requests/pending');

  const handleAccept = async (username: string) => {
    try {
      await axios.post(
        `http://localhost:8000/api/friend-request/accept/${username}/`,
        null,
        {
          headers: { 'Authorization': `Bearer ${localStorage.getItem('access_token')}` },
        }
      );
      setNotification('Friend request accepted');
      refetch();
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

  const rejectFriendRequest = async (username: string) => {
    try {
      await axios.post(
        `http://localhost:8000/api/friend-request/reject/${username}/`,
        null,
        {
          headers: { 'Authorization': `Bearer ${localStorage.getItem('access_token')}` },
        }
      );
      refetch()
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

  const formatTimestamp = (timestamp: string) => {
    return moment(timestamp).calendar();
  };

  return (
    <div className={css.friendRequests}>
      <div className={css.header}>
        <h1 className={css.title}>Friend Requests</h1>
        {notification && (
          <div className={css.notification}>
            {notification}
          </div>
        )}
      </div>

      <div className={css.listContainer}>
        {isLoading ? (
          <div className={css.loadingContainer}>
            <Loading />
          </div>
        ) : error ? (
          <p className={css.errorMessage}>Error fetching friend requests: {error.message}</p>
        ) : friendPending && friendPending.length > 0 ? (
          <div className={css.list}>
            {friendPending.map((request) => (
              <div key={request.id} className={css.requestCard}>
                <img
                  src={"http://localhost:8000" + request.sender.profile.avatar}
                  alt={request.sender.username}
                  className={css.avatar}
                />
                <div className={css.userInfo}>
                  <span className={css.username}>{request.sender.username}</span>
                  <span className={css.timestamp}>{formatTimestamp(request.timestamp)}</span>
                </div>
                <div className={css.actions}>
                  <button
                    className={css.acceptButton}
                    onClick={() => handleAccept(request.sender.username)}
                  >
                    Accept
                  </button>
                  <button onClick={() => rejectFriendRequest(request.sender.username)} className={css.rejectBtn}>
                    Reject
                  </button>
                </div>
                
              </div>
            ))}
          </div>
        ) : (
          <NoFriendRequests />
        )}
      </div>
    </div>
  );
};

export default FriendRequests;