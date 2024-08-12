import { NavLink } from 'react-router-dom';
import css from './SidebarMenu.module.css';

import Menus from '../../SidebarData';
import { useState } from 'react';

export const SidebarMenu = ({ open }: { open: boolean | null }) => {
  const [activeLink, setActiveLink] = useState(0);

  return (
    <ul className={css.menu}>
      {Menus.map((item) => (
        <li
          className={`${open ? '' : css.resize}`}
          key={item.id}
          onClick={() => setActiveLink(item.id)}
        >
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
