import css from '../Profile.module.css'

import Avatar1 from '../assets/avatar1.svg'
import Avatar2 from '../assets/avatar2.svg'
import Avatar3 from '../assets/avatar3.svg'
import Avatar4 from '../assets/avatar4.svg'


interface Game {
    id: number;
    oppenentAvatar: string;
    oppenentNickname: string;
    winLoss: string;
    result: string;
}

interface GamesHistory {
    id: number;
    date: string;
    game: Game;
}


const GameHistory = () => {

    const GamesHistoryTemp = [
        {id: 1, date: 'Today', game: [{id: 1, oppenentAvatar: Avatar1, oppenentNickname: 'Chiwahed', winLoss: 'WIN', result: '5 - 11'},
                                        {id: 2, oppenentAvatar: Avatar2, oppenentNickname: 'Chiwehda', winLoss: 'LOSE', result: '11 - 8'}]},
        {id: 2, date: 'Yesterday', game: [{id: 3, oppenentAvatar: Avatar3, oppenentNickname: 'Chiwehdakhra', winLoss: 'WIN', result: '9 - 11'},
                                            {id: 4, oppenentAvatar: Avatar4, oppenentNickname: 'chiwahedakhor', winLoss: 'WIN', result: '5 - 11'}]},
        {id: 3, date: '2024-09-24', game: [{id: 5, oppenentAvatar: Avatar2, oppenentNickname: 'Chiwehda', winLoss: 'LOSE', result: '2 - 11'}]}
    ];
    
    const ListHistory = GamesHistoryTemp.map((game) => (
        <div key={game.id} className={css.gameContainer}>
            <div className={css.gamesDate}>
                <div></div>
                <p>{game.date}</p>
            </div>
            {
                game.game.map((gameDetail) => (
                  <div key={gameDetail.id} className={css.gameDetail}>
                    <div>
                      <img src={gameDetail.oppenentAvatar} alt="" />
                      <p>{gameDetail.oppenentNickname}</p>
                    </div>
                    <h4 className={gameDetail.winLoss === 'WIN' ? css.gameWin : css.gameLose}>{gameDetail.winLoss}</h4>
                    <p>{gameDetail.result}</p>
                  </div>
                ))
              }
          </div>
      ))

  return (
    <div className={css.gamesHistoryContainer}>
      <h3>Game History</h3>
      {ListHistory}
    </div>

  )
}

export default GameHistory
