import React from 'react';
import css from './SentRequests.module.css';
import { useGetData } from '../../api/apiHooks';
import moment from 'moment';
import NoSentRequests from './NoSentRequests';
import { apiCancelFriendRequest } from '@/api/friendApi';
import { toast } from 'react-toastify';
import { X } from 'lucide-react';
import FriendSkeleton from './FriendSkeleton';
import { useTranslation } from 'react-i18next';

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
  const { t } = useTranslation();


  const handleCancel = async (username: string) => {
    try {
      await apiCancelFriendRequest(username);
      refetch();
    } catch (error: any) {
      toast.error(error.message || t('errorsFriends.cancel'));
    }
  };

  const formatTimestamp = (timestamp: string) => {
    return moment(timestamp).calendar();
  };


  return (
    <div className={css.sentRequests}>
      <h1 className={css.title}>{t('sentRequests.title')}</h1>
      {sentRequests && sentRequests.length === 0 ? (
        <NoSentRequests/>
      ) : (
        <div className={css.list}>
          {isLoading ? (
            <FriendSkeleton/>
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
                title={t('sentRequests.pupCancel')}
              >
                <X size={20}/>
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SentRequests;
