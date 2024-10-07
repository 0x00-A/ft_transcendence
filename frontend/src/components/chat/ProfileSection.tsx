// import { useState, useRef, useEffect } from 'react';
import css from './ProfileSection.module.css';

interface ProfileSectionProps {
  avatarUrl: string;
  name: string;
}

const ProfileSection: React.FC<ProfileSectionProps> = ({ avatarUrl, name }) => {
  return (
    <div className={css.profileSection}>
      <img className={css.avatar} src={avatarUrl} alt="avatar" />
      <h2 className={css.name}>{name}</h2>
    </div>
  );
};

export default ProfileSection;
