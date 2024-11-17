// React
import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
// API
import apiClient from '@/api/apiClient'
import { API_GET_PROFILE_URL } from '@/api/apiConfig'
// Styles
import css from '@/pages/Profile/Profile.module.css'
import { GiRank3 } from "react-icons/gi";
import { IoMdMore } from 'react-icons/io';
import { IoIosMore } from "react-icons/io";
import { MdBlock } from "react-icons/md";

interface ProfileData {
  username: string;
  first_name: string;
  last_name: string;
  profile: {
    avatar: string;
  }
}

const getProfile = async () => {

    const response = await apiClient.get(
      API_GET_PROFILE_URL
    );
    console.log(response)
    console.log('apiClient ==> getProfile response: ', response.status, response.data);
    return response.data
}

const profileHeader = ({isFormPopup, setFormPopup}) => {

  const [isMore, setMore] = useState(false)
  const {data: user, isLoading, isError, isSuccess, error} = useQuery({
    queryKey: ["myquerykey1"],
    queryFn: getProfile
  });

  if (isLoading) {
    return <p>Loading...</p>;
  }

  return (
    <div className={css.profileHeaderContainer}>
      <div className={css.profileBackground}>
        <div className={css.othersProfile}>
          <button className={css.friendStatBtn}>
            <img src="/icons/friend/addFriend.svg" alt="" />
            <span>Add Friend</span>
          </button>
          <div>
            <IoIosMore className={css.moreIcon} onClick={() => setMore(!isMore)}/>
            {isMore &&
              <div className={css.showMore}>
                <button className={css.blockBtn}>
                  <MdBlock className={css.blockIcon}/>
                  <span>Block</span>
                </button>
              </div>}
          </div>
        </div>
        {/* <button className={css.editProfileBtn} onClick={() => setFormPopup(!isFormPopup)}>
          <MdEdit fontSize='2.5rem'/>
          <span>Edit Profile</span>
        </button> */}
      </div>
      <div className={css.profileCard}>
        <div className={css.avatarContainer}>
          <img src={user.profile.avatar} alt="" className={css.profileAvatar}/>
          <span className={css.profileLevel}>3</span>
        </div>
        <h2>{user.username}</h2>
      </div>
      <div className={css.profileStats}>
        <div className={css.leftStats}>
          <div className={css.totalGames}>
            <span className={css.statValue}>100</span>
            <span className={css.statLabel}>GAMES</span>
          </div>
          <div className={css.wins}>
            <span className={css.statValue}>50</span>
            <span className={css.statLabel}>WINS</span>
          </div>
          <div className={css.loses}>
            <span className={css.statValue}>50</span>
            <span className={css.statLabel}>LOSES</span>
          </div>
        </div>
        <div className={css.leftStats}>
          <div className={css.rank}>
            <GiRank3 className={css.badge}/>
            <span className={css.statLabel}>Badge</span>
          </div>
          <div className={css.score}>
            <span className={css.statValue}>666</span>
            <span className={css.statLabel}>SCORE</span>
          </div>
          <div className={css.rank}>
            <span className={css.statValue}>50</span>
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

export default profileHeader
