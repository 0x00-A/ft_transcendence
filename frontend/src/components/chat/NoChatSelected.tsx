import css from './NoChatSelected.module.css';

const NoChatSelected = () => {
  return (
    <div className={css.noChatSelected}>
      <img
        src="/icons/chat/Selected.svg"
        alt="selected"
        className={css.noChatIcon}
      />
      <p>No chats selected</p>
    </div>
  );
};

export default NoChatSelected;
