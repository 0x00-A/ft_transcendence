import css from './FriendsList.module.css';
import { useGetData } from '@/api/apiHooks';
import Loading from '../Friends/Loading';
import { Friends } from '@/types/apiTypes';
import { API_GET_FRIENDS_URL } from '@/api/apiConfig';
import { useTranslation } from 'react-i18next';
import { HiOutlineUserAdd } from "react-icons/hi";
import { useNavigate } from 'react-router-dom';

// const friendsData = [
//   { name: 'essam', level: 12.5, status: 'offline', avatar: 'https://picsum.photos/201' },
//   { name: 'rel-isma', level: 11.5, status: 'online', avatar: 'https://picsum.photos/203' },
//   { name: 'aigounad', level: 8.5, status: 'offline', avatar: 'https://picsum.photos/204' },
//   { name: 'l9ra3', level: 8.2, status: 'online', avatar: 'https://picsum.photos/202' },
//   { name: 'aka', level: 5.5, status: 'offline', avatar: 'https://picsum.photos/206' },
// ];

interface FriendProfile {
    avatar: string;
    is_online: boolean;
    level: number;
}

interface Friend {
  id: string;
  username: string;
  profile: FriendProfile;
}

const FriendsList = () => {
  const { data: friendsData, isLoading, error } = useGetData<Friends[]>(API_GET_FRIENDS_URL);
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
      <>
        <div className={css.header}>
          <h3 className={css.title}>YOUR FRIENDS</h3>
          <a href="/friends" className={css.viewMore}>View more</a>
        </div>

        <div className={css.friendList}>
          { isLoading && <Loading/> }
          { error && <p>{error.message}</p> }
          { friendsData?.length == 0 && <div className={css.noFriends}>
              <span>{t('Profile.friends.errors.noFriends')}</span>
              <button className={css.addFriendsBtn} onClick={() => navigate('/friends')}>
                  {/* <img src="/icons/friend/addFriend.svg" alt="Add" /> */}
                  <HiOutlineUserAdd size={"2.2rem"}/>
                  <span>{t('Profile.friends.addFriends.button')}</span>
              </button>
            </div> }
          {friendsData && friendsData?.length > 0 &&  friendsData?.map((friend: Friend, index: number) => (
            <div className={css.friendItem} key={index}>
              <img src={friend.profile.avatar} alt={friend.username} className={css.avatar} />
              <div className={css.friendInfo}>
                <span className={css.name}>{friend.username}</span>
                <span className={css.level}>Level: {friend.profile.level}</span>
              </div>
              <div className={`${css.status} ${friend.profile.is_online ? css.online : css.offline}`}>
                  <span className={css.statusIndicator}></span>
                {friend.profile.is_online ? 'Online' : 'Offline'}
              </div>
            </div>
          ))}
        </div>

        {/* <button className={css.inviteButton}>Invite your friends ➤</button> */}
      </>
  );
};

export default FriendsList;
