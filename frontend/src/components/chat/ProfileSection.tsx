import css from './ProfileSection.module.css';
import { useSelectedConversation } from '@/contexts/SelectedConversationContext';


const ProfileSection = () => {
  const { selectedConversation } = useSelectedConversation();

  return (
    <div className={css.profileSection}>
      <img className={css.avatar} src={selectedConversation?.avatar} alt="avatar" />
      <h2 className={css.name}>{selectedConversation?.name}</h2>
      {selectedConversation?.status ? <p className={css.online} >Active now</p> : <p className={css.offline}>{"Last seen at " + selectedConversation?.last_seen}</p> }
    </div>
  );
};

export default ProfileSection;
