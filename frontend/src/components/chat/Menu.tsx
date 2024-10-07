import React from 'react';
import {
  FaCheck,
  FaBell,
  FaUser,
  FaPhone,
  FaVideo,
  FaBan,
  FaArchive,
  FaTrash,
  FaExclamationTriangle,
} from 'react-icons/fa';
import css from './Menu.module.css';

const Menu = ({ isOpen, position, onClose }) => {
  if (!isOpen) return null;

  return (
    <>
      <div className={css.overlay} onClick={onClose} />
      <div
        className={css.menu}
        style={{ top: `${position.top}px`, left: `${position.left}px` }}
      >
        <div className={css.menuItem}>
          <FaCheck className={css.icon} />
          <span>Mark as unread</span>
        </div>
        <div className={css.menuItem}>
          <FaBell className={css.icon} />
          <span>Mute notifications</span>
        </div>
        <div className={css.menuItem}>
          <FaUser className={css.icon} />
          <span>View profile</span>
        </div>
        <div className={css.divider} />
        <div className={css.menuItem}>
          <FaPhone className={css.icon} />
          <span>Audio call</span>
        </div>
        <div className={css.menuItem}>
          <FaVideo className={css.icon} />
          <span>Video chat</span>
        </div>
        <div className={css.divider} />
        <div className={css.menuItem}>
          <FaBan className={css.icon} />
          <span>Block</span>
        </div>
        <div className={css.menuItem}>
          <FaArchive className={css.icon} />
          <span>Archive chat</span>
        </div>
        <div className={css.menuItem}>
          <FaTrash className={css.icon} />
          <span>Delete chat</span>
        </div>
        <div className={css.menuItem}>
          <FaExclamationTriangle className={css.icon} />
          <span>Report</span>
        </div>
      </div>
    </>
  );
};

export default Menu;
