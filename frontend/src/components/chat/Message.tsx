import React from 'react';
import css from './MessageArea.module.css';

interface MessageProps {
  id: number;
  conversation: number;
  sender: number;
  receiver: number;
  content: string;
  timestamp: string;
  seen: boolean;
}
interface ConversationProps {
  user1_id: number;
  id: number;
  avatar: string;
  name: string;
  lastMessage: string;
  time: string;
  unreadCount?: number;
  status: boolean;
  blocked: boolean;
}

interface MessageComponentProps {
  message: MessageProps;
  isSender: boolean;
  conversationData: ConversationProps | null;
}


const Message: React.FC<MessageComponentProps> = ({ message, isSender, conversationData }) => {
  const { content, timestamp } = message;

  const isSticker = content.includes('<img');

  return (
    <div
      className={`${css.messageWrapper} ${isSender ? css.sender : css.receiver}`}
    >
      {!isSender && (
        <img
          src={conversationData?.avatar}
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
              <p>{conversationData?.name}</p>
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
