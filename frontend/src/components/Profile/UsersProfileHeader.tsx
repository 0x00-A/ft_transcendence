// React
// API
import { apiAcceptFriendRequest, apiCancelFriendRequest, apiSendFriendRequest } from '@/api/friendApi';
// Styles
import css from './ProfileHeader.module.css'
import { LiaUserFriendsSolid } from "react-icons/lia";
import { TbUserCancel } from "react-icons/tb";
import { FaUserCheck } from "react-icons/fa6";
import { HiOutlineUserAdd } from "react-icons/hi";

import { toast } from 'react-toastify';
import { OtherUser } from '@/types/apiTypes';

// const getProfile = async (username:string) => {

//     const response = await apiClient.get(
//       `${API_GET_PROFILE_URL}${username}/`
//     );
//     return response.data
// }

interface GetUserData {
  user: OtherUser;
  isLoading: boolean;
  refetch: () => void;
}

interface UsersProfileHeaderProps {
  getUserData: GetUserData;
}

const UsersProfileHeader: React.FC<UsersProfileHeaderProps> = ({getUserData}) => {

    const {user, isLoading, refetch} = getUserData;
    // const [isMore, setMore] = useState(false);

    // const {data: user, isLoading, refetch} = useQuery({
    //     queryKey: ["myquerykey1"],
    //     queryFn: () => getProfile(username),
    // });

    const handleCancel = async () => {
      try {
        const message = await apiCancelFriendRequest(user.username);
        toast.success(message);
        refetch();
      } catch (error: any) {
        toast.error(error.message || 'Failed to cancel friend request');
      }
    };

    const sendFriendRequest = async () => {
    try {
      const message = await apiSendFriendRequest(user.username);
      toast.success(message);
      refetch();
    } catch (error: any) {
      toast.error(error.message || 'Failed to send friend request' );
    }
  };

  const acceptFriendRequest = async () => {
    try {
      const message = await apiAcceptFriendRequest(user.username);
      toast.success(message);
      refetch();
    } catch (error: any) {
      toast.error(error.message || 'Failed to accept friend request');
    }
  };

    // const {data: user, isLoading} = useGetData(`${API_GET_PROFILE_URL}/${username}`);

  // if (isLoading) {
  //   return (
  //       <div className={css.loaderWrapper}>
  //       <ArcadeLoader className={css.loader} />
  //     </div>
  //   )
  // }

  return (
    <div className={css.profileHeaderContainer}>
      <div className={css.profileBackground}>
        <div className={css.othersProfile}>
          {isLoading ? <div className='h-10 w-44 bg-gray-700 animate-pulse flex-center'></div> :
            <div className={css.friendState}>
              {user?.friend_status === 'Friends' &&
              <div className={css.friendsStat}>
                <LiaUserFriendsSolid className={css.friendsStateIcon}/>
                <span>{user?.friend_status}</span>
              </div>}
              {user?.friend_status === 'Cancel' &&
              <button className={css.friendStatBtn} onClick={handleCancel}>
                <TbUserCancel className={css.friendsStateIcon}/>
                <span>{user?.friend_status}</span>
              </button>}
              {user?.friend_status === 'Accept' &&
              <button className={css.friendStatBtn} onClick={acceptFriendRequest}>
                <FaUserCheck className={css.friendsStateIcon}/>
                <span>{user?.friend_status}</span>
              </button>}
              {user?.friend_status === 'Add' &&
              <button className={css.friendStatBtn} onClick={sendFriendRequest}>
                <HiOutlineUserAdd className={css.friendsStateIcon}/>
                <span>{user?.friend_status}</span>
              </button>}
              </div>}
            {/* <IoIosMore className={css.moreIcon} onClick={() => setMore(!isMore)}/>
            {isMore &&
              <div className={css.showMore}>
                <button className={css.messageBtn}>
                  <MdOutlineMessage className={css.messageIcon}/>
                  <span>Message</span>
                </button>
                <button className={css.blockBtn}>
                  <MdBlock className={css.blockIcon}/>
                  <span>Block</span>
                </button>
              </div>} */}
          </div>
        </div>
      { isLoading ?
        <div className="w-[150px] h-[200px] absolute left-1/2 top-[45%] transform -translate-x-1/2 text-center rounded-lg animate-pulse flex flex-col items-center">
          <div className="w-[150px] h-[150px] relative">
            <div className="w-full h-full rounded-[25px] bg-gray-700"></div>
          </div>
          <div className="w-[100px] h-[20px] bg-gray-700 rounded-md mt-4"></div>
        </div>:
        <div className={css.profileCard}>
          <div className={css.avatarContainer}>
            <img src={user?.profile?.avatar} alt="" className={css.profileAvatar}/>
            <span className={css.profileLevel}>{user?.profile?.level || 0}</span>
          </div>
          <h2>{user?.username}</h2>
        </div> }
      <div className={css.profileStats}>
        <div className={css.leftStats}>
          <div className={css.totalGames}>
            { isLoading ? <span className="statValueSkeleton block w-[40px] h-[40px] bg-gray-500 rounded-md animate-pulse"></span>:
            <span className={css.statValue}>{user?.profile?.played_games || 0}</span>}
            <span className={css.statLabel}>GAMES</span>
          </div>
          <div className={css.wins}>
            { isLoading ? <span className="statValueSkeleton block w-[40px] h-[40px] bg-gray-500 rounded-md animate-pulse"></span>:
            <span className={css.statValue}>{user?.profile?.wins || 0}</span>}
            <span className={css.statLabel}>WINS</span>
          </div>
          <div className={css.loses}>
            { isLoading ? <span className="statValueSkeleton block w-[40px] h-[40px] bg-gray-500 rounded-md animate-pulse"></span>:
            <span className={css.statValue}>{user?.profile?.loses || 0}</span>}
            <span className={css.statLabel}>LOSES</span>
          </div>
        </div>
        <div className={css.leftStats}>
          <div className={css.badge}>
            { isLoading ? <span className="statValueSkeleton block w-[40px] h-[40px] bg-gray-500 rounded-md animate-pulse"></span>:
            <img src={user?.profile?.badge?.icon} alt="" className={css.badgeIcon}/>}
            { isLoading ? <span className="statValueSkeleton block w-[40px] h-[10px] bg-gray-500 rounded-md animate-pulse"></span>:
            <span className={css.statLabel}>{user?.profile?.badge?.name}</span>}
          </div>
          <div className={css.score}>
            { isLoading ? <span className="statValueSkeleton block w-[40px] h-[40px] bg-gray-500 rounded-md animate-pulse"></span>:
            <span className={css.statValue}>{user?.profile?.score || 0}</span>}
            <span className={css.statLabel}>SCORE</span>
          </div>
          <div className={css.rank}>
            { isLoading ? <span className="statValueSkeleton block w-[40px] h-[40px] bg-gray-500 rounded-md animate-pulse"></span>:
            <span className={css.statValue}>{user?.profile?.rank || '?'}</span>}
            <span className={css.statLabel}>RANK</span>
          </div>
          {/* <div className={css.more} onClick={() => setMore(!isMore)}>
            <IoMdMore className={css.moreIcon}/>
            {isMore &&
            <div className={css.showMore}>
            </div>} */}
          {/* </div> */}
        </div>
      </div>
    </div>
  )
}

export default UsersProfileHeader
