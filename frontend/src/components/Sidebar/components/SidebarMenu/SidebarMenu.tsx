import { NavLink, useLocation } from 'react-router-dom';
import css from './SidebarMenu.module.css';
// import SearchSVG from '/icons/search.svg';
// import NavItem from '../NavItem/NavItem';

import Menus from '../../SidebarData';
import { useState } from 'react';
// import { useSidebar } from '../../../../contexts/SidebarContext';

export const SidebarMenu = ({ open }: { open: boolean | null }) => {
  // const { open, setOpen } = useSidebar();

  // const location = useLocation();
  const [activeLink, setActiveLink] = useState(0);

  return (
    <ul className={css.menu}>
      {Menus.map((item) => (
        <li key={item.id} onClick={() => setActiveLink(item.id)}>
          <NavLink
            className={`${activeLink === item.id ? css.activeTab : ''}`}
            to={item.path}
          >
            {activeLink === item.id ? item.activeIcon : item.icon}
            <p className={`${open ? css.open : css.hidden}`}>{item.title}</p>
          </NavLink>
        </li>
      ))}
    </ul>
  );
};
