import React from 'react';
import css from './FriendRequests.module.css';

interface FriendRequest {
  id: string;
  username: string;
  avatar: string;
}

const friendRequests: FriendRequest[] = [
  { id: '1', username: 'abde latif', avatar: 'https://picsum.photos/202' },
  {
    id: '2',
    username: 'imad king og 1337',
    avatar: 'https://picsum.photos/206',
  },
  { id: '3', username: 'kasimo l9ra3', avatar: 'https://picsum.photos/207' },
];

const FriendRequests: React.FC = () => {
  const handleAccept = (userId: string) => {
    // Implement cancel functionality here
    console.log(`Cancelled friend request for user with ID: ${userId}`);
  };

  return (
    <div className={css.friendRequests}>
      <h1 className={css.title}>Friend Requests</h1>
      <div className={css.list}>
        {friendRequests.map((request) => (
          <div key={request.id} className={css.requestCard}>
            <img
              src={request.avatar}
              alt={request.username}
              className={css.avatar}
            />
            <span className={css.username}>{request.username}</span>
            <button
              className={css.cancelButton}
              onClick={() => handleAccept(request.id)}
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
