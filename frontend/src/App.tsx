import {
  BrowserRouter as Router,
  Route,
  Routes,
  useLocation,
  Navigate,
} from 'react-router-dom';
import PageNotFound from './pages/PageNotFound';

import { LoadingBarProvider } from './contexts/LoadingBarContext';
import PreLoader from './components/PreLoader/PreLoader';
// import Login from './pages/Login';
// import Login from './pages/Auth/Login';
import Auth from './pages/Auth/Auth';
import Profile from './pages/Profile/Profile';
import Dashboard from './pages/Dashboard/Dashboard';
import ModeSelection from './pages/Game/ModeSelection';
import Chat from './pages/Chat/Chat';
import Friends from './pages/Friends/Friends';
import Search from './pages/Search/Search';
import Leaderboard from './pages/Leaderboard/Leaderboard';
import Store from './pages/Store/Store';
import Settings from './pages/Settings/Settings';
import Sidebar from './components/Sidebar/Sidebar';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import './App.css';
// import Signup from './pages/Signup';
import Topbar from './components/Topbar/Topbar';
import usePreLoader from './hooks/usePreLoader';
import PongGame from './components/Game/PongGame';
import Pong from './components/Game/components/Pong/Pong';
import RemoteGame from './components/Game/RemoteGame/RemoteGame';
import PingPongGame from './components/Game/LocalGame/PingPongGame';
import LocalGame from './components/Game/LocalGame/LocalGame';
import GameChat from './components/Game/RemoteGame/GameChat';
import Room from './components/Game/RemoteGame/Room';
import Tournament from './components/Game/Tournament/Tournament';
import Test from './components/Game/Tournament/Test';
import ProtectedRoute from './components/ProtectedRoute';
import { useEffect, useRef } from 'react';
import { getToken } from './utils/getToken';
import getWebSocketUrl from './utils/getWebSocketUrl';
import Oauth2Callback from './pages/Auth/Oauth2Callback';
// import Signup from './pages/Auth/Signup';

function App() {
  return (
    <Router>
      <LoadingBarProvider>
        <AuthProvider>
          <AppContent />
        </AuthProvider>
      </LoadingBarProvider>
    </Router>
  );
}

function AppContent() {
  const onlineSocketRef = useRef<WebSocket | null>(null);

  const showSidebarRoutes = [
    '/',
    '/game',
    '/game/',
    '/game/tournament',
    '/game/tournament/',
    '/game/local',
    '/game/local/',
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
    '/settings',
    '/settings/',
    '/profile',
    '/profile/',
  ];
  const location = useLocation();
  const { isLoggedIn } = useAuth();
  // const loading = usePreLoader();

  // if (loading) {
  //   return <PreLoader />;
  // }

  useEffect(() => {
    (async () => {
        const token = await getToken();
        if (!token) {
          console.log(`No valid token: ${token}`);
          return;
        }
        const wsUrl = `${getWebSocketUrl('online-status/')}?token=${token}`;
        const socket = new WebSocket(wsUrl);
        onlineSocketRef.current = socket;
    })()

    return () => {
        if (onlineSocketRef.current) {
            onlineSocketRef.current.close();
        }
    };
  }, [])


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
          <Route path="/auth" element={ !isLoggedIn ? <Auth /> : <Navigate to={'/'} />} />
          <Route path="/oauth2/callback" element={<Oauth2Callback />} />
          <Route path="*" element={<PageNotFound />} />
          <Route element={<ProtectedRoute />}>
            <Route path="/" element={<Dashboard />} />
            {/* <Route path="/games" element={<Games />} /> */}
            <Route path="/game" element={<ModeSelection />} />
            <Route path="/test" element={<Test />} />
            <Route path="/game/local" element={<LocalGame />} />
            <Route path="/game/tournament" element={<Tournament />} />
            <Route path="/game/chat" element={<GameChat />} />
            <Route path="/game/chat/:room" element={<Room />} />
            {/* <Route path="/game/ai" element={<Pong gameMode={'ai'} />} /> */}
            {/* <Route path="/game/:mode/:gameId" element={<PongGame />} /> */}
            {/* <Route path="/game/remote" element={<RemoteGame />} /> */}
            <Route path="/game/:game_address" element={<RemoteGame />} />
            {/* <Route path="/game/remote/:gameId" element={<RemoteGame />}> */}
            {/* Remote game instance with game ID */}
            {/* <Route path=":gameId" element={<RemoteGameInstance />} /> */}
            {/* </Route> */}
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
