import {
  BrowserRouter as Router,
  Route,
  Routes,
  useLocation,
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
  const showSidebarRoutes = [
    '/',
    '/game',
    '/game/local',
    '/chat',
    '/friends',
    '/search',
    '/store',
    '/leaderboard',
    '/settings',
    '/profile',
  ];
  const location = useLocation();
  const { isLoggedIn } = useAuth();
  const loading = usePreLoader();

  // if (loading) {
  //   return <PreLoader />;
  // }

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
          <Route path="/" element={<Dashboard />} />
          {/* <Route path="/games" element={<Games />} /> */}
          <Route path="/game" element={<ModeSelection />} />
          <Route path="/game/local" element={<LocalGame />} />
          <Route path="/game/chat" element={<GameChat />} />
          <Route path="/game/chat/:room" element={<Room />} />
          {/* <Route path="/game/ai" element={<Pong gameMode={'ai'} />} /> */}
          {/* <Route path="/game/:mode/:gameId" element={<PongGame />} /> */}
          <Route path="/game/remote" element={<RemoteGame />} />
          <Route path="/game/remote/:game_id  " element={<RemoteGame />} />
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
          <Route path="/auth" element={<Auth />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="*" element={<PageNotFound />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
