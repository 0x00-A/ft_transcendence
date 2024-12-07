import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import css from './Sidebar.module.css';
import {  CircleDot } from 'lucide-react';
import { RiUserReceived2Line, RiUserShared2Line, RiUserForbidLine } from "react-icons/ri";
import { LuUserPlus } from "react-icons/lu";
import { FiUsers } from "react-icons/fi";
import { FaChevronRight, FaChevronLeft } from "react-icons/fa";


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
          <FiUsers className={css.icon}/>
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
          <div className={css.iconContainer}>
            <RiUserReceived2Line className={css.icon} />
          </div>
          <span className={css.buttonText}>Friend Requests</span>
        </button>
        <button
          className={`${css.navButton} ${currentView === 'sent' ? css.active : ''} ${isCollapsed ? css.close : ''}`}
          onClick={() => handleViewChange('sent')}
        >
          <RiUserShared2Line className={css.icon}/>
          <span className={css.buttonText}>Sent Requests</span>
        </button>
        <button
          className={`${css.navButton} ${currentView === 'blocked' ? css.active : ''} ${isCollapsed ? css.close : ''}`}
          onClick={() => handleViewChange('blocked')}
        >
          <RiUserForbidLine className={css.icon}/>
          <span className={css.buttonText}>Blocked List</span>
        </button>
      </div>
      <button
        className={`${css.addFriendButton} ${currentView === 'add' ? css.active : ''} ${isCollapsed ? css.close : ''}`}
        onClick={() => handleViewChange('add')}
      >
        <LuUserPlus className={css.icon}/>
        <span className={css.buttonText}>Add Friend</span>
      </button>
      <button 
        className={css.collapseButton} 
        onClick={toggleCollapse} 
        aria-label={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
      >
        {isCollapsed ? <FaChevronLeft size={15} /> : <FaChevronRight size={15} />}
      </button>

    </nav>
  );
};

export default Sidebar;
