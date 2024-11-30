import React from 'react';
import css from './ChatHeader.module.css';
import { FaCircleInfo } from 'react-icons/fa6';
import { useTyping } from '@/contexts/TypingContext';
import { useNavigate } from 'react-router-dom';
import { useSelectedConversation } from '@/contexts/SelectedConversationContext';



interface ChatHeaderProps {
  toggleSidebar: () => void;
}

const ChatHeader: React.FC<ChatHeaderProps> = ({
  toggleSidebar
}) => {

  const { typing } = useTyping();
  const { selectedConversation } = useSelectedConversation();
  const isReceiver = typing.senderId == selectedConversation?.user_id;
  const navigate = useNavigate();


  // console.log("onSelectedConversation: ", selectedConversation?.status);

const renderUserStatus = () => {
    if (!selectedConversation) return null;

    if (typing.typing && isReceiver ) {
      return <p className={`${css.userStatus} ${css.typing}`}>Typing...</p>;
    }

    switch (selectedConversation.status) {
      case true:
        return <p className={`${css.userStatus} ${css.online}`}>Active now</p>;
      case false:
        return (
          <p className={`${css.userStatus} ${css.offline}`}>
            Last seen at {selectedConversation.last_seen}
          </p>
        );
    }
  };

  return (
    <header className={css.chatHeader}>
      {selectedConversation ? (
        <div className={css.chatHeaderContent}>
          <div className={css.userInfo}>
            <div className={`${css.userAvatar} ${selectedConversation.status ? css.online : ''}`} onClick={() => navigate(`/profile/${selectedConversation.name}`)}>
              <img
                src={selectedConversation.avatar}
                alt="User"
                className={css.imageAvatar}
              />
            </div>
            <div className={css.userDetails}>
              <div className={css.usernameheader} onClick={() => navigate(`/profile/${selectedConversation.name}`)}>
                <h2 className={css.userName}>{selectedConversation.name} </h2>
              </div>
              {renderUserStatus()}
            </div>
          </div>
          <div className={css.chatActions}>
            <button className={css.backButton} onClick={toggleSidebar}>
              <i>
                <FaCircleInfo color="#F8F3E3" />
              </i>
            </button>
          </div>
        </div>
      ) : (
        <div className={css.placeholderHeader}>No chats selected</div>
      )}
    </header>
  );
};

export default ChatHeader;
