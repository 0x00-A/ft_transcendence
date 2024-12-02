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

  const { messages: websocketMessages, sendMessage, sendTypingStatus, markAsRead, updateActiveConversation} = useWebSocketChat();

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

  const memoizedChatMessages = useMemo(() => {
    if (!websocketMessages || websocketMessages.length === 0) {
      return fetchedMessages || [];
    }
  
    const lastMessage = websocketMessages[websocketMessages.length - 1];
    if (lastMessage?.conversation === selectedConversation?.id) {
      return [
        ...(fetchedMessages || []),
        ...websocketMessages,
      ];
    }
  
    return fetchedMessages || [];
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
            messages={memoizedChatMessages}
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
