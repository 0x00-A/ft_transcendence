import Logo from '../Logo/Logo';
import css from './Sidebar.module.css';
import { SidebarMenu } from './components/SidebarMenu/SidebarMenu';
// import { useSidebar } from '../../contexts/SidebarContext';
import { useState } from 'react';
// import { CiLogout } from 'react-icons/ci';

export default function Sidebar() {
  // const { open, setOpen } = useSidebar();
  const [open, setOpen] = useState(true);
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
      <SidebarMenu open={open} />
    </aside>
  );
}
