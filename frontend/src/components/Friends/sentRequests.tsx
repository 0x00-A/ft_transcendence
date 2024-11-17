import React from 'react';
import css from './SentRequests.module.css';
import { useGetData } from '../../api/apiHooks';
import moment from 'moment';
import Loading from './Loading';
import NoSentRequests from './NoSentRequests';
import { apiCancelFriendRequest } from '@/api/friendApi';
import { toast } from 'react-toastify';

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
      const message = await apiCancelFriendRequest(username);
      toast.success(message);
      refetch();
    } catch (error: any) {
      toast.error(error.message || 'Failed to cancel friend request');
    }
  };

  const formatTimestamp = (timestamp: string) => {
    return moment(timestamp).calendar();
  };


  return (
    <div className={css.sentRequests}>
      <h1 className={css.title}>Sent Requests</h1>
      {sentRequests && sentRequests.length === 0 ? (
        <NoSentRequests/>
      ) : (
        <div className={css.list}>
          {isLoading ? (
            <Loading /> 
          ) : error ? (
            <p>Error loading friends</p>
          ) : sentRequests?.map((request) => (
            <div key={request.id} className={css.requestCard}>
              <img
                src={request.receiver.profile.avatar}
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
      )}
    </div>
  );
};

export default SentRequests;
