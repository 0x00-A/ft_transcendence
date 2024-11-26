import React, { useCallback, useEffect, useRef, useState } from 'react';
import css from './ChatContent.module.css';
import MessageArea from './MessageArea';
import MessageInput from './MessageInput';
import { useGetData } from '@/api/apiHooks';
import { useWebSocket } from '@/contexts/WebSocketChatProvider';
import { conversationProps } from '@/types/apiTypes';

interface MessageProps {
  id: number;
  conversation: number;
  sender: number;
  receiver: number;
  content: string;
  timestamp: string;
  seen?: boolean;
}


interface ChatContentProps {
  customSticker: string;
  onSelectedConversation: conversationProps;
}

const ChatContent: React.FC<ChatContentProps> = ({
  onSelectedConversation,
  customSticker,
}) => {
  const [chatMessages, setChatMessages] = useState<MessageProps[]>([]);
  const { data: fetchedMessages, isLoading, error } = useGetData<MessageProps[]>(
    `chat/conversations/${onSelectedConversation?.id}/messages`
  );

  const { messages: websocketMessages, sendMessage, sendTypingStatus, markAsRead, updateActiveConversation } = useWebSocket();

  useEffect(() => {
    if (onSelectedConversation?.id) {
      updateActiveConversation(onSelectedConversation.id);
    }
  }, [onSelectedConversation?.id]);
  
  useEffect(() => {
    if (onSelectedConversation?.id) {
      markAsRead(onSelectedConversation.id);
    }
  }, [onSelectedConversation?.id]);
  
  useEffect(() => {
    console.log("-------------websocketMessages---", websocketMessages);
    console.log("-------------onSelectedConversation---id:", onSelectedConversation?.id);
  
    // Handle undefined or empty websocketMessages
    if (!websocketMessages || websocketMessages.length === 0) {
      console.log("No WebSocket messages or websocketMessages is undefined.");
      setChatMessages(fetchedMessages || []);
      return;
    }
  
    const lastMessage = websocketMessages[websocketMessages.length - 1];
    console.log("Last WebSocket Message:", lastMessage);
  
    if (lastMessage?.conversation === onSelectedConversation?.id) {
      console.log("Matching conversation found, updating chat messages.");
      setChatMessages(() => [
        ...(fetchedMessages || []),
        ...websocketMessages,
      ]);
    } else {
      console.log("No matching conversation. Using fetchedMessages only.");
      setChatMessages(fetchedMessages || []);
    }
  }, [fetchedMessages, websocketMessages, onSelectedConversation?.id]);
  

  // useEffect(() => {
  //   setChatMessages(() => [
  //     ...(fetchedMessages || []),
  //     ...websocketMessages,
  //   ]);
  // }, [fetchedMessages, websocketMessages]);

  
  const handleSendMessage = useCallback(
    (message: string) => {
      if (message.trim()) {
        sendMessage(onSelectedConversation.user_id, message); 
      }
    },
    [sendMessage, onSelectedConversation.user_id]
  );
  
    const handleTyping = useCallback(
      (isTyping: boolean) => {
        sendTypingStatus(onSelectedConversation.user_id, isTyping); 
      },
      [sendTypingStatus, onSelectedConversation.user_id]
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

