import React, { useEffect, useState } from 'react';
import css from './ChatContent.module.css';
import MessageArea from './MessageArea';
import MessageInput from './MessageInput';
import { useGetData } from '@/api/apiHooks';

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

interface ChatContentProps {
  customSticker: string;
  isBlocked: boolean;
  onUnblock: () => void;
  onSelectedConversation: ConversationProps;
}

const ChatContent: React.FC<ChatContentProps> = ({
  onSelectedConversation,
  customSticker,
  isBlocked,
  onUnblock,
}) => {
  const [chatMessages, setChatMessages] = useState<MessageProps[]>([]);
  const { data: ConversationUser } = useGetData<MessageProps[]>(
    `chat/conversations/${onSelectedConversation?.id}/messages`
  );


  console.log("rander ChatContent >>>>>>>>>>>>>>>>>>>>>>>>>")

  useEffect(() => {
    if (onSelectedConversation && Array.isArray(ConversationUser)) {
      setChatMessages(ConversationUser);
    }
  }, [onSelectedConversation, ConversationUser]);

  return (
    <>
      <div className={css.messageArea}>
        <MessageArea
          messages={chatMessages}
          conversationData={onSelectedConversation}
        />
      </div>
      <MessageInput
        customSticker={customSticker}
        isBlocked={isBlocked}
        onUnblock={onUnblock}
      />
    </>
  );
};

export default ChatContent;
