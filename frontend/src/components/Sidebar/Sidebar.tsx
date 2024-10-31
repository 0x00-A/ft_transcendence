import Logo from '../Logo/Logo';
import css from './Sidebar.module.css';
import { SidebarMenu } from './components/SidebarMenu/SidebarMenu';
import { useEffect, useState } from 'react';
import { IoLogOut } from 'react-icons/io5';
import { useAuth } from '../../contexts/AuthContext';
import ConfirmationModal from '../ConfirmationModal/ConfirmationModal';
import { useLoadingBar } from '../../contexts/LoadingBarContext';
import ThemeToggle from './components/ThemeToggle/ThemeToggle';
import {
  MENU_ICON_COLOR,
  MENU_ICON_SIZE,
  SIDEBAR_RESIZE_WIDTH,
} from '../../config/constants';

export default function Sidebar() {
  const [open, setOpen] = useState(false);
  const loadingBarRef = useLoadingBar();
  const { setIsLoggedIn } = useAuth();

  const [showConfirm, setShowConfirm] = useState(false);
  // const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogoutClick = () => {
    setShowConfirm(true);
  };

  const confirmLogout = () => {
    // setIsLoggingOut(true); // start logout process
    loadingBarRef.current?.continuousStart();
    setTimeout(() => {
      // setIsLoggingOut(false)
      loadingBarRef.current?.complete();
      setIsLoggedIn(false);
      setShowConfirm(false);
      localStorage.clear();
    }, 1000);
  };

  const cancelLogout = () => {
    setShowConfirm(false);
  };

  const handleResize = () => {
    if (window.innerWidth <= SIDEBAR_RESIZE_WIDTH) {
      setOpen(false);
    }
    if (window.innerWidth > SIDEBAR_RESIZE_WIDTH) {
      setOpen(false);
    }
  };

  useEffect(() => {
    window.addEventListener('resize', handleResize);
    handleResize();
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);
  return (
    <aside className={`${css.sidebar} ${open ? '' : css.closed}`}>
      <img
        className={`${open ? css.norotate : css.rotate} ${css.controller}`}
        onClick={() => setOpen((open) => !open)}
        src="/icons/control.svg"
      />

      <div className={css.logoBox}>
        <Logo style={`${open ? css.normal : css.small} ${css.center}`} />
      </div>
      <div className={css.menuBox}>
        <SidebarMenu open={open} />
        <div className={`${!open ? css.padding : ''} ${css.bottom}`}>
          <ThemeToggle className={css.darkMode} open={open}></ThemeToggle>
          <div className={css.logout} onClick={handleLogoutClick}>
            <IoLogOut size={MENU_ICON_SIZE} color={MENU_ICON_COLOR} />
            <p className={`${open ? css.open : css.hidden}`}>Logout</p>
          </div>
        </div>
      </div>
      {showConfirm && (
        <ConfirmationModal
          message="Confirm Logout!"
          onConfirm={confirmLogout}
          onCancel={cancelLogout}
          show={showConfirm}
        ></ConfirmationModal>
      )}
    </aside>
  );
}
