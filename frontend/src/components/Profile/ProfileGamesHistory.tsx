// Styles
import css from './ProfileGamesHistory.module.css'
import { IoFilterSharp } from 'react-icons/io5';
import { FaHistory } from "react-icons/fa";
import { useNavigate } from 'react-router-dom';
import { IoGameControllerOutline } from "react-icons/io5";
import { useGetData } from '@/api/apiHooks';
// Api
import { GameHistory } from '@/types/apiTypes';



const gameHistoryFields = ["Date & Time", "Name", "Result", "Score", "Type", "Duration", "Rematch"] as const;


const ProfileGamesHistory = () => {

    const navigate = useNavigate();
    const { data: playedGames, isLoading } = useGetData<GameHistory[]>('/matchmaker/played_games');
    if (isLoading) return <p>Loading...</p>;
    console.log(playedGames);


  return (
    <div className={css.gameHistoryContainer}>
        <div className={css.gameHistoryHeader}>
          <div className={css.gameHistTitle}>
            <FaHistory className={css.gameHistIcon} />
            <h3>Game History</h3>
          </div>
          <button className={css.dateFilterBtn}>Date
            <IoFilterSharp />
          </button>
        </div>
        <div className={css.gamesList}>
            <div className={css.tableHeader}>
                {gameHistoryFields.map((field, index) => (
                  <span key={index} className={css.headerField}>{field}</span>
                ))}
            </div>
            { playedGames?.length == 0 && <div className={css.noGames}>
                <span className={css.noHistoryTitle}>You don't play any games alkhari</span>
                <button className={css.playBtn} onClick={() => navigate('/play')}>
                    <IoGameControllerOutline className={css.playIcon}/>
                    <span>Play Now</span>
                </button>
            </div> }
            { playedGames!.length > 0 && playedGames?.map((game, index) => (
                <div key={index} className={css.tableRow}>
                    <span className={css.historyField}>{game?.start_time}</span>
                    <div className={css.player}>
                        <img src={game.oppenent_avatar} alt={game?.oppenent_username} className={css.avatar} />
                        <span className={css.name}>{game.oppenent_username}</span>
                    </div>
                    <span className={`${game.result === 'Win' ? css.win : css.lose}`}>{game.result}</span>
                    <span className={css.historyField}>{game.score}</span>
                    <span className={css.historyField}>One to One</span>
                    <span className={css.historyField}>{game.game_duration}</span>
                    <button className={css.inviteBtn}>Invite</button>
                </div>
            ))}
        </div>
    </div>
  )
}

export default ProfileGamesHistory
