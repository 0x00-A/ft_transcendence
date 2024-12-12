// Styles
import css from './ProfileHeader.module.css'
import { MdEdit } from "react-icons/md";
import "react-loading-skeleton/dist/skeleton.css";
// Contexts
import { useUser } from '@/contexts/UserContext';


const profileHeader = ({setEditProfile}: {setEditProfile:React.Dispatch<React.SetStateAction<boolean>>}) => {

  const { user: currentUser, isLoading } = useUser();

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className={css.profileHeaderContainer}>
      <div className={css.profileBackground}>
        <button className={css.editProfileBtn} onClick={() => setEditProfile(true)}>
          <MdEdit fontSize='2.5rem'/>
          <span>Edit Profile</span>
        </button>
      </div>
      { true ?
      <div className="w-[150px] h-[200px] absolute left-1/2 top-[45%] transform -translate-x-1/2 text-center rounded-lg animate-pulse flex flex-col items-center">
      <div className="w-[150px] h-[150px] relative">
        <div className="w-full h-full rounded-[25px] bg-gray-700"></div>
        {/* <div className="absolute bottom-[-10px] left-1/2 transform -translate-x-1/2 w-[50px] h-[15px] bg-gray-700 rounded-md"></div> */}
      </div>
      <div className="w-[100px] h-[20px] bg-gray-700 rounded-md mt-4"></div>
    </div>:
      <div className={css.profileCard}>
        <div className={css.avatarContainer}>
          <img src={currentUser?.profile?.avatar} alt="" className={css.profileAvatar}/>
          <span className={css.profileLevel}>{currentUser?.profile?.level || 0}</span>
        </div>
        <h2>{currentUser?.username}</h2>
      </div>}
      <div className={css.profileStats}>
        <div className={css.leftStats}>
          <div className={css.totalGames}>
            { true ? <span className="statValueSkeleton block w-[40px] h-[40px] bg-gray-500 rounded-md animate-pulse"></span>:
            <span className={css.statValue}>{currentUser?.profile?.stats?.games_played || 0}</span>}
            <span className={css.statLabel}>GAMES</span>
          </div>
          <div className={css.wins}>
            { true ? <span className="statValueSkeleton block w-[40px] h-[40px] bg-gray-500 rounded-md animate-pulse"></span>:
            <span className={css.statValue}>{currentUser?.profile?.stats?.wins || 0}</span>}
            <span className={css.statLabel}>WINS</span>
          </div>
          <div className={css.loses}>
            { true ? <span className="statValueSkeleton block w-[40px] h-[40px] bg-gray-500 rounded-md animate-pulse"></span>:
            <span className={css.statValue}>{currentUser?.profile?.stats?.losses || 0}</span>}
            <span className={css.statLabel}>LOSES</span>
          </div>
        </div>
        <div className={css.leftStats}>
          <div className={css.badge}>
            { true ? <span className="statValueSkeleton block w-[40px] h-[40px] bg-gray-500 rounded-md animate-pulse"></span>:
            <img src={currentUser?.profile?.badge?.icon} alt="" className={css.badgeIcon}/>}
            <span className={css.statLabel}>{currentUser?.profile?.badge?.name}</span>
          </div>
          <div className={css.score}>
            { true ? <span className="statValueSkeleton block w-[40px] h-[40px] bg-gray-500 rounded-md animate-pulse"></span>:
            <span className={css.statValue}>{currentUser?.profile?.score || 0}</span>}
            <span className={css.statLabel}>SCORE</span>
          </div>
          <div className={css.rank}>
            { true ? <span className="statValueSkeleton block w-[40px] h-[40px] bg-gray-500 rounded-md animate-pulse"></span>:
            <span className={css.statValue}>{currentUser?.profile?.rank || 0}</span>}
            <span className={css.statLabel}>RANK</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default profileHeader

//<Skeleton count={1} height={100} width={100} className='bg-gray-800 mb-4 animate-pulse'/>