import  { useState } from 'react';
import css from './MoreMenu.module.css';
import { EllipsisVertical, MessageSquareMore, ShieldMinus, Swords } from 'lucide-react';

const MoreMenu = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <div className={css.moreMenu}>

      <EllipsisVertical color='#f8c35c' onClick={toggleMenu}/>

      {isMenuOpen && (
        <div className={css.menu}>
          <div className={css.menuItem}>
            <MessageSquareMore color='#f8c35c' className={css.menuIcon} />
            <span>Message</span>
          </div>
          <div className={css.menuItem}>
            <ShieldMinus color='#f8c35c' className={css.menuIcon} />
            <span>Block</span>
          </div>
          <div className={css.menuItem}>
            <Swords color='#f8c35c' className={css.menuIcon} />
            <span>challenge</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default MoreMenu;
