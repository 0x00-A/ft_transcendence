import css from './ProfilePopup.module.css'
import Avatar from '../assets/avatar.svg'
import CloseIcon from '../assets/closeIcon.svg'

const ProfilePopup = ({setFormpopup}:{setFormpopup:React.Dispatch<React.SetStateAction<boolean>>}) => {
  return (
    <div className={css.popupContainer}>
      <button id={css.closeBtn} onClick={() => setFormpopup(false)}>
        <img src={CloseIcon}/>
      </button>
        <div className={css.avatar}>
          <img src={Avatar} alt="" />
          <p>nickname</p>
        </div>
        <div className={css.formsContainer}>
          <form action="" className={css.formProfile}>
              First name <input type="text" />
              Last name <input type="text" />
              nickname <input type="text" />
              Email <input type="text" />
              <button>Update Infos</button>
          </form>
          <form action="" className={css.formSecurity}>
            Current password <input type="password" />
            New password <input type="password" />
            Password confirmation <input type="password" />
            <button>Update Password</button>
          </form>
        </div>
    </div>
  )
}

export default ProfilePopup
