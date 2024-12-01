import { useState } from 'react';
import css from './SettingsSection.module.css';
import { FaBell, FaBan, FaThumbtack } from 'react-icons/fa';
import { FaAngleDown, FaAngleUp, FaFaceGrin } from 'react-icons/fa6';
import { useSelectedConversation } from '@/contexts/SelectedConversationContext';
import { useUser } from '@/contexts/UserContext';
import { useWebSocketChat } from '@/contexts/WebSocketChatProvider';

interface SettingsSectionProps {
  onEmojiChange: (emoji: string) => void;
}

const SettingsSection: React.FC<SettingsSectionProps> = ({ onEmojiChange }) => {
  const [isPrivacyOpen, setIsPrivacyOpen] = useState(false);
  const [isChatInfoOpen, setIsChatInfoOpen] = useState(false);
  const [isCustomizeChatOpen, setIsCustomizeChatOpen] = useState(false);
  const [showStickerPicker, setShowStickerPicker] = useState(false);
  const { selectedConversation } = useSelectedConversation();
  const { user } = useUser();
  const { toggleBlockStatus } = useWebSocketChat();




  const togglePrivacy = () => setIsPrivacyOpen(!isPrivacyOpen);
  const toggleChatInfo = () => setIsChatInfoOpen(!isChatInfoOpen);
  const toggleCustomizeChat = () => setIsCustomizeChatOpen(!isCustomizeChatOpen);

  const customStickers = [
    '<img src="/icons/chat/love.svg" alt="svg" />',
    '<img src="/icons/chat/cat1.svg" alt="svg" />',
    '<img src="/icons/chat/cat2.svg" alt="svg" />',
    '<img src="/icons/chat/eat.svg" alt="svg" />',
    '<img src="/icons/chat/like.svg" alt="love" />',
    '<img src="/icons/chat/nolike.svg" alt="love" />',
    '<img src="/icons/chat/stickers1.svg" alt="love" />',
    '<img src="/icons/chat/stickers2.svg" alt="love" />',
    '<img src="/icons/chat/me.png" alt="mehdi" />',
    '<img src="/icons/chat/rel.png" alt="mehdi" />',
    '<img src="/icons/chat/abdo.png" alt="mehdi" />',
  ];

  const handleStickerSelect = (sticker: string) => {
    onEmojiChange(sticker);
    setShowStickerPicker(false);
  };

  const handleBlock = async () => {
    if (user?.id !== undefined) {
      if (selectedConversation?.block_status == "blocker")
        toggleBlockStatus(selectedConversation.id, user.id, selectedConversation.user_id, false);
      else if (selectedConversation?.block_status == "blocked")
        toggleBlockStatus(selectedConversation.id, user.id, selectedConversation.user_id, true);
      else
        toggleBlockStatus(selectedConversation!.id, user.id, selectedConversation!.user_id, true);
    }
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
              onClick={() => setShowStickerPicker(!showStickerPicker)}
            >
              <FaFaceGrin /> Change sticker
            </div>
            {showStickerPicker && (
              <div className={css.customStickerPicker}>
                {customStickers.map((sticker, index) => (
                  <button
                    key={index}
                    className={css.stickerButton}
                    onClick={() => handleStickerSelect(sticker)}
                    dangerouslySetInnerHTML={{ __html: sticker }}
                  />
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
            <div
              className={css.Item}
              onClick={() => handleBlock()}
              >
              <FaBan /><span> {selectedConversation?.block_status === "blocker" ? "Unblock" : "Block"} </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SettingsSection;
