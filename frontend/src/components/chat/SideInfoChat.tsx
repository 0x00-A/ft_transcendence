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
  lastMessage: string;
  time: string;
  unreadCount?: number;
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
      <StatusSection status="typing..." />
      <ButtonSection />
      <SettingsSection />
    </div>
  );
};

export default SideInfoChat;
