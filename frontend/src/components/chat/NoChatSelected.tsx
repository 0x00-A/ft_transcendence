import css from './NoChatSelected.module.css';

const NoChatSelected = () => {
  const handleAddFriendsClick = () => {
    // Add your logic here for adding friends, such as navigating to the "Add Friends" page
    console.log('Redirecting to Add Friends...');
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
      <p>
        If you don't have any friends yet,{' '}
        <button
          onClick={handleAddFriendsClick}
          className={css.addFriendsButton}
        >
          Click
        </button>{' '}
        to add some!
      </p>
    </div>
  );
};

export default NoChatSelected;
