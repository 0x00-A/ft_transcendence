import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import css from './Sidebar.module.css';
import { FaArrowCircleRight, FaArrowCircleLeft } from 'react-icons/fa';
import { Users, UserCog, UserRoundPlus, UserX, Ban, CircleDot } from 'lucide-react';

type ViewType = 'add' | 'all' | 'online' | 'requests' | 'sent' | 'blocked';

interface SidebarProps {
  setView: (view: ViewType) => void;
  currentView: ViewType;
}

const Sidebar: React.FC<SidebarProps> = ({ setView, currentView }) => {
  const [isCollapsed, setIsCollapsed] = useState(true);
  const navigate = useNavigate();

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  const handleViewChange = (view: ViewType) => {
    setView(view);
    navigate(`/friends?view=${view}`);
  };

  return (
    <nav className={`${css.sidebar} ${isCollapsed ? css.collapsed : ''}`}>
      <div className={css.sidebarContent}>
        <button
          className={`${css.navButton} ${currentView === 'all' ? css.active : ''} ${isCollapsed ? css.close : ''}`}
          onClick={() => handleViewChange('all')}
        >
          <Users className={css.icon}/>
          <span className={css.buttonText}>All Friends</span>
        </button>
        <button
          className={`${css.navButton} ${currentView === 'online' ? css.active : ''} ${isCollapsed ? css.close : ''}`}
          onClick={() => handleViewChange('online')}
        >
          <CircleDot className={css.icon}/>
          <span className={css.buttonText}>Online Friends</span>
        </button>
        <button
          className={`${css.navButton} ${currentView === 'requests' ? css.active : ''} ${isCollapsed ? css.close : ''}`}
          onClick={() => handleViewChange('requests')}
        >
          <UserCog className={css.icon}/>
          <span className={css.buttonText}>Friend Requests</span>
        </button>
        <button
          className={`${css.navButton} ${currentView === 'sent' ? css.active : ''} ${isCollapsed ? css.close : ''}`}
          onClick={() => handleViewChange('sent')}
        >
          <UserX className={css.icon}/>
          <span className={css.buttonText}>Sent Requests</span>
        </button>
        <button
          className={`${css.navButton} ${currentView === 'blocked' ? css.active : ''} ${isCollapsed ? css.close : ''}`}
          onClick={() => handleViewChange('blocked')}
        >
          <Ban className={css.icon}/>
          <span className={css.buttonText}>Blocked List</span>
        </button>
      </div>
      <button
        className={`${css.addFriendButton} ${currentView === 'add' ? css.active : ''} ${isCollapsed ? css.close : ''}`}
        onClick={() => handleViewChange('add')}
      >
        <UserRoundPlus className={css.icon}/>
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
