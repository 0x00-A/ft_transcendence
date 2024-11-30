import React, { useCallback, useEffect, useState } from 'react';
import css from './ChatContent.module.css';
import MessageArea from './MessageArea';
import MessageInput from './MessageInput';
import { useGetData } from '@/api/apiHooks';
import { useWebSocket } from '@/contexts/WebSocketChatProvider';
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


interface ChatContentProps {
  customSticker: string;
}

const ChatContent: React.FC<ChatContentProps> = ({ customSticker }) => {
  const { selectedConversation } = useSelectedConversation();
  const [chatMessages, setChatMessages] = useState<MessageProps[]>([]);
  const { data: fetchedMessages, isLoading, error } = useGetData<MessageProps[]>(
    `chat/conversations/${selectedConversation?.id}/messages`
  );

  const { messages: websocketMessages, sendMessage, sendTypingStatus, markAsRead, updateActiveConversation} = useWebSocket();


  console.log("-------render ChatContent--------------")
  console.log("onSelectedConversation: ", selectedConversation)
  
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
    const lastMessage = websocketMessages[websocketMessages.length - 1];
    if (lastMessage?.conversation === selectedConversation?.id) {
      console.log("+++++++++++++++++++++++++++++++")
      console.log("websocketMessages: ", websocketMessages)
      console.log("fetchedMessages: ", fetchedMessages)
      console.log("+++++++++++++++++++++++++++++++")
      setChatMessages(() => [
        ...(fetchedMessages || []),
        ...websocketMessages,
      ]);
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
