import Logo from '../Logo/Logo';
import css from './Sidebar.module.css';
import { SidebarMenu } from './components/SidebarMenu/SidebarMenu';
import { useEffect, useState } from 'react';
import { IoLogOut } from 'react-icons/io5';
import Flag from 'react-world-flags';
import { useAuth } from '../../contexts/AuthContext';
import ConfirmationModal from '../ConfirmationModal/ConfirmationModal';
import { useLoadingBar } from '../../contexts/LoadingBarContext';
import ThemeToggle from './components/ThemeToggle/ThemeToggle';
import {
  MENU_ICON_COLOR,
  MENU_ICON_SIZE,
  // SIDEBAR_RESIZE_WIDTH,
} from '../../config/constants';
import apiClient from '../../api/apiClient';
import { API_LOGOUT_URL } from '@/api/apiConfig';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export default function Sidebar() {
  // const [open, setOpen] = useState(true);
  const loadingBarRef = useLoadingBar();
  const { setIsLoggedIn } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    return () => {
      loadingBarRef.current?.complete();
    };
  }, []);

  const { i18n } = useTranslation();
  const [showConfirm, setShowConfirm] = useState(false);
  const [showLangPopup, setShowLangPopup] = useState(false);
  const [selectedLang, setSelectedLang] = useState('English');
  // const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogoutClick = () => {
    setShowConfirm(true);
  };

  const confirmLogout = () => {
    // setIsLoggingOut(true); // start logout process
    loadingBarRef.current?.continuousStart();
    (async () => {
      loadingBarRef.current?.complete();
      setIsLoggedIn(false);
      const response = await apiClient.post(API_LOGOUT_URL);
      // console.log('apiClient ==> Logout response: ', response.data.message);
      response;
      setShowConfirm(false);
      navigate('/auth');
    })();
  };

  const cancelLogout = () => {
    setShowConfirm(false);
  };

  // const handleResize = () => {
  //   if (window.innerWidth <= SIDEBAR_RESIZE_WIDTH) {
  //     setOpen(false);
  //   }
  //   if (window.innerWidth > SIDEBAR_RESIZE_WIDTH) {
  //     setOpen(false);
  //   }
  // };

  // useEffect(() => {
  //   window.addEventListener('resize', handleResize);
  //   handleResize();
  //   return () => {
  //     window.removeEventListener('resize', handleResize);
  //   };
  // }, []);


  const changeLanguage = (lang: string) => {
    setSelectedLang(lang); // Set selected language
    i18n.changeLanguage(lang); // Change the language using i18n
    localStorage.setItem('lang', lang); // Store selected language in localStorage
    setShowLangPopup(false); // Close popup after language selection
  };

  return (
    <aside className={`${css.sidebar}`}>
      {/* <img
        className={`${open ? css.norotate : css.rotate} ${css.controller}`}
        onClick={() => setOpen((open) => !open)}
        src="/icons/control.svg"
      /> */}

      <div className={css.logoBox}>
        <Logo style={css.logo} />
      </div>
      <div className={css.menuBox}>
        <SidebarMenu />
        <div className={`${css.bottom}`}>
        <div
          className={css.languageSwitcher}
          onClick={() => setShowLangPopup((prevState) => !prevState)}
        >
          <Flag
            code={selectedLang === 'en' ? 'US' : selectedLang === 'es' ? 'ES' : 'MA'}
            width={32}
            height={32}
          />
          {showLangPopup && (
            <div className={css.languagePopup}>
              <ul>
                <li onClick={() => changeLanguage('en')}> <Flag className={css.flags} code='US'/> English </li>
                <li onClick={() => changeLanguage('es')}> <Flag className={css.flags} code='ES'/> Español </li>
                <li onClick={() => changeLanguage('tamazight')}> <Flag className={css.flags} code='MA'/> Tamazight </li>
              </ul>
            </div>
          )}
          <p>{selectedLang}</p>
        </div>

          <ThemeToggle className={css.darkMode}></ThemeToggle>
          <div className={css.logout} onClick={handleLogoutClick}>
            <IoLogOut size={MENU_ICON_SIZE} color={MENU_ICON_COLOR} />
            <p>Logout</p>
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