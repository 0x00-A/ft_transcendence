import React, { useState, useEffect, useRef } from 'react';
import css from './SearchUsers.module.css';
import { useGetData } from '../../api/apiHooks';
import { useNavigate } from 'react-router-dom';
import { Search, Eye, UserPlus, Check, X, Users } from 'lucide-react';
import FriendSkeleton from '../Friends/FriendSkeleton';
import {
  apiSendFriendRequest,
  apiCancelFriendRequest,
  apiAcceptFriendRequest,
  apiRejectFriendRequest,
} from '../../api/friendApi';
import { toast } from 'react-toastify';

interface Profile {
  avatar: string;
}

interface User {
  username: string;
  first_name: string;
  last_name: string;
  profile: Profile;
  friend_request_status?: 'accepted' | 'pending' | 'Add Friend' | 'cancel';
}

const SearchUsers: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<User[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const searchContainerRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const { data: users, isLoading: loadingUsers, error: usersError } = useGetData<User[]>('users');
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(event.target as Node)
      ) {
        setShowResults(false);
        setSelectedIndex(-1);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (searchTerm) {
      const filteredUsers =
        users?.filter((user) => {
          const userName = user.username.toLowerCase();
          const fullName = `${user.first_name} ${user.last_name}`.toLowerCase();
          return (
            userName.includes(searchTerm.toLowerCase()) ||
            fullName.includes(searchTerm.toLowerCase())
          );
        }) || [];
      setSearchResults(filteredUsers);
      setShowResults(true);
      setSelectedIndex(-1);
    } else {
      setSearchResults([]);
      setShowResults(false);
    }
  }, [searchTerm, users]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!showResults) return;

      switch (event.key) {
        case 'ArrowDown':
          event.preventDefault();
          setSelectedIndex((prevIndex) => 
            prevIndex < searchResults.length - 1 ? prevIndex + 1 : prevIndex
          );
          break;
        case 'ArrowUp':
          event.preventDefault();
          setSelectedIndex((prevIndex) => 
            prevIndex > 0 ? prevIndex - 1 : prevIndex
          );
          break;
        case 'Enter':
          if (selectedIndex >= 0 && selectedIndex < searchResults.length) {
            const selectedUser = searchResults[selectedIndex];
            navigate(`/profile/${selectedUser.username}`);
            setShowResults(false);
          }
          break;
        case 'Escape':
          setShowResults(false);
          setSelectedIndex(-1);
          searchInputRef.current?.blur();
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [showResults, searchResults, selectedIndex, navigate]);

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const performUserAction = async (action: () => Promise<void>) => {
    try {
      await action();
      setShowResults(false);
      setSearchTerm('');
    } catch (error: any) {
      toast.error(error.message || 'Failed to perform action');
    }
  };

  const sendFriendRequest = (username: string) => 
    performUserAction(() => apiSendFriendRequest(username));

  const handleCancel = (username: string) => 
    performUserAction(() => apiCancelFriendRequest(username));

  const acceptFriendRequest = (username: string) => 
    performUserAction(() => apiAcceptFriendRequest(username));

  const rejectFriendRequest = (username: string) => 
    performUserAction(() => apiRejectFriendRequest(username));

  if (usersError) {
    return <p>Error loading users: {usersError.message}</p>;
  }

  return (
    <div className={css.searchUsers} ref={searchContainerRef}>
      <div className={css.searchContainer}>
        <Search className={css.searchIcon} />
        <input
          ref={searchInputRef}
          type="text"
          placeholder="Search users..."
          value={searchTerm}
          onChange={handleSearch}
          className={css.searchInput}
          onFocus={() => {
            if (searchResults.length > 0) {
              setShowResults(true);
            }
          }}
        />
      </div>
      {showResults && (
        <div className={css.results}>
          {loadingUsers ? (
            <FriendSkeleton />
          ) : searchResults.length > 0 ? (
            searchResults.map((user, index) => (
              <div 
                key={user.username} 
                className={`${css.userCard} ${index === selectedIndex ? css.selected : ''}`}
                >
                <img
                  onClick={() => {
                    navigate(`/profile/${user.username}`);
                    setShowResults(false);
                  }}
                  src={user.profile.avatar}
                  alt={user.username}
                  className={css.avatar}
                  />
                <div
                  onClick={() => {
                    navigate(`/profile/${user.username}`);
                    setShowResults(false);
                  }}
                  className={css.userInfo}
                >
                  <span className={css.username}>{user.username}</span>
                  <span className={css.fullName}>{`${user.first_name} ${user.last_name}`.trim()}</span>
                </div>
                <div className={css.actions}>
                  <button
                    className={css.viewProfileBtn}
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/profile/${user.username}`);
                      setShowResults(false);
                    }}
                    title='View Profile'
                  >
                    <Eye size={20}/>
                  </button>

                  {user.friend_request_status === "accepted" ? (
                    <span 
                      className={css.friendsStatus}
                      title='Friend'
                    >
                      <Users size={20}/>
                    </span>
                  ) : user.friend_request_status === "pending" ? (
                    <>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          acceptFriendRequest(user.username);
                        }}
                        className={css.acceptBtn}
                        title='Accept'
                      >
                        <Check size={20} />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          rejectFriendRequest(user.username);
                        }}
                        className={css.rejectBtn}
                        title='Reject'
                      >
                        <X size={20} />
                      </button>
                    </>
                  ) : user.friend_request_status === "cancel" ? (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleCancel(user.username);
                      }}
                      className={css.cancelBtn}
                      title='Cancel'
                    >
                      <X size={20}/>
                    </button>
                  ) : (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        sendFriendRequest(user.username);
                      }}
                      className={css.addFriendBtn}
                      title='Add friend'
                    >
                      <UserPlus size={20}/>
                    </button>
                  )}
                </div>
              </div>
            ))
          ) : (
            <p className={css.noResults}>No users found</p>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchUsers;