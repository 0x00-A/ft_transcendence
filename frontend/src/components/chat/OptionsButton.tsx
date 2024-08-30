import { useState, useRef, useEffect } from 'react';
import css from './OptionsButton.module.css';
import MoreButton from './MoreButton';
import { FaArchive, FaUser } from 'react-icons/fa';
// import { RiRadioButtonLine } from 'react-icons/ri';

const OptionsButton = () => {
  const [showMenu, setShowMenu] = useState<boolean>(false);
  const menuRef = useRef<HTMLDivElement | null>(null);
  const buttonRef = useRef<HTMLDivElement | null>(null);

  const handleOptionsClick = () => {
    setShowMenu(!showMenu);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setShowMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className={css.optionsButtonContainer}>
      <MoreButton ref={buttonRef} onClick={handleOptionsClick} />
      {showMenu && (
        <div ref={menuRef} className={css.menu}>
          <div className={css.menuItem}>
            <FaUser /> See your profile
          </div>
          <div className={css.menuItem}>
            <FaArchive /> Archived chats
          </div>
        </div>
      )}
    </div>
  );
};

export default OptionsButton;
