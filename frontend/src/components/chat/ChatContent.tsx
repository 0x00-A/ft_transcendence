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

interface ChatContentProps {
  customSticker: string;
  isBlocked: boolean;
  onUnblock: () => void;
  onSelectedConversation: {
    id: number;
    avatar: string;
    name: string;
    time: string;
    user1_id: number;
  } | null;
}

const ChatContent: React.FC<ChatContentProps> = ({
    onSelectedConversation,
    customSticker,
    isBlocked,
    onUnblock,
}) => {

  const [chatMessages, setChatMessages] = useState<MessageProps[]>([]);
    const { data: ConversationUser} = useGetData<MessageProps>(
        `chat/conversations/${onSelectedConversation?.id}/messages`
    );

console.log("ConversationUser: ", ConversationUser)
console.log("chatMessages: ", chatMessages)
console.log("currentUserId: ", onSelectedConversation?.user1_id)

useEffect(() => {
  if (onSelectedConversation && Array.isArray(ConversationUser)) {
    setChatMessages(ConversationUser);
  }
}, [onSelectedConversation, ConversationUser]);

  return (
    <>
      <div className={css.messageArea}>
        <MessageArea messages={chatMessages || {}} currentUserId={onSelectedConversation?.user1_id ?? 0} />
      </div>
      <MessageInput
        // onSendMessage={handleSendMessage}
        customSticker={customSticker}
        isBlocked={isBlocked}
        onUnblock={onUnblock}
      />
    </>
  );
};

export default ChatContent;
