import css from './NoChatSelected.module.css';
import { useNavigate } from 'react-router-dom';

const NoChatSelected = () => {
  const navigate = useNavigate();

  const handleAddFriendsClick = () => {
    navigate('/friends');
  };

  return (
    <div className={css.noChatSelected}>
      <img
        src="/icons/chat/Selected.svg"
        alt="selected"
        className={css.noChatIcon}
      />
      <h2>Welcome to Your Chat!</h2>
      <p>Please select a conversation to start chatting.</p>
      <p>If you don't have any friends yet</p>
      <button onClick={handleAddFriendsClick} className={css.addFriendsButton}>
        Add Friend
      </button>
    </div>
  );
};

export default NoChatSelected;
