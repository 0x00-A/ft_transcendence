import { useGetData } from '@/api/apiHooks';
import css from './LastMatch.module.css';
import { API_GET_LAST_GAMES_URL } from '@/api/apiConfig';
import { LastGames } from '@/types/apiTypes';
import LastGamesSkeleton from '@/skeltons/profile/LastGamesSkeleton';

// const matchesData = [
//   { name: 'elfarhat', date: '21/03/2001', score: '10 : 51', points: '+19', avatar: 'https://picsum.photos/203', color: 'green' },
//   { name: 'elfarhat', date: '21/03/2001', score: '23 : 11', points: '+92', avatar: 'https://picsum.photos/203', color: 'yellow' },
//   { name: 'elfarhat', date: '21/03/2001', score: '10 : 51', points: '+19', avatar: 'https://picsum.photos/203', color: 'green' },
//   { name: 'elfarhat', date: '21/03/2001', score: '23 : 11', points: '+92', avatar: 'https://picsum.photos/203', color: 'yellow' },
//   { name: 'elfarhat', date: '21/03/2001', score: '23 : 11', points: '+92', avatar: 'https://picsum.photos/203', color: 'yellow' },
// ];

const LastMatch = () => {

    const {data: matchesData, isLoading, error} = useGetData<LastGames[]>(API_GET_LAST_GAMES_URL);

    console.log('matchesData', matchesData);


    return (
        <>
            <div className={css.header}>
                <h3>LAST GAMES</h3>
                <a href="/view-more" className={css.viewMore}>view more</a>
            </div>
            <div className={css.containerBody}>
                <div className={css.line}></div>
                <div className={css.containerList}>
                    {/* <div className={css.weekLabel}>TO WEEK</div> */}
                    {error && <div className={css.error}>{error}</div>}
                    { isLoading ? <LastGamesSkeleton />
                    :
                    <div className={css.matchList}>
                        { matchesData && matchesData.length > 0 && matchesData.map((match: LastGames) => (
                            <div className={`${css.matchItem} ${css.green}`} key={match.id}>
                            <img src={match.opponent_avatar} alt={match.opponent_username} className={css.avatar} />
                            <div className={css.matchInfo}>
                                <span className={css.name}>{match.opponent_username}</span>
                                <span className={css.date}>{match.start_time}</span>
                            </div>
                            <div className={css.score}> <span className={css.YourGoals}>{match.my_score}</span> : <span className={css.opponentGoals}>{match.opponent_score}</span></div>
                            <div className={css.pointsContainer}>
                                <span className={css.points}>{match.xp_gained}</span>
                                <img src="/icons/score.svg" alt="score" />
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
