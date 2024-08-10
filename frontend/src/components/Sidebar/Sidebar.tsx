import { NavLink } from 'react-router-dom';
import Logo from '../Logo/Logo';
import css from './Sidebar.module.css';
import { LuArrowLeftCircle } from 'react-icons/lu';
import ControlSVG from '/icons/vector.svg';
import { useState } from 'react';

export default function Sidebar() {
  const [open, setOpen] = useState(true);
  return (
    <aside className={`${css.sidebar} ${open ? '' : css.closed}`}>
      <img
        className={`${open ? css.norotate : css.rotate}`}
        onClick={() => setOpen((open) => !open)}
        src={ControlSVG}
        alt=""
      />
      <Logo style={open ? '' : css.small} />
      {/* <nav className={css.nav}>
        <div>
          <Logo />
          <button>
            <LuArrowLeftCircle />
          </button>
        </div>
        <ul>
          <li>
            <NavLink to="/"></NavLink>
          </li>
        </ul>
      </nav> */}
    </aside>
  );
}
