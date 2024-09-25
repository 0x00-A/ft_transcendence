import css from '../Profile.module.css'
import Avatar from '../assets/avatar.svg'
import Badge from '../assets/badge.svg'

const profileHeader = () => {
  return (
    <div className={css.profileHeader}>
        <div className={css.avatar}>
            <img src={Avatar} alt="" />
            <p>Nickname</p>
        </div>
        <div className={css.playerStats}>
          <img src={Badge} alt="" />
          <div className={css.levelStats}>
            <h3>level 3.75%</h3>
            <div className={css.levelBar}>
              <div className={css.levelFull}></div>
              <div className={css.levelEmpty}></div>
            </div>
            <div className={css.gameStats}>
              <div><h4>Total games</h4><p>5</p></div>
              <div><h4>Wins</h4><p>50%</p></div>
              <div><h4>Loss</h4><p>50%</p></div>
            </div>
          </div>
        </div>
        <div className={css.coins}>
          <a>Edit profile</a>
          <p>99999$</p>
        </div>
    </div>
  )
}

export default profileHeader
