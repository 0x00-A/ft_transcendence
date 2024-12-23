// React
import { useState } from 'react';
// API
import { API_GET_ACHIEVEMENTS_URL } from '@/api/apiConfig';
import { useGetData } from '@/api/apiHooks';
// Styles
import css from './ProfileAchievements.module.css';
import { GrFormPrevious } from 'react-icons/gr';
import { GrFormNext } from 'react-icons/gr';
// Types
import { UserAchievements } from '@/types/apiTypes';
import { Award } from 'lucide-react';
import { useTranslation } from 'react-i18next';

// const achievements = {"name": "First Paddle", "description": "Win your first game",
//     "image": "/icons/AchievIcon.svg", "condition": {"win": 1}, "progress": 0,
//         "is_unlocked": true, "unlocked_at": "2021-10-10"}
// {`${isConfirmSave ? css.bluredBgConfirm : ''}`}
const ProfileAchievements = ({
  username,
}: {
  username: string | undefined;
}) => {
  const {
    data: achievements,
    isLoading,
    error,
  } = useGetData<UserAchievements[]>(`${API_GET_ACHIEVEMENTS_URL}/${username}`);
  const [currentAchiev, setCurrentAchiev] = useState(0);
  const { t } = useTranslation();

  const start = currentAchiev * 1;
  const end = start + 3;

  console.log('achievements===>>', achievements);
  if (error) {
    return <div>{error.message}</div>;
  }

  const handlePrevious = () => {
    if (start > 0) {
      setCurrentAchiev((prevPage) => prevPage - 1);
    }
  };
  const handleNext = () => {
    if (achievements && end < achievements.length) {
      setCurrentAchiev((prevPage) => prevPage + 1);
    }
  };

  return (
    <div className={css.profileAchievContainer}>
      <div className={css.achievHeader}>
        <Award size={30} color="#f8c25c" />
        <h3>{t('Profile.Achievements.title')}</h3>
      </div>
      <div className={css.achievsContainer}>
        {achievements?.length == 0 && (
          <p>{t('Profile.Achievements.NoAchievementsFound')}</p>
        )}
        <button
          className={css.previousBtn}
          disabled={start === 0}
          onClick={handlePrevious}
        >
          <GrFormPrevious />
        </button>
        {isLoading
          ? Array.from({ length: end - start }).map((_, index) => (
              <div
                key={index}
                className={`${css.achievCard} ${css.skeletonCard}`}
              >
                <div className={`${css.achievTitle} ${css.skeletonTitle}`} />
                <div
                  className={`${css.achievDescription} ${css.skeletonDescription}`}
                />
                <div
                  className={`${css.achievProgress} ${css.skeletonProgress}`}
                />
              </div>
            ))
          : achievements &&
            achievements
              .slice(start, end)
              .map((achievement: UserAchievements, index: number) => (
                <div
                  key={index}
                  className={`${!achievement.is_unlocked ? css.lockedAchievCard : ''} ${css.achievCard}`}
                >
                  <div className={css.achievTitle}>
                    <img src="/pong.png" className={css.achievImg} alt="" />
                    {/* <img src={achievement.achievement.image} className={css.achievImg} alt="" /> */}
                    <h4>{achievement.achievement.name}</h4>
                  </div>
                  <div className={css.achievDescription}>
                    <p className={css.description}>
                      {achievement.achievement.description}
                    </p>
                    <p className={css.progress}>
                      {achievement.progress[
                        achievement.achievement.condition_name
                      ] ?? 0}{' '}
                      /{' '}
                      {
                        achievement.achievement.condition[
                          achievement.achievement.condition_name
                        ]
                      }
                    </p>
                  </div>
                </div>
              ))}
        <button
          className={css.nextBtn}
          /*disabled={end >= achievements.length}*/ onClick={handleNext}
        >
          <GrFormNext />
        </button>
      </div>
    </div>
  );
};

export default ProfileAchievements;
