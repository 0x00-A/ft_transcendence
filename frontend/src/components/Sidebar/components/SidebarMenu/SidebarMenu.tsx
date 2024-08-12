import { NavLink, useLocation } from 'react-router-dom';
import css from './SidebarMenu.module.css';
// import SearchSVG from '/icons/search.svg';
// import NavItem from '../NavItem/NavItem';

import Menus from '../../SidebarData';
import { useSidebar } from '../../../../contexts/SidebarContext';

export const SidebarMenu = () => {
  const { open, setOpen } = useSidebar();

  const location = useLocation();

  return (
    <ul className={css.menu}>
      {Menus.map((item) => (
        <li key={item.id}>
          <NavLink
            className={`${location.pathname === item.path ? css.activeTab : ''}`}
            to={item.path}
          >
            {location.pathname === item.path ? item.activeIcon : item.icon}
            <p className={`${open ? css.open : css.hidden}`}>{item.title}</p>
          </NavLink>
        </li>
      ))}
    </ul>
  );
};
