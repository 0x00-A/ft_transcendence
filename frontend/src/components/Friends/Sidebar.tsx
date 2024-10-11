import React, { useState } from 'react';
import css from './Sidebar.module.css';
import { FaArrowCircleRight, FaArrowCircleLeft } from 'react-icons/fa';

type ViewType = 'add' | 'all' | 'online' | 'requests' | 'sent' | 'blocked';

interface SidebarProps {
  setView: (view: ViewType) => void;
  currentView: ViewType;
}

const Sidebar: React.FC<SidebarProps> = ({ setView, currentView }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <nav className={`${css.sidebar} ${isCollapsed ? css.collapsed : ''}`}>
      <div className={css.sidebarContent}>
        <button
          className={`${css.navButton} ${currentView === 'all' ? css.active : ''} ${isCollapsed ? css.close : ''}`}
          onClick={() => setView('all')}
        >
          <img src="/icons/friend/allFriends.svg" alt="All" />
          <span className={css.buttonText}>All Friends</span>
        </button>
        <button
          className={`${css.navButton} ${currentView === 'online' ? css.active : ''} ${isCollapsed ? css.close : ''}`}
          onClick={() => setView('online')}
        >
          <img src="/icons/friend/onlineFriend.svg" alt="Online" />
          <span className={css.buttonText}>Online Friends</span>
        </button>
        <button
          className={`${css.navButton} ${currentView === 'requests' ? css.active : ''} ${isCollapsed ? css.close : ''}`}
          onClick={() => setView('requests')}
        >
          <img src="/icons/friend/requestsFriend.svg" alt="Requests" />
          <span className={css.buttonText}>Friend Requests</span>
        </button>
        <button
          className={`${css.navButton} ${currentView === 'sent' ? css.active : ''} ${isCollapsed ? css.close : ''}`}
          onClick={() => setView('sent')}
        >
          <img src="/icons/friend/sentRequests.svg" alt="Sent" />
          <span className={css.buttonText}>Sent Requests</span>
        </button>
        <button
          className={`${css.navButton} ${currentView === 'blocked' ? css.active : ''} ${isCollapsed ? css.close : ''}`}
          onClick={() => setView('blocked')}
        >
          <img src="/icons/friend/blockList.svg" alt="Blocked" />
          <span className={css.buttonText}>Blocked List</span>
        </button>
      </div>
      <button
        className={`${css.addFriendButton} ${currentView === 'add' ? css.active : ''} ${isCollapsed ? css.close : ''}`}
        onClick={() => setView('add')}
      >
        <img src="/icons/friend/addFriend.svg" alt="Add" />
        <span className={css.buttonText}>Add Friend</span>
      </button>
      <button className={css.collapseButton} onClick={toggleCollapse}>
        {isCollapsed ? (
          <FaArrowCircleRight size={30} />
        ) : (
          <FaArrowCircleLeft size={30} />
        )}
      </button>
    </nav>
  );
};

export default Sidebar;
