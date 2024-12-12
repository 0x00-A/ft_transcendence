
// Styles
import css from './ProfileAchievements.module.css'
import { HiOutlineLockOpen } from "react-icons/hi2";
import { HiOutlineLockClosed } from "react-icons/hi2";
import { API_GET_ACHIEVEMENTS_URL } from '@/api/apiConfig';
import { useGetData } from '@/api/apiHooks';
import { UserAchievements } from '@/types/apiTypes';



// const achievements = {"name": "First Paddle", "description": "Win your first game",
//     "image": "/icons/AchievIcon.svg", "condition": {"win": 1}, "progress": 0,
//         "is_unlocked": true, "unlocked_at": "2021-10-10"}
// {`${isConfirmSave ? css.bluredBgConfirm : ''}`}
const ProfileAchievements = () => {

    const {data: achievements, isLoading, error} = useGetData<UserAchievements[]>(API_GET_ACHIEVEMENTS_URL);

    console.log('achievements===>>', achievements);
    if (error) {
        return <div>{error.message}</div>
    }

  return (
    <div className={css.profileAchievContainer}>
        <div className={css.achievHeader}>
          <img src="/icons/AchievIcon.svg" className={css.achievIcon}/>
          <h3>Achievements</h3>
        </div>
        <div className={css.achievsContainer}>
            {achievements?.length == 0 && <p>No achievements found!</p>}
            {achievements && achievements.map((achievement: UserAchievements, index: number) => (
                <div key={index} className={`${!achievement.is_unlocked ? css.lockedAchievCard : ''} ${css.achievCard}`}>
                    <div className={css.achievTitle}>
                        <img src={achievement.achievement.image} className={css.achievImg} alt="" />
                        <h4>{achievement.achievement.name}</h4>
                    </div>
                    <div className={css.achievDescription}>
                        <p>{achievement.achievement.description}</p>
                        <p className={css.progress}>{achievement.progress[achievement.achievement.condition_name] ?? 0} / {achievement.achievement.condition[achievement.achievement.condition_name]}</p>
                    </div>
                    <div className={css.achievProgress}>
                        { achievement.is_unlocked ? <HiOutlineLockOpen /> : <HiOutlineLockClosed /> }
                        { achievement.is_unlocked ? <p>{achievement.unlocked_at.split("T")[0]}</p> : '' }
                    </div>
                </div>
            ))}
        </div>
    </div>
  )
}

export default ProfileAchievements
