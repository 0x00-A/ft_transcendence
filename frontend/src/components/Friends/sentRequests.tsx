import React from 'react';
import css from './SentRequests.module.css';
import { useGetData } from '../../api/apiHooks';
import axios from 'axios';
import moment from 'moment';

interface Profile {
  id: number;
  username: string;
  profile: {
    avatar: string;
  };
}

interface SentRequest {
  id: number;
  sender: Profile;
  receiver: Profile;
  status: string;
  timestamp: string;
}

const SentRequests: React.FC = () => {
  const { data: sentRequests, isLoading, error, refetch } = useGetData<SentRequest[]>('friend-requests/sent');

  const handleCancel = async (username: string) => {
    try {
      await axios.delete(`http://localhost:8000/api/friend-request/cancel/${username}/`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
        },
      });
      refetch();
    } catch (err) {
      console.error('Error canceling friend request:', err);
    }
  };
  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div className={css.error}>{error.message}</div>;
  }

  const formatTimestamp = (timestamp: string) => {
    return moment(timestamp).calendar();
  };


  return (
    <div className={css.sentRequests}>
      <h1 className={css.title}>Sent Requests</h1>
      <div className={css.list}>
        {sentRequests?.map((request) => (
          <div key={request.id} className={css.requestCard}>
            <img
              src={"http://localhost:8000" + request.receiver.profile.avatar}
              alt={request.receiver.username}
              className={css.avatar}
            />
            <div className={css.userInfo}>
              <span className={css.username}>{request.receiver.username}</span>
              <span className={css.timestamp}>{formatTimestamp(request.timestamp)}</span>
            </div>
            <button
              className={css.cancelButton}
              onClick={() => handleCancel(request.receiver.username)}
            >
              Cancel
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SentRequests;
