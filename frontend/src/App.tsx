import {
  BrowserRouter as Router,
  Route,
  Routes,
  useLocation,
  Navigate,
  useNavigate,
} from 'react-router-dom';
import PageNotFound from './pages/PageNotFound';

import { LoadingBarProvider } from './contexts/LoadingBarContext';
import PreLoader from './components/PreLoader/PreLoader';
// import Login from './pages/Login';
// import Login from './pages/Auth/Login';
import Auth from './pages/Auth/Auth';
import Profile from './pages/Profile/Profile';
import Dashboard from './pages/Dashboard/Dashboard';
import Chat from './pages/Chat/Chat';
import Friends from './pages/Friends/Friends';
import Search from './pages/Search/Search';
import Leaderboard from './pages/Leaderboard/Leaderboard';
import Store from './pages/Store/Store';
import Settings from './pages/Settings/Settings';
import Sidebar from './components/Sidebar/Sidebar';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import './App.css';
import Topbar from './components/Topbar/Topbar';
import GameChat from './components/Game/RemoteGame/GameChat';
import Room from './components/Game/RemoteGame/Room';
import ProtectedRoute from './components/ProtectedRoute';
import { useEffect, useRef, useState } from 'react';
import getWebSocketUrl from './utils/getWebSocketUrl';
import Game from './pages/Game/Game';
import Oauth2Callback from './pages/Auth/Oauth2Callback';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { WebSocketProvider } from './contexts/WebSocketContext';
import { UserProvider } from './contexts/UserContext';
import { GameInviteProvider, useGameInvite } from './contexts/GameInviteContext';
import React from 'react';
import OtpAuth from './pages/Auth/OtpAuth';


function App() {
  return (
    <Router>
      <LoadingBarProvider>
        <AuthProvider>
          <UserProvider>
            <GameInviteProvider>
              <WebSocketProvider>
                <ToastContainer
                  position="top-center"
                  autoClose={2000}
                  hideProgressBar={true}
                  // newestOnTop={true}
                  closeOnClick
                  rtl={false}
                  // pauseOnFocusLoss
                  // draggable
                  // pauseOnHover
                  // theme="colored"
                  toastClassName='toastStyle'
                  />
                <AppContent />
              </WebSocketProvider>
            </ GameInviteProvider>
          </UserProvider>
        </AuthProvider>
      </LoadingBarProvider>
    </Router>
  );
}

function AppContent() {


  const showSidebarRoutes = [
    '/',
    '/play',
    '/play/',
    '/chat',
    '/chat/',
    '/friends',
    '/friends/',
    '/search',
    '/search/',
    '/store',
    '/store/',
    '/leaderboard',
    '/leaderboard/',
    '/profile',
    '/auth/2factor',
  ];
  const location = useLocation();
  const { isLoggedIn } = useAuth();
  // const loading = usePreLoader();

  // if (loading) {
  //   return <PreLoader />;
  // }
  const { gameAccepted, gameInvite } = useGameInvite();
  const navigate = useNavigate();

  useEffect(() => {
    if (gameAccepted && gameInvite) {
      navigate(`/play`);
    }
  }, [gameAccepted, gameInvite, navigate]);

  return (
    <div className="app-container ">
      <PreLoader />
      {showSidebarRoutes.includes(location.pathname) && isLoggedIn && (
        <Sidebar />
      )}
      <div className="main-content">
        {showSidebarRoutes.includes(location.pathname) && isLoggedIn && (
          <Topbar />
        )}
        <Routes>
            <Route path="/auth" element={<Auth />}/>
            <Route path="/oauth2/callback" element={<Oauth2Callback />} />
            <Route path='/auth/2factor' element={<OtpAuth/>} />
            <Route path="*" element={<PageNotFound />} />
            <Route element={<ProtectedRoute />}>
              <Route path="/" element={<Dashboard />} />
              <Route path="/play" element={<Game />} />
              <Route path="/game/chat" element={<GameChat />} />
              <Route path="/game/chat/:room" element={<Room />} />
              <Route path="/chat" element={<Chat />} />
              <Route path="/friends" element={<Friends />} />
              <Route path="/search" element={<Search />} />
              <Route path="/store" element={<Store />} />
              <Route path="/leaderboard" element={<Leaderboard />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="*" element={<PageNotFound />} />
          </Route>
        </Routes>
      </div>
    </div>
  );
}

export default App;
