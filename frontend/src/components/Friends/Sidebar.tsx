import React from 'react';
import css from './Sidebar.module.css';
import {
  // FaUserFriends,
  FaCircle,
  FaUserPlus,
  FaUserMinus,
  FaBan,
  FaUserCog,
} from 'react-icons/fa';

type ViewType = 'add' | 'all' | 'online' | 'requests' | 'sent' | 'blocked';

interface SidebarProps {
  setView: (view: ViewType) => void;
  currentView: ViewType;
}

const Sidebar: React.FC<SidebarProps> = ({ setView, currentView }) => {
  return (
    <nav className={css.sidebar}>
      <div className={css.sidebarContent}>
        <button
          className={`${css.navButton} ${currentView === 'all' ? css.active : ''}`}
          onClick={() => setView('all')}
        >
          <img src="/icons/friend/allFriends.svg" alt="All" /> All Friends
        </button>
        <button
          className={`${css.navButton} ${currentView === 'online' ? css.active : ''}`}
          onClick={() => setView('online')}
        >
          <img src="/icons/friend/onlineFriend.svg" alt="Online" />
          Online Friends
        </button>
        <button
          className={`${css.navButton} ${currentView === 'requests' ? css.active : ''}`}
          onClick={() => setView('requests')}
        >
          <img src="/icons/friend/requestsFriend.svg" alt="Requests" /> Friend
          Requests
        </button>
        <button
          className={`${css.navButton} ${currentView === 'sent' ? css.active : ''}`}
          onClick={() => setView('sent')}
        >
          <img src="/icons/friend/sentRequests.svg" alt="Sent" /> Sent Requests
        </button>
        <button
          className={`${css.navButton} ${currentView === 'blocked' ? css.active : ''}`}
          onClick={() => setView('blocked')}
        >
          <img src="/icons/friend/blockList.svg" alt="Blocked" /> Blocked List
        </button>
      </div>
      <button
        className={`${css.addFriendButton} ${currentView === 'add' ? css.active : ''}`}
        onClick={() => setView('add')}
      >
        <img src="/icons/friend/addFriend.svg" alt="Add" /> Add Friend
      </button>
    </nav>
  );
};

export default Sidebar;
