import { NavLink } from 'react-router-dom';
import css from './SidebarMenu.module.css';
import SearchSVG from '/icons/search.svg';
import NavItem from '../NavItem/NavItem';

export const SidebarMenu = () => {
  const Menus = [
    { title: 'Dashboard', src: 'store.svg' },
    { title: 'Chat', src: 'chat.svg' },
    { title: 'Accounts', src: 'User', gap: true },
    { title: 'Schedule ', src: 'Calendar' },
    { title: 'Search', src: 'Search' },
    { title: 'Analytics', src: 'Chart' },
    { title: 'Files ', src: 'Folder', gap: true },
    { title: 'Setting', src: 'Setting' },
  ];
  return (
    <ul>
      <li>
        <NavLink to="/"></NavLink>
      </li>

      {Menus.map((item) => (
        <NavItem title={item.title} src={item.src} url={item.url} />
      ))}
    </ul>
  );
};
