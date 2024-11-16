
// Components
import ProfileHeader from '../../components/Profile/ProfileHeader'
import ProfilePopup from '@/components/Profile/ProfilePopup';
// Styles
import css from './Profile.module.css'



import { useState } from 'react';



const Profile = () => {
  const [isFormPopup, setFormPopup] = useState(false);

  return (
    <div className={css.profileContainer}>
      {isFormPopup && <ProfilePopup setFormpopup={setFormPopup} />}
      <ProfileHeader isFormPopup={isFormPopup} setFormPopup={setFormPopup} />
    </div>
  )
}

export default Profile
//