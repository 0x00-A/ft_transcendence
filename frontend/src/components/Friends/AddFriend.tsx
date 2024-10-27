import React, { useState, useEffect } from 'react';
import { FaSearch } from 'react-icons/fa';
import css from './AddFriend.module.css';
import APIClient from '../../api/apiClient';
import { useGetData } from '../../api/apiHooks';
import { axiosInstance } from '../../api/apiClient';

interface User {
  id: string;
  username: string;
  fullName: string;
  avatar: string;
}


const AddFriend: React.FC = () => {

  console.log('rerender')
  const [searchTerm, setSearchTerm] = useState('');
  const [users, setUsers] = useState<User[]>([]);
  const [searchResults, setSearchResults] = useState<User[]>([]);
  // const [isLoading, setIsLoading] = useState(true);

  const { data , isLoading, error } = useGetData<User[]>('users');


  // useEffect(() => {
  //   const fetchUsers = async () => {
  //     // setIsLoading(true);
  //     try {
  //       const response = await axiosInstance.get('users/');
  //       setUsers(response.data);
  //     } catch (error) {
    //       console.error('Error fetching users:', error);
    //     } finally {
      //       setIsLoading(false);
      //     }
      //   };
      //   fetchUsers();
      // }, []);
      
    if (isLoading) return <p>Loading...</p>;
    if (error) return <p>Error: {error.message}</p>;
    console.log("data: ", data)

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const term = event.target.value;
    setSearchTerm(term);

    if (term) {
      const filteredUsers = users.filter(
        (user) =>
          user.username.toLowerCase().includes(term.toLowerCase()) ||
          user.fullName.toLowerCase().includes(term.toLowerCase())
      );
      setSearchResults(filteredUsers);
    } else {
      setSearchResults([]);
    }
  };

  return (
    <div className={css.addFriend}>
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

      {isLoading ? (
        <div className={css.loadingState}>
          <p>Loading users...</p>
        </div>
      ) : (
        <>{searchTerm === '' && (
        <div className={css.emptyState}>
          <div className={css.emptyStateCenter}>
            <img src="/icons/friend/searchFriend.svg" alt="Search" />
            <p className={css.emptyStateText}>
              Search for friends by typing their name or username above.
            </p>
          </div>
        </div>
      )}

      {searchTerm !== '' && (
        <div className={css.results}>
          {searchResults.length > 0 ? (
            searchResults.map((user) => (
              <div key={user.id} className={css.userCard}>
                <img
                  src={user.avatar}
                  alt={user.username}
                  className={css.avatar}
                />
                <div className={css.userInfo}>
                  <span className={css.username}>{user.username}</span>
                  <span className={css.fullName}>{user.fullName}</span>
                </div>
                <div className={css.actions}>
                  <button className={css.viewProfileBtn}>View Profile</button>
                  <button className={css.addFriendBtn}>Add Friend</button>
                </div>
              </div>
            ))
          ) : (
            <div className={css.notFound}>
              <img src="/icons/friend/notFound.svg" alt="Search" />
              <p className={css.notFoundText}>No User Found</p>
            </div>
          )}
        </div>
      )}
      </>
      )}
    </div>
  );
};

export default AddFriend;
