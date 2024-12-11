// import { useState, useRef, useEffect } from 'react';
import css from './SideInfoChat.module.css';
import ProfileSection from './ProfileSection';
import StatusSection from './StatusSection';
import ButtonSection from './ButtonSection';
import SettingsSection from './SettingsSection';
import { useSelectedConversation } from '@/contexts/SelectedConversationContext';





const SideInfoChat = () => {

  const { selectedConversation } = useSelectedConversation();

  return (
    <div className={css.sideInfoChat}>
      <ProfileSection
        avatarUrl={selectedConversation!.avatar}
        name={selectedConversation!.name}
      />
      <StatusSection/>
      <ButtonSection />
      <SettingsSection />
    </div>
  );
};

export default SideInfoChat;
