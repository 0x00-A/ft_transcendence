import Logo from '../Logo/Logo';
import css from './Sidebar.module.css';
import { SidebarMenu } from './components/SidebarMenu/SidebarMenu';
import { useState } from 'react';
import { IoLogOut } from 'react-icons/io5';
import { useAuth } from '../../contexts/AuthContext';

export default function Sidebar() {
  const [open, setOpen] = useState(true);
  const { setIsLoggedIn } = useAuth();

  function handleLogout() {
    setIsLoggedIn(false);
    // logout logic
  }
  return (
    <aside className={`${css.sidebar} ${open ? '' : css.closed}`}>
      <img
        className={`${open ? css.norotate : css.rotate} ${css.controller}`}
        onClick={() => setOpen((open) => !open)}
        src="/icons/menu/control.svg"
      />

      <div className={css.logoBox}>
        <Logo style={`${open ? '' : css.small} ${css.center}`} />
      </div>
      {/* <div className={css.navigation}> */}
      <SidebarMenu open={open} />
      <div className={`${!open ? css.padding : ''} ${css.bottom}`}>
        <div className={css.logout} onClick={handleLogout}>
          <IoLogOut size={32} color="#F8F3E3" />
          <p className={`${open ? css.open : css.hidden}`}>Logout</p>
        </div>
      </div>
      {/* </div> */}
    </aside>
  );
}
