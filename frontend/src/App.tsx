import { BrowserRouter, Link, Route, Router, Routes } from 'react-router-dom';
import Home from './pages/Home';
import PageNotFound from './pages/PageNotFound';

import { LoadingBarProvider } from './contexts/LoadingBarContext';
import PreLoader from './components/PreLoader/PreLoader';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard/Dashboard';
import Games from './pages/Games/Games';
import Chat from './pages/Chat/Chat';
import Friends from './pages/Friends/Friends';
import Search from './pages/Search/Search';
import Leaderboard from './pages/Leaderboard/Leaderboard';
import Store from './pages/Store/Store';
import Settings from './pages/Settings/Settings';
import { SidebarProvider } from './contexts/SidebarContext';

function App() {
  return (
    <>
      {/* <PreLoader /> */}
      <div>
        <SidebarProvider>
          <LoadingBarProvider>
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/games" element={<Games />} />
                <Route path="/chat" element={<Chat />} />
                <Route path="/friends" element={<Friends />} />
                <Route path="/search" element={<Search />} />
                <Route path="/store" element={<Store />} />
                <Route path="/leaderboard" element={<Leaderboard />} />
                <Route path="/settings" element={<Settings />} />
                <Route path="/login" element={<Login />} />
                <Route path="*" element={<PageNotFound />} />
              </Routes>
            </BrowserRouter>
          </LoadingBarProvider>
        </SidebarProvider>
      </div>
    </>
  );
}

export default App;
