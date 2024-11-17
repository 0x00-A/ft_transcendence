// React
import { useState } from 'react'
// API
import apiClient from '@/api/apiClient'
import { API_GET_PROFILE_URL } from '@/api/apiConfig'
// Styles
import css from './ProfileHeader.module.css'
import { MdEdit } from "react-icons/md";
import { useUser } from '@/contexts/UserContext'


// const getProfile = async () => {

//     const response = await apiClient.get(
//       API_GET_PROFILE_URL
//     );
//     console.log(response)
//     console.log('apiClient ==> getProfile response: ', response.status, response.data);
//     return response.data
// }

const profileHeader = ({isFormPopup, setFormPopup}) => {

  // const [isMore, setMore] = useState(false)
  const { user: currentUser } = useUser()


  // const {data: user, isLoading, isError, isSuccess, error} = useQuery({
  //   queryKey: ["myquerykey1"],
  //   queryFn: getProfile
  // });

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
        {/* <div className={css.othersProfile}>
          <button className={css.friendStatBtn}>
            <img src="/icons/friend/addFriend.svg" alt="" />
            <span>Add Friend</span>
          </button>
          <div>
            <IoIosMore className={css.moreIcon} onClick={() => setMore(!isMore)}/>
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
              </div>}
          </div>
        </div> */}
        <button className={css.editProfileBtn} onClick={() => setFormPopup(!isFormPopup)}>
          <MdEdit fontSize='2.5rem'/>
          <span>Edit Profile</span>
        </button>
      </div>
      <div className={css.profileCard}>
        <div className={css.avatarContainer}>
          <img src={currentUser?.profile?.avatar} alt="" className={css.profileAvatar}/>
          <span className={css.profileLevel}>{currentUser?.profile?.level || 0}</span>
        </div>
        <h2>{currentUser?.username}</h2>
      </div>
      <div className={css.profileStats}>
        <div className={css.leftStats}>
          <div className={css.totalGames}>
            <span className={css.statValue}>{currentUser?.profile?.stats?.games_played || 0}</span>
            <span className={css.statLabel}>GAMES</span>
          </div>
          <div className={css.wins}>
            <span className={css.statValue}>{currentUser?.profile?.stats?.wins || 0}</span>
            <span className={css.statLabel}>WINS</span>
          </div>
          <div className={css.loses}>
            <span className={css.statValue}>{currentUser?.profile?.stats?.losses || 0}</span>
            <span className={css.statLabel}>LOSES</span>
          </div>
        </div>
        <div className={css.leftStats}>
          <div className={css.badge}>
            {/* <GiRank3 className={css.badge}/> */}
            <img src={currentUser?.profile?.badge?.icon} alt="" className={css.badgeIcon}/>
            <span className={css.statLabel}>{currentUser?.profile?.badge?.name}</span>
          </div>
          <div className={css.score}>
            <span className={css.statValue}>{currentUser?.profile?.score || 0}</span>
            <span className={css.statLabel}>SCORE</span>
          </div>
          <div className={css.rank}>
            <span className={css.statValue}>{currentUser?.profile?.rank || '?'}</span>
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
