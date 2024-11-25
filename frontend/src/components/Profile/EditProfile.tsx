// React
import { useState } from 'react'
// Styles
import css from './EditProfile.module.css'
import { IoMdCloseCircleOutline } from "react-icons/io";
// Components
import EditInfosProfile from './EditInfosProfile'
import EditSecurityProfile from './EditSecurityProfile';



const EditProfile = ({setEditProfile, profileData}) => {

  const [activeBtn, setActiveBtn] = useState(true);

  const handleOutsideClick = (event: React.MouseEvent) => {

    // if (isConfirmSave) {
    //   return;
    // }
    if ((event.target as HTMLElement).classList.contains(css.bluredBg)) {
      setEditProfile(false);
    }
  };

  return (
    <div className={css.bluredBg} onClick={handleOutsideClick}>
      <div className={css.editProfileContainer}>
        <button className={css.exitBtn} onClick={() => setEditProfile(false)}>
          <IoMdCloseCircleOutline />
        </button>
        <div className={css.editProfileForm}>
          <div className={css.buttonsGrp}>
            <button onClick={() => setActiveBtn(true)}
                className={`${css.button} ${activeBtn  ? css.buttonActive : ''}`}>
                Informations
            </button>
            <button onClick={() => setActiveBtn(false)}
                className={`${css.button} ${!activeBtn ? css.buttonActive : ''}`}>
                Security
            </button>
          </div>
          { activeBtn ? <EditInfosProfile profileData={profileData} setEditProfile={setEditProfile} /> :
            <EditSecurityProfile setEditProfile={setEditProfile} /> }
        </div>
      </div>
    </div>
  )
}

export default EditProfile
