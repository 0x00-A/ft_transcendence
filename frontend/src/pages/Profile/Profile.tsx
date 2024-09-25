import React from 'react'
import css from './Profile.module.css'
import ProfileHeader from './components/ProfileHeader'

import Avatar1 from './assets/avatar1.svg'
import Avatar2 from './assets/avatar2.svg'
import Avatar3 from './assets/avatar3.svg'
import Avatar4 from './assets/avatar4.svg'

interface GameHistory {
  id: number;
  date: string;
  oppenent: string;
  winLoss: string;
  result: string;
}

const Profile = () => {

  const historyGame = [
    {id: 1, date: 'Today', oppenent: Avatar1, winLoss: 'WIN', result: '5 - 11'},
    {id: 2, date: 'Yesterday', oppenent: Avatar2, winLoss: 'LOSE', result: '11 - 7'},
    {id: 3, date: '2024-09-24', oppenent: Avatar3, winLoss: 'WIN', result: '8 - 11'},
    {id: 4, date: '2024-09-23', oppenent: Avatar4, winLoss: 'WIN', result: '2 - 11'},
  ];

  const ListHistory = historyGame.map((game) => (
    <div key={game.id} className={css.game}>
      <div className={css.gameDate}>
        <div></div>
        <p>{game.date}</p>
      </div>
      <div className={css.gameStatus}>
        <img src={game.oppenent} alt="" />
        <h4 className={game.winLoss === 'WIN' ? css.gameWin : css.gameLose}>{game.winLoss}</h4>
        <p>{game.result}</p>
      </div>
    </div>
  ))
  return (
    <div className={css.container}>
      <ProfileHeader />
      {/* GAME HISTORY */}
      <div className={css.gameHistory}>
        <h3>Game History</h3>
        {ListHistory}
      </div>
    </div>
  )
}

export default Profile
