import React, { useState, useEffect } from 'react';
import css from './SearchUsers.module.css';
import { useGetData } from '../../api/apiHooks';
import { useNavigate } from 'react-router-dom';
import { Search, Eye } from 'lucide-react';
import FriendSkeleton from '../Friends/FriendSkeleton';

interface Profile {
  avatar: string;
}

interface User {
  username: string;
  first_name: string;
  last_name: string;
  profile: Profile;
}

const SearchUsers: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<User[]>([]);

  const { data: users, isLoading: loadingUsers, error: usersError } = useGetData<User[]>('users');
  const navigate = useNavigate();

  useEffect(() => {
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
  }, [searchTerm, users]);

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  if (usersError) {
    return <p>Error loading users: {usersError.message}</p>;
  }

  return (
    <div className={css.searchUsers}>
      <div className={css.searchContainer}>
        <Search className={css.searchIcon} />
        <input
          type="text"
          placeholder="Search users..."
          value={searchTerm}
          onChange={handleSearch}
          className={css.searchInput}
        />
      </div>
      {searchTerm && (
        <div className={css.results}>
          {loadingUsers ? (
            <FriendSkeleton />
          ) : searchResults.length > 0 ? (
            searchResults.map((user) => (
              <div key={user.username} className={css.userCard}>
                <img
                  src={user.profile.avatar}
                  alt={user.username}
                  className={css.avatar}
                />
                <div className={css.userInfo}>
                  <span className={css.username}>{user.username}</span>
                  <span className={css.fullName}>{`${user.first_name} ${user.last_name}`.trim()}</span>
                </div>
                <button
                  className={css.viewProfileBtn}
                  onClick={() => navigate(`/profile/${user.username}`)}
                  title="View Profile"
                >
                  <Eye size={20} />
                </button>
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
