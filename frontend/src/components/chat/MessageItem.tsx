import css from './MessageItem.module.css';

const MessageItem = ({ avatar, name, lastMessage, time, unreadCount }) => {
  return (
    <div className={css.messageItem}>
      <img src={avatar} alt={name} className={css.avatar} />
      <div className={css.messageContent}>
        <div className={css.messageHeader}>
          <span className={css.name}>{name}</span>
          <span className={css.time}>{time}</span>
        </div>
        <div className={css.messageBody}>
          <span className={css.lastMessage}>{lastMessage}</span>
          {unreadCount > 0 && (
            <span className={css.unreadCount}>{unreadCount}</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default MessageItem;
