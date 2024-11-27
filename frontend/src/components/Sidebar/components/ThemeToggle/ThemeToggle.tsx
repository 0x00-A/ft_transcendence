// ThemeToggle.js
import { useEffect, useState } from 'react';
import css from './ThemeToggle.module.css';
import { MdSunny } from 'react-icons/md';
import { FaMoon } from 'react-icons/fa';
import {
  // DARK_MODE_ICON_SIZE,
  MENU_ICON_COLOR,
  MENU_ICON_SIZE,
} from '../../../../config/constants';

const ThemeToggle = ({
  open,
  className = '',
}: {
  open: boolean;
  className?: string;
}) => {
  const [theme, setTheme] = useState('light');

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      setTheme(savedTheme);
      document.documentElement.setAttribute('data-theme', savedTheme);
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
  };

  return (
    <button
      className={`${css['theme-toggle']} ${className}`}
      onClick={toggleTheme}
    >
      {theme === 'dark' ? (
        <>
          <MdSunny
            color={MENU_ICON_COLOR}
            size={MENU_ICON_SIZE}
            className={css['icon sun-icon']}
          />
          <p className={`${open ? css.open : css.hidden}`}>Light mode</p>
        </>
      ) : (
        <>
          <FaMoon
            color={MENU_ICON_COLOR}
            size={MENU_ICON_SIZE}
            className={css['icon moon-icon']}
          />
          <p className={`${open ? css.open : css.hidden}`}>Dark mode</p>
        </>
      )}
    </button>
  );
};

export default ThemeToggle;
