// Components
import UsersProfileHeader from '@/components/Profile/UsersProfileHeader';
import UserProfileFriends from "@/components/Profile/UserProfileFriends";
// Styles
import css from './Profile.module.css'
import { useNavigate, useParams } from 'react-router-dom';
import ProfileAchievements from '@/components/Profile/ProfileAchievements';
// API
import { useGetData } from '@/api/apiHooks';
import { API_GET_PROFILE_URL } from '@/api/apiConfig';
import { useEffect } from 'react';
import { OtherUser } from '@/types/apiTypes';
import axios from 'axios';
import { toast } from 'react-toastify';
import ProfileGamesHistory from '@/components/Profile/ProfileGamesHistory';
import PreLoader from '@/components/PreLoader/PreLoader';

const UsersProfile = () => {

  const { username } = useParams();
  const { data: user, isLoading, error, isError, refetch } = useGetData<OtherUser>(`${API_GET_PROFILE_URL}${username}`);
  const navigate = useNavigate();

  useEffect(() => {
    if (isError) {
      if (error.status === 404) {
        toast.error('User not found');
        navigate('/profile');
      } else if (error.response.data.status === 'me') {
        navigate('/profile');
      }
      else {
        toast.error(error.response.data.message || 'Something went wrong, try again!');
        navigate('/');
      }
    }
  }, [isError, error]);

  if (isLoading) return (
    <div className={css.profileContainer}>
      <PreLoader />;
    </div>

  )
  if (isError) return navigate('/profile');
  // if (!username) return (
    //   <div className={css.profileContainer}>
    //     <h1>404 Not Found</h1>
    //   </div>
    // );

    // const navigate = useNavigate();



  // if (isError) {
  //   console.log('error = ', error);

  // }

  // useEffect(() => {
  //   if (error) {
  //     console.log('error = ', error);
  //     if (axios.isAxiosError(error)) {

  //       if (error.response?.data.status === 'me') {
  //         console.log('Redirecting to /profile');

  //         navigate('/profile');
  //       }
  //       else {
  //         toast.error(error.response?.data.message || 'Something went wrong, try again!');
  //       }
  //     } else {
  //       toast.error('Something went wrong, try again!');
  //     }
  //     navigate('/');
  //   }
  // }, [error])

  return (
    <div className={css.profileContainer}>
      <UsersProfileHeader getUserData={{user, isLoading, refetch}} />
      <div className={css.profileBodyConatiner}>
        { isLoading ? <div className='w-[40%] h-[100%] bg-gray-700 animate-pulse rounded-lg'></div>:
        <UserProfileFriends username={user?.username} />}
        <div className={css.rightBodyContainer}>
          { isLoading ? <div className='w-[100%] h-[40%] bg-gray-700 animate-pulse rounded-lg'></div>:
          <ProfileAchievements username={user.username}/>}
          { isLoading ? <div className='w-[100%] h-[60%] bg-gray-700 animate-pulse rounded-lg'></div>:
          <ProfileGamesHistory isOtherUser={true} username={user.username}/>}
        </div>
      </div>
    </div>
  )
}

export default UsersProfile
