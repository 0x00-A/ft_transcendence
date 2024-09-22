import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import css from './Friends.module.css';
import Sidebar from '../../components/Friends/Sidebar';
import AddFriend from '../../components/Friends/AddFriend';

type ViewType = 'add' | 'all' | 'online' | 'requests' | 'sent' | 'blocked';

const Friends: React.FC = () => {
  const { isLoggedIn } = useAuth();
  const [currentView, setCurrentView] = useState<ViewType>('add');

  if (!isLoggedIn) {
    return <Navigate to="/signup" />;
  }

  const renderContent = () => {
    switch (currentView) {
      case 'add':
        return <AddFriend />;
      // Implement other views as needed
      default:
        return <AddFriend />;
    }
  };

  return (
    <main className={css.CenterContainer}>
      <div className={css.container}>
        <div className={css.content}>{renderContent()}</div>
        <Sidebar setView={setCurrentView} currentView={currentView} />
      </div>
    </main>
  );
};

export default Friends;
