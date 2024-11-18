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
  status: boolean;
  lastSeen?: string;
  blocked: boolean;
}

interface SideInfoChatProps {
  onSelectedConversation: Info;
  onEmojiChange: (newSticker: string) => void;
}

const SideInfoChat: React.FC<SideInfoChatProps> = ({
  onSelectedConversation,
  onEmojiChange,
}) => {
  return (
    <div className={css.sideInfoChat}>
      <ProfileSection
        avatarUrl={onSelectedConversation.avatar}
        name={onSelectedConversation.name}
      />
      <StatusSection status={onSelectedConversation} />
      <ButtonSection />
      <SettingsSection onEmojiChange={onEmojiChange} />
    </div>
  );
};

export default SideInfoChat;
