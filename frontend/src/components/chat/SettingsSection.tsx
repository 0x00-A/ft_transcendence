import { useState } from 'react';
import css from './SettingsSection.module.css';
import { FaBell, FaBan, FaThumbtack } from 'react-icons/fa';
import { FaAngleDown, FaAngleUp, FaFaceGrin } from 'react-icons/fa6';

interface SettingsSectionProps {
  onEmojiChange: () => void;
}

const SettingsSection: React.FC<SettingsSectionProps> = ({ onEmojiChange }) => {
  const [isPrivacyOpen, setIsPrivacyOpen] = useState(false);
  const [isChatInfoOpen, setIsChatInfoOpen] = useState(false);
  const [isCustomizeChatOpen, setIsCustomizeChatOpen] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  const togglePrivacy = () => setIsPrivacyOpen(!isPrivacyOpen);
  const toggleChatInfo = () => setIsChatInfoOpen(!isChatInfoOpen);
  const toggleCustomizeChat = () =>
    setIsCustomizeChatOpen(!isCustomizeChatOpen);

  const customEmojis = [
    '👍',
    '❤️',
    '😊',
    '🎉',
    '🔥',
    '👀',
    '🙌',
    '🤔',
    '👋',
    '🚀',
  ];

  const handleEmojiSelect = (emoji: string) => {
    onEmojiChange(emoji);
    setShowEmojiPicker(false);
  };

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
            <div
              className={css.Item}
              onClick={() => setShowEmojiPicker(!showEmojiPicker)}
            >
              <FaFaceGrin /> Change emoji
            </div>
            {showEmojiPicker && (
              <div className={css.customEmojiPicker}>
                {customEmojis.map((emoji, index) => (
                  <button
                    key={index}
                    className={css.emojiButton}
                    onClick={() => handleEmojiSelect(emoji)}
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            )}
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
