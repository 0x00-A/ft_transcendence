import React from 'react';
import css from './MessageArea.module.css';
import { useUser } from '@/contexts/UserContext';
import { conversationProps } from '@/types/apiTypes';
import { useSelectedConversation } from '@/contexts/SelectedConversationContext';

interface MessageProps {
  id: number;
  conversation: number;
  sender: number;
  receiver: number;
  content: string;
  timestamp: string;
  seen?: boolean;
}

interface MessageComponentProps {
  message: MessageProps;
}


const Message: React.FC<MessageComponentProps> = ({ message }) => {
  const { content, timestamp } = message;

  // console.log("rander Message >>>>>>>>>>>>>>>>>>>>>>>>>")
  const {user} = useUser()
  const { selectedConversation } = useSelectedConversation();

  const isSticker = content.includes('<img');
  const isSender = user?.id === message.sender;
  return (
    <div
      className={`${css.messageWrapper} ${isSender ? css.sender : css.receiver}`}
    >
      {!isSender && (
        <img
          src={selectedConversation?.avatar}
          alt="avatar"
          className={css.avatar}
        />
      )}
      <div className={css.sideMessage}>
        <div className={css.nameAndTime}>
          {isSender ? (
            <div className={css.senderInfo}>
              <span>{new Date(timestamp).toLocaleTimeString()}</span> • <p>YOU</p>
            </div>
          ) : (
            <div className={css.receiverInfo}>
              <p>{selectedConversation?.name}</p>
              • <span>{new Date(timestamp).toLocaleTimeString()}</span>
            </div>
          )}
        </div>
        {isSticker ? (
          <div
            className={css.stickerContainer}
            dangerouslySetInnerHTML={{ __html: content }}
          />
        ) : (
          <div className={css.messageBubble}>
            <p>{content}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Message;
