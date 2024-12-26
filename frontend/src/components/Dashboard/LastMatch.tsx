import { useGetData } from '@/api/apiHooks';
import css from './LastMatch.module.css';
import { API_GET_LAST_GAMES_URL } from '@/api/apiConfig';
import { LastGames } from '@/types/apiTypes';
import LastGamesSkeleton from '@/skeltons/profile/LastGamesSkeleton';
import { Gamepad } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { formatDate } from '@/utils/helpers';
import { Trophy } from 'lucide-react';


const LastMatch = ({username}:{username:string | undefined}) => {

    const {data: matchesData, isLoading, error} = useGetData<LastGames[]>(`${API_GET_LAST_GAMES_URL}/${username}`);
    const navigate = useNavigate();
    const { t } = useTranslation();

    return (
        <>
            <div className={css.header}>
                <h3>{t('dashboard.LastMatch.headerTitle')}</h3>
                <a href="/view-more" className={css.viewMore}>{t('dashboard.LastMatch.viewMore')}</a>
            </div>
            <div className={css.containerBody}>
                { matchesData?.length != 0 && <div className={css.line}></div>}
                <div className={css.containerList}>
                    <div className={css.mtv}>
                        {matchesData && matchesData.length > 0 ? (
                            matchesData[0].result === 'Win' ? (
                                <span>{t('dashboard.LastMatch.winMessage')}</span>
                            ) : (
                                <span>{t('dashboard.LastMatch.loseMessage')}</span>
                            )
                        ) : (
                            <span>{t('dashboard.LastMatch.defaultMessage')}</span>
                        )}
                    </div>

                    {error && <div className={css.error}>{error.message}</div>}
                    { isLoading ? <LastGamesSkeleton />
                    :
                    <div className={css.matchList}>
                        { matchesData?.length == 0 && <div className={css.noGames}>
                            <span className={css.noHistoryTitle}>{t('dashboard.LastMatch.noGames.message')}</span>
                            <button className={css.playBtn} onClick={() => navigate('/play')}>
                                <Gamepad color='#F8C25C'/>
                                <span>{t('dashboard.LastMatch.noGames.playNow')}</span>
                            </button>
                        </div>}
                        { matchesData && matchesData.length > 0 && matchesData.map((match: LastGames) => (
                            <div className={`${css.matchItem} ${match.result === 'Win' ? css.yellow : css.green}`} key={match.id}>
                                <img src={match.opponent_avatar} alt={match.opponent_username} className={css.avatar} />
                                <div className={css.matchInfo}>
                                    <span className={css.name}>{match.opponent_username}</span>
                                    <span className={css.date}>{formatDate(new Date(match.start_time), t('lang'))}</span>
                                </div>
                                <div className={css.score}> <span className={css.YourGoals}>{match.my_score}</span> : <span className={css.opponentGoals}>{match.opponent_score}</span></div>
                                <div className={css.pointsContainer}>
                                    <span className={css.points}>{match.xp_gained}</span>
                                    <Trophy size={15}/>
                                </div>
                            </div>
                        ))}
                    </div>}
                </div>
            </div>
        </>
    );
};

export default LastMatch;
