import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import css from './AllFriends.module.css';
import { FaSearch } from 'react-icons/fa';
import { useGetData } from '../../api/apiHooks';

interface Friend {
  id: string;
  username: string;
  avatar: string;
  isOnline: boolean;
}

interface Friend {
  id: string;
  username: string;
  avatar: string;
  isOnline: boolean;
}

const allFriends: Friend[] = [
  {
    id: '1',
    username: 'hex01e',
    avatar: 'https://picsum.photos/215',
    isOnline: true,
  },
  {
    id: '2',
    username: 'yasmine',
    avatar: 'https://picsum.photos/214',
    isOnline: false,
  },
  {
    id: '3',
    username: 'abde latif',
    avatar: 'https://picsum.photos/212',
    isOnline: true,
  },
  {
    id: '4',
    username: 'oussama',
    avatar: 'https://picsum.photos/213',
    isOnline: false,
  },
];

const AllFriends: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();


  // const { data: friendsData, isLoading, error } = useGetData<Friend[]>('friends');
  
  const filteredFriends = allFriends.filter((friend) =>
    friend.username.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  const handleMessageClick = (friend: Friend) => {
    navigate('/chat', { state: { selectedFriend: friend } });
  };

  return (
    <div className={css.allFriends}>
      <h1 className={css.title}>All Friends</h1>

      <div className={css.searchContainer}>
        <FaSearch className={css.searchIcon} />
        <input
          type="text"
          className={css.searchInput}
          placeholder="Search friends..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className={css.friendList}>
        {false ? (
          <p>Loading friends...</p>
        ) : false ? (
          <p>Error loading friends</p>
        ) : filteredFriends.length > 0 ? (
          filteredFriends.map((friend) => (
            <div key={friend.id} className={css.friendCard}>
              <img
                src={friend.avatar || 'https://via.placeholder.com/150'}
                alt={friend.username}
                className={css.avatar}
              />
              <div className={css.userInfo}>
                <span className={css.username}>{friend.username}</span>
                {friend.isOnline ? (
                  <span className={css.Online}>Online</span>
                ) : (
                  <span className={css.Offline}>Offline</span>
                )}
              </div>
              <div className={css.actions}>
                <button
                  className={css.actionButton}
                  onClick={() => handleMessageClick(friend)}
                >
                  Message
                </button>
                <button className={css.actionButton}>Invite</button>
                <button className={css.actionButton}>View Profile</button>
              </div>
            </div>
          ))
        ) : (
          <p>No friends found</p>
        )}
      </div>
    </div>
  );
};

export default AllFriends;
