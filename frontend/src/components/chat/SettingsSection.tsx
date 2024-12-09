import { useState } from 'react';
import css from './SettingsSection.module.css';
import { FaBan } from 'react-icons/fa';
import { useSelectedConversation } from '@/contexts/SelectedConversationContext';
import { useUser } from '@/contexts/UserContext';
import { useWebSocketChat } from '@/contexts/WebSocketChatProvider';
import { ChevronRight, ChevronDown } from 'lucide-react';
import { useGetData } from '@/api/apiHooks';
import { MutualFriend, Friends } from '@/types/apiTypes';
import { useNavigate } from 'react-router-dom';
import MutualFriendSkeleton from './MutualFriendSkeleton';

const SettingsSection = () => {
  const [isPrivacyOpen, setIsPrivacyOpen] = useState(false);
  const { selectedConversation } = useSelectedConversation();
  const { user } = useUser();
  const { toggleBlockStatus } = useWebSocketChat();
  const [isMutualFriendsOpen, setIsMutualFriendsOpen] = useState(false);
  const { data: mutualFriends, isLoading: mutualIsLoading } = useGetData<MutualFriend>(
    `/friends/mutual/${selectedConversation?.name}`
  );
  const navigate = useNavigate();

  console.log("mutualFriends: ", mutualFriends)

  const togglePrivacy = () => setIsPrivacyOpen(!isPrivacyOpen);
  const toggleMutualFriends = () => setIsMutualFriendsOpen(!isMutualFriendsOpen);

  const handleBlock = async () => {
    if (user?.id !== undefined) {
      if (selectedConversation?.block_status == 'blocker')
        toggleBlockStatus(selectedConversation.id, user.id, selectedConversation.user_id, false);
      else if (selectedConversation?.block_status == 'blocked')
        toggleBlockStatus(selectedConversation.id, user.id, selectedConversation.user_id, true);
      else toggleBlockStatus(selectedConversation!.id, user.id, selectedConversation!.user_id, true);
    }
  };

  return (
    <div className={css.settingsSection}>
      <div className={css.section}>
        <div className={css.sectionHeader} onClick={togglePrivacy}>
          Privacy
          {isPrivacyOpen ? <ChevronDown /> : <ChevronRight />}
        </div>
        {isPrivacyOpen && (
          <div className={css.sectionContent}>
            <div className={css.Item} onClick={() => handleBlock()}>
              <FaBan />
              <span> {selectedConversation?.block_status === 'blocker' ? 'Unblock' : 'Block'} </span>
            </div>
          </div>
        )}
      </div>
        <hr />
      <div className={css.section}>
        <div className={css.sectionHeader} onClick={toggleMutualFriends}>
          Mutual Friends
          {isMutualFriendsOpen ? <ChevronDown /> : <ChevronRight />}
        </div>
        {isMutualFriendsOpen && (
          <div className={css.sectionContent}>
            <div className={css.mutualFriendsContainer}>
            {isMutualFriendsOpen && (
              <div className={css.sectionContent}>
                <div className={css.mutualFriendsContainer}>
                  {mutualIsLoading ? (
                    <MutualFriendSkeleton />
                  ) : mutualFriends?.mutual_friends ? (
                    mutualFriends.mutual_friends.map((friend: Friends) => (
                      <div
                        key={friend.id}
                        className={css.mutualFriendItem}
                        onClick={() => navigate(`/profile/${friend.username}`)}
                      >
                        <div className={`${css.avatar} ${friend.profile.is_online ? css.online : css.offline}`}>
                          <img src={friend.profile.avatar} alt={friend.username} />
                        </div>
                        <span>{friend.username}</span>
                      </div>
                    ))
                  ) : null}
            </div>
          </div>
        )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SettingsSection;