import React, { useCallback, useEffect, useRef, useState } from 'react';
import css from './ChatContent.module.css';
import MessageArea from './MessageArea';
import MessageInput from './MessageInput';
import { useGetData } from '@/api/apiHooks';
import { useUser } from '@/contexts/UserContext';
import { useWebSocket } from '@/contexts/WebSocketChatProvider';

interface MessageProps {
  id: number;
  conversation: number;
  sender: number;
  receiver: number;
  content: string;
  timestamp: string;
  seen?: boolean;
}

interface ConversationProps {
  user1_id: number;
  user2_id: number;
  id: number;
  avatar: string;
  name: string;
}

interface ChatContentProps {
  customSticker: string;
  onSelectedConversation: ConversationProps;
}

const ChatContent: React.FC<ChatContentProps> = ({
  onSelectedConversation,
  customSticker,
}) => {
  const { user } = useUser();
  const [chatMessages, setChatMessages] = useState<MessageProps[]>([]);
  const { data: fetchedMessages, isLoading, error } = useGetData<MessageProps[]>(
    `chat/conversations/${onSelectedConversation?.id}/messages`
  );

  const { messages: websocketMessages, sendMessage, sendTypingStatus } = useWebSocket();

  
  const isCurrentUserUser1 = user?.id === onSelectedConversation.user1_id;
  const otherUserId = isCurrentUserUser1
  ? onSelectedConversation.user2_id
  : onSelectedConversation.user1_id;
  
  useEffect(() => {
    setChatMessages(() => [
      ...(fetchedMessages || []),
      ...websocketMessages,
    ]);
  }, [fetchedMessages, websocketMessages]);

  
  const handleSendMessage = useCallback(
    (message: string) => {
      if (message.trim()) {
        sendMessage(otherUserId, message); 
      }
    },
    [sendMessage, otherUserId]
  );
  
    const handleTyping = useCallback(
      (isTyping: boolean) => {
        sendTypingStatus(otherUserId, isTyping); 
      },
      [sendTypingStatus, otherUserId]
    );

  return (
    <>
      <div className={css.messageArea}>
        {isLoading ? (
          <div>Loading messages...</div>
        ) : error ? (
          <div>Error loading messages</div>
        ) : (
          <MessageArea
            messages={chatMessages}
            conversationData={onSelectedConversation}
          />
        )}
      </div>
      <MessageInput
        customSticker={customSticker}
        onSendMessage={handleSendMessage}
        onTyping={handleTyping}
      />
    </>
  );
};

export default ChatContent;
