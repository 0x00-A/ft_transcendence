import { useState } from 'react'

import Badge from '../assets/badge.svg'

import WinRateDoughnut from '../Dashboard/WinRateDoughnut'
// Styles
import css from './ProfileHeader.module.css'
import { useQuery } from '@tanstack/react-query'
import apiClient from '@/api/apiClient'
import LevelStat from './levelStat'
import ProfilePopup from '@/components/Profile/ProfilePopup'

const getProfile = async () => {
  // try {
    const response = await apiClient.get(
      '/profile'
    );
    console.log(response.data);
    return response.data
}

const profileHeader = ({}) => {

  const [isFormPopup, setFormPopup] = useState(false);
  const {data, isLoading, isError, isSuccess, error} = useQuery({
    queryKey: ["myquerykey1"],
    queryFn: getProfile
  });

  if (isLoading) {
    return <div>Loading...</div>
  }

  return (
    <div className={css.profileHeaderContainer}>
      {isFormPopup && <ProfilePopup setFormpopup={setFormPopup} profileData={data} />}
      <div className={css.profileAvatar}>
        <img src="https://picsum.photos/200" alt="" />
        {/* <p>{data.username}</p> */}
      </div>
      <div className={css.profileStats}>
        <WinRateDoughnut />
        <div className={css.stats}>
          <div className={css.statBoxTotal}>
            <span className={css.total}>Total Games</span>
            <span>1000</span>
          </div>
          <div className={css.statBoxWin}>
            <span className={css.wins}>555 WINS</span>
          </div>
          <div className={css.statBoxLose}>
            <span className={css.losses}>555 LOSES</span>
          </div>
        </div>
      </div>
      <div className={css.profileEdit}>
        <LevelStat level={2} currentXP={200} xpForNextLevel={500}/>
      </div>
      <button className={css.editProfileBtn} onClick={() => setFormPopup(true)}>Edit profile</button>
      </div>
        {/* <WinRateDoughnut/>
        <div className={css.stats}>
          <span className={css.totalGames}>Total games</span>
          <span className={css.winsGames}>Wins</span>
          <span className={css.losesGames}>Loses</span>
        </div>
      </div> */}
        {/* <div className={css.avatar}>
          <img src={Avatar} alt="" />
          <p>username</p>
        </div>
        <div className={css.playerStats}>
          <img src={Badge} alt="" />
          <div className={css.levelStats}>
            <h3>level 3.75%</h3>
            <div className={css.levelBar}>
              <div className={css.levelFull}></div>
              <div className={css.levelEmpty}></div>
            </div>
            <div className={css.gameStats}>
              <div><h4>Total games</h4><p>5</p></div>
              <div><h4>Wins</h4><p>50%</p></div>
              <div><h4>Loss</h4><p>50%</p></div>
            </div>
          </div>
        </div>
        <div className={css.coins}>
          <button onClick={() => setFormpopup(true)}>Edit profile</button>
          <p>99999$</p>
        </div> */}
      </div>
  )
}

export default profileHeader
