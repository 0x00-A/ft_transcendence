import React, { useCallback, useEffect, useMemo, useState } from 'react';
import css from './ChatContent.module.css';
import MessageArea from './MessageArea';
import MessageInput from './MessageInput';
import { useGetData } from '@/api/apiHooks';
import { useWebSocketChat } from '@/contexts/WebSocketChatProvider';
import { useSelectedConversation } from '@/contexts/SelectedConversationContext';
import { MessageProps } from '@/types/apiTypes';

interface ChatContentProps {
  customSticker: string;
}

const ChatContent: React.FC<ChatContentProps> = ({ customSticker }) => {
  const { selectedConversation } = useSelectedConversation();
  const { data: fetchedMessages, isLoading, error } = useGetData<MessageProps[]>(
    `chat/conversations/${selectedConversation?.id}/messages`
  );
  const [chatMessages, setChatMessages] = useState<MessageProps[]>([]);

  const { messages: websocketMessages, sendMessage, sendTypingStatus, markAsRead, updateActiveConversation, clearMessages} = useWebSocketChat();
  

  useEffect(() => {
    console.log('Clearing messages');
    clearMessages();

    return ()=>{
      clearMessages();
    }
  }, []);

  useEffect(() => {
    if (selectedConversation?.id) {
      updateActiveConversation(selectedConversation.id);
    }
  }, [selectedConversation?.id]);

  useEffect(() => {
    if (selectedConversation?.id && selectedConversation.unreadCount) {
      markAsRead(selectedConversation.id);
    }
  }, [selectedConversation?.id]);
        
  useEffect(() => {
    if (!websocketMessages || websocketMessages.length === 0) {
      setChatMessages(fetchedMessages || []);
      return;
    }
    
    const lastMessageSocket = websocketMessages[websocketMessages.length - 1];
    // const lastMessageFetch = fetchedMessages![fetchedMessages.length - 1];
    
    // if (lastMessageSocket.content === lastMessageFetch.content) {
    //   setChatMessages(fetchedMessages || []);
    //   return;
    // }
    if (lastMessageSocket?.conversation === selectedConversation?.id) {
      setChatMessages([...(fetchedMessages || []), ...websocketMessages]);
    } else {
      setChatMessages(fetchedMessages || []);
    }
  }, [fetchedMessages, websocketMessages, selectedConversation?.id]);
  
  const handleSendMessage = useCallback(
    (message: string) => {
      if (message.trim()) {
        sendMessage(selectedConversation!.user_id, message);
      }
    },
    [sendMessage, selectedConversation!.user_id]
  );

    const handleTyping = useCallback(
      (isTyping: boolean) => {
        sendTypingStatus(selectedConversation!.user_id, isTyping);
      },
      [sendTypingStatus, selectedConversation!.user_id]
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
          />
          )}
      </div>
      <MessageInput
        conversationData={selectedConversation}
        customSticker={customSticker}
        onSendMessage={handleSendMessage}
        onTyping={handleTyping}
      />
    </>
  );
};

export default ChatContent;
