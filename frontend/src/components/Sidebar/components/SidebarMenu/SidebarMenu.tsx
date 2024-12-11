import { NavLink, useLocation } from 'react-router-dom';
import css from './SidebarMenu.module.css';

import Menus from '../../SidebarData';
import { useEffect, useState } from 'react';

export const SidebarMenu = ({ open }: { open: boolean | null }) => {
  const location = useLocation();
  const [activeLink, setActiveLink] = useState(location.pathname);

  useEffect(() => {
    setActiveLink(location.pathname);
  }, [location]);

  return (
    <ul className={css.menu}>
      {Menus.map((item) => (
        <li
          className={`${open ? '' : css.resize}`}
          key={item.id}
          onClick={() => setActiveLink(item.path)}
        >
          <NavLink
            className={`${activeLink === item.path ? css.activeTab : ''}`}
            to={item.path}
          >
            {activeLink === item.path ? item.activeIcon : item.icon}
            {/* if friend and have new request */}
            <p className={`${open ? css.open : css.hidden}`}>{item.title}</p>
          </NavLink>
        </li>
      ))}
    </ul>
  );
};
