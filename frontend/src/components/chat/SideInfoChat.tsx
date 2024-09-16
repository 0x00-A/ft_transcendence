// import { useState, useRef, useEffect } from 'react';
import React from 'react';
import css from './SideInfoChat.module.css';
import ProfileSection from './ProfileSection';
import StatusSection from './StatusSection';
import ButtonSection from './ButtonSection';
import SettingsSection from './SettingsSection';

interface Info {
  avatar: string;
  name: string;
  status: 'online' | 'offline' | 'typing';
  lastSeen?: string;
}

interface SideInfoChatProps {
  selectedMessage: Info;
}

const SideInfoChat: React.FC<SideInfoChatProps> = ({ selectedMessage }) => {
  return (
    <div className={css.sideInfoChat}>
      <ProfileSection
        avatarUrl={selectedMessage.avatar}
        name={selectedMessage.name}
      />
      <StatusSection status={selectedMessage} />
      <ButtonSection />
      <SettingsSection />
    </div>
  );
};

export default SideInfoChat;
