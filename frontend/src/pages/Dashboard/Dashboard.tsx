// import React from 'react'
import Sidebar from '../../components/Sidebar/Sidebar';
import css from './Dashboard.module.css';

const Dashboard = () => {
  return (
    // <SidebarProvider>
    <div className={css.container}>
      <Sidebar />
      <main className={css.dashboard}>
        <p>Main app</p>
      </main>
    </div>
    // </SidebarProvider>
  );
};

export default Dashboard;
