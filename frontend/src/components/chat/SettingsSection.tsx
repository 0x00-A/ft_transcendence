import { useState } from 'react';
import css from './SettingsSection.module.css';
import { FaBell, FaBan } from 'react-icons/fa';
import { FaAngleDown, FaAngleUp } from 'react-icons/fa6';
import { useSelectedConversation } from '@/contexts/SelectedConversationContext';
import { useUser } from '@/contexts/UserContext';
import { useWebSocketChat } from '@/contexts/WebSocketChatProvider';



const SettingsSection = () => {
  const [isPrivacyOpen, setIsPrivacyOpen] = useState(false);
  const { selectedConversation } = useSelectedConversation();
  const { user } = useUser();
  const { toggleBlockStatus } = useWebSocketChat();




  const togglePrivacy = () => setIsPrivacyOpen(!isPrivacyOpen);


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
        <div className={css.sectionHeader} onClick={togglePrivacy}>
          Privacy
          <span className={isPrivacyOpen ? css.iconRotated : ''}>
            {isPrivacyOpen ? <FaAngleDown /> : <FaAngleUp />}
          </span>
        </div>
        {isPrivacyOpen && (
          <div className={css.sectionContent}>
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
