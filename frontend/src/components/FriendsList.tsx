// FriendsList.js
import React from 'react';
import css from './FriendsList.module.css';

const friendsData = [
  { name: 'rel-isma', level: 11.5, status: 'online', avatar: 'https://picsum.photos/203' },
  { name: 'essam', level: 9.5, status: 'offline', avatar: 'https://picsum.photos/201' },
  { name: 'aigounad', level: 8.5, status: 'offline', avatar: 'https://picsum.photos/204' },
  { name: 'l9ra3', level: 8.2, status: 'online', avatar: 'https://picsum.photos/202' },
  { name: 'aka', level: 5.5, status: 'offline', avatar: 'https://picsum.photos/206' },
];

const FriendsList = () => {
  return (
    <div className={css.friendsContainer}>
      <div className={css.header}>
        <h3>YOUR FRIENDS</h3>
        <a href="/friends" className={css.viewMore}>view more</a>
      </div>

      <div className={css.friendList}>
        {friendsData.map((friend, index) => (
          <div className={css.friendItem} key={index}>
            <img src={friend.avatar} alt={friend.name} className={css.avatar} />
            <div className={css.friendInfo}>
              <span className={css.name}>{friend.name}</span>
              <span className={css.level}>Level: {friend.level}</span>
            </div>
            <div className={`${css.status} ${css[friend.status]}`}>
                <span></span>
              {friend.status}
            </div>
          </div>
        ))}
      </div>

      <button className={css.inviteButton}>Invite your friends ➤</button>
    </div>
  );
};

export default FriendsList;
