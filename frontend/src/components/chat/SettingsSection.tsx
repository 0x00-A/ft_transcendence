import React, { useState } from 'react';
import css from './SettingsSection.module.css';
import { FaBell, FaBan, FaThumbtack } from 'react-icons/fa';
import { FaAngleDown, FaAngleUp } from 'react-icons/fa6';

const SettingsSection: React.FC = () => {
  const [isPrivacyOpen, setIsPrivacyOpen] = useState(false);
  const [isChatInfoOpen, setIsChatInfoOpen] = useState(false);
  const [isCustomizeChatOpen, setIsCustomizeChatOpen] = useState(false);

  const togglePrivacy = () => setIsPrivacyOpen(!isPrivacyOpen);
  const toggleChatInfo = () => setIsChatInfoOpen(!isChatInfoOpen);
  const toggleCustomizeChat = () =>
    setIsCustomizeChatOpen(!isCustomizeChatOpen);

  return (
    <div className={css.settingsSection}>
      <div className={css.section}>
        <div className={css.sectionHeader} onClick={toggleChatInfo}>
          Chat info
          <span className={isChatInfoOpen ? css.iconRotated : ''}>
            {isChatInfoOpen ? <FaAngleDown /> : <FaAngleUp />}
          </span>
        </div>
        {isChatInfoOpen && (
          <div className={css.sectionContent}>
            <div className={css.Item}>
              <FaThumbtack /> View pinned messages
            </div>
          </div>
        )}
      </div>
      <div className={css.section}>
        <div className={css.sectionHeader} onClick={toggleCustomizeChat}>
          Customize chat
          <span className={isCustomizeChatOpen ? css.iconRotated : ''}>
            {isCustomizeChatOpen ? <FaAngleDown /> : <FaAngleUp />}
          </span>
        </div>
        {isCustomizeChatOpen && (
          <div className={css.sectionContent}>
            <p>Change theme</p>
          </div>
        )}
      </div>

      <div className={css.section}>
        <div className={css.sectionHeader} onClick={togglePrivacy}>
          Privacy
          <span className={isPrivacyOpen ? css.iconRotated : ''}>
            {isPrivacyOpen ? <FaAngleDown /> : <FaAngleUp />}
          </span>
        </div>
        {isPrivacyOpen && (
          <div className={css.sectionContent}>
            <div className={css.Item}>
              <FaBell /> Mute notifications
            </div>
            <div className={css.Item}>
              <FaBan /> Block
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SettingsSection;
