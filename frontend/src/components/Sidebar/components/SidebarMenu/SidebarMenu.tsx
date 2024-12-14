import { NavLink, useLocation } from 'react-router-dom';
import css from './SidebarMenu.module.css';

import Menus from '../../SidebarData';
import { useEffect, useState } from 'react';

export const SidebarMenu = ({ open = false }: { open?: boolean | null }) => {
  const location = useLocation();
  const [activeLink, setActiveLink] = useState(location.pathname);
  const MenusList = Menus();

  useEffect(() => {
    setActiveLink(location.pathname);
  }, [location]);

  return (
    <ul className={css.menu}>
      {MenusList.map((item) => (
        <li
          className={`${open ? '' : ''}`}
          key={item.id}
          onClick={() => setActiveLink(item.path)}
        >
          <NavLink
            className={`${activeLink === item.path ? css.activeTab : ''}`}
            to={item.path}
          >
            {activeLink === item.path ? item.activeIcon : item.icon}
            <p className={`${open ? '' : ''}`}>{item.title}</p>
          </NavLink>
        </li>
      ))}
    </ul>
  );
};