// React

// API

// Styles
import css from './ProfileHeader.module.css'
import { MdEdit } from "react-icons/md";
// Types
import { User } from '@/types/apiTypes';


const profileHeader = ({setEditProfile, currentUser}: {setEditProfile:React.Dispatch<React.SetStateAction<boolean>>, currentUser:User|null|undefined}) => {

  return (
    <div className={css.profileHeaderContainer}>
      <div className={css.profileBackground}>
        <button className={css.editProfileBtn} onClick={() => setEditProfile(true)}>
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
            <img src={currentUser?.profile?.badge?.icon} alt="" className={css.badgeIcon}/>
            <span className={css.statLabel}>{currentUser?.profile?.badge?.name}</span>
          </div>
          <div className={css.score}>
            <span className={css.statValue}>{currentUser?.profile?.score || 0}</span>
            <span className={css.statLabel}>SCORE</span>
          </div>
          <div className={css.rank}>
            <span className={css.statValue}>{currentUser?.profile?.rank || 0}</span>
            <span className={css.statLabel}>RANK</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default profileHeader
