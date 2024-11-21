// Styles
import css from './ProfileGamesHistory.module.css'
import { IoFilterSharp } from 'react-icons/io5';
import { FaHistory } from "react-icons/fa";
import { useNavigate } from 'react-router-dom';
import { IoGameControllerOutline } from "react-icons/io5";
import { useGetData } from '@/api/apiHooks';

interface Player {
    username: string;
    avatar: string;
}

interface GameHistory {
  dateTime: string;
  player: Player;
  result: string;
  score: string;
  gameType: string;
  duration: string;
}

const gameHistoryFields = ["Date & Time", "Name", "Result", "Score", "Type", "Duration", "Rematch"] as const;

const gamesHistory = [
    {"dateTime": "2021-09-01 12:00", "player": {"username": "John", "avatar": "https://picsum.photos/200"}, "result": "Win", "score": "11 - 5", "gameType": "local", "duration": "00:30", "rematch": "Yes"},
    {"dateTime": "2021-09-01 12:00", "player": {"username": "mahdi", "avatar": "https://picsum.photos/200"}, "result": "Lose", "score": "6 - 11", "gameType": "remote", "duration": "00:30", "rematch": "Yes"},
]

const ProfileGamesHistory = () => {

    const navigate = useNavigate();
    // const { data: friendsData, isLoading, error, refetch } = useGetData<GameHistory[]>('');


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
            { gamesHistory?.length == 0 && <div className={css.noGames}>
                <span className={css.noHistoryTitle}>You don't play any games alkhari</span>
                <button className={css.playBtn} onClick={() => navigate('/play')}>
                    <IoGameControllerOutline className={css.playIcon}/>
                    <span>Play Now</span>
                </button>
            </div> }
            { gamesHistory?.length > 0 && gamesHistory.map((game, index) => (
                <div key={index} className={css.tableRow}>
                    <span className={css.historyField}>{game.dateTime}</span>
                    <div className={css.player}>
                        <img src={game.player?.avatar} alt={game.player?.username} className={css.avatar} />
                        <span className={css.name}>{game.player?.username}</span>
                    </div>
                    <span className={`${game.result === 'Win' ? css.win : css.lose}`}>{game.result}</span>
                    <span className={css.historyField}>{game.score}</span>
                    <span className={css.historyField}>{game.gameType}</span>
                    <span className={css.historyField}>{game.duration}</span>
                    <button className={css.inviteBtn}>Invite</button>
                </div>
            ))}
        </div>
    </div>
  )
}

export default ProfileGamesHistory


// <div className={css.friendList}>
//                 { isLoading && <Loading/> }
//                 { error && <p>{error.message}</p> }
//                 { friendsData?.length == 0 && <div className={css.noFriends}>
//                     <span className={css.noFriendsTitle}>You are lonely</span>
//                     <button className={css.addFriendsBtn} onClick={() => navigate('/friends')}>
//                         <img src="/icons/friend/addFriend.svg" alt="Add" />
//                         <span>Add friends</span>
//                     </button>
//                 </div> }
//                 { isBtnActive && friendsData?.length > 0 && onlineFriends?.length == 0 && <span className={css.noCurrentFriend}>No Online friends</span> }
//                 { !isBtnActive && friendsData?.length > 0 && offlineFriends?.length == 0 && <span className={css.noCurrentFriend}>No Offline friends</span> }
//                 { isBtnActive && onlineFriends && onlineFriends?.length > 0 && onlineFriends?.map((friend, index) => (
//                     <div className={css.friendItem} key={index}>
//                          <img src={friend.profile.avatar} alt={friend.username} className={css.avatar} />
//                          <div className={css.friendInfo}>
//                              <span className={css.name}>{friend.username}</span>
//                              <span className={css.level}>Level: {friend.profile.level}</span>
//                          </div>
//                          <div className={`${css.status} ${css.online}`}>
//                             <span className={css.statusIndicator}></span>
//                             Online
//                          </div>
//                      </div>
//                 ))}
//                 { !isBtnActive &&  offlineFriends && offlineFriends?.length > 0 && offlineFriends?.map((friend, index) => (
//                     <div className={css.friendItem} key={index}>
//                          <img src={friend.profile.avatar} alt={friend.username} className={css.avatar} />
//                          <div className={css.friendInfo}>
//                              <span className={css.name}>{friend.username}</span>
//                              <span className={css.level}>Level: {friend.profile.level}</span>
//                          </div>
//                          <div className={`${css.status} ${css.offline}`}>
//                             <span className={css.statusIndicator}></span>
//                             Offline
//                          </div>
//                      </div>
//                 ))}
//             </div>