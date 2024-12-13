import { useCallback, useEffect, useMemo, useState } from 'react';
import css from './ChatContent.module.css';
import MessageArea from './MessageArea';
import MessageInput from './MessageInput';
import { useGetData } from '@/api/apiHooks';
import { useWebSocketChat } from '@/contexts/WebSocketChatProvider';
import { useSelectedConversation } from '@/contexts/SelectedConversationContext';
import ChatSkeleton from './ChatSkeleton';

interface MessageProps {
  id: number;
  conversation: number;
  sender: number;
  receiver: number;
  content: string;
  timestamp: string;
  seen?: boolean;
}

interface PaginatedMessagesResponse {
  results: MessageProps[];
  next: string | null; 
  previous: string | null; 
  count: number; 
}

const ChatContent = () => {
  const { selectedConversation } = useSelectedConversation();
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false); 
  const [websocketChatMessages, setWebsocketChatMessages] = useState<MessageProps[]>([]);
  const { messages: websocketMessages, sendMessage, sendTypingStatus, markAsRead, updateActiveConversation, clearMessages } = useWebSocketChat();
  const [fetchedChatMessages, setFetchedChatMessages] = useState<MessageProps[]>([]);
  const [reversedFetchedMessages, setReversedFetchedMessages] = useState<MessageProps[]>([]);

  const { data: fetchedMessages, isLoading, error } = useGetData<PaginatedMessagesResponse>(
    `chat/conversations/${selectedConversation?.id}/messages/?page=${page}`
  );

  useEffect(() => {
    if (!selectedConversation) return;
    console.log(" i here for clear ")
    clearMessages();
    setWebsocketChatMessages([]);
    if (page === 1) {
      setFetchedChatMessages(fetchedMessages?.results || []);
    } else if (fetchedMessages?.results) {
      setFetchedChatMessages((prevMessages) => [
        ...prevMessages,
        ...fetchedMessages?.results,
      ]);
    }
    setHasMore(!!fetchedMessages?.next);
  }, [selectedConversation, fetchedMessages]);
  
  
  useEffect(() => {
    if (!selectedConversation) return;
    
    console.log(" i here ")
    if (websocketMessages.length === 0) {
      console.log(" i here for set just fetched ")
      setReversedFetchedMessages([...fetchedChatMessages].reverse());
      return;
    }
    const lastMessageSocket = websocketMessages[websocketMessages.length - 1];
    if (lastMessageSocket?.conversation === selectedConversation.id) {
      setWebsocketChatMessages(websocketMessages);
    } else {
      setReversedFetchedMessages([...fetchedChatMessages].reverse());
    }
  }, [websocketMessages, selectedConversation]);
  
  useEffect(() => {
    if (selectedConversation?.id) {
      updateActiveConversation(selectedConversation.id);
      if (selectedConversation.unreadCount) {
        markAsRead(selectedConversation.id);
      }
    }
  }, [selectedConversation]);
  
  useEffect(() => {
    return () => {
      clearMessages();
    };
  }, []);
  
  const handleSendMessage = useCallback(
    (message: string) => {
      if (message.trim()) {
        sendMessage(selectedConversation!.user_id, message);
      }
    },
    [sendMessage, selectedConversation?.user_id]
  );
  
  const handleTyping = useCallback(
    (isTyping: boolean) => {
      sendTypingStatus(selectedConversation!.user_id, isTyping);
    },
    [sendTypingStatus, selectedConversation?.user_id]
  );
  
  const loadMoreMessages = () => {
    setPage((prevPage) => prevPage + 1);
  };
  
  // useEffect(() => {
    //   if (fetchedChatMessages.length > 0) {
      //     setReversedFetchedMessages([...fetchedChatMessages].reverse());
      //   }
      // }, [page, fetchedChatMessages]);
      
      const combinedMessages = useMemo(() => {
        
        console.log(" i here for set combinedMessages ")
        return [...reversedFetchedMessages, ...websocketChatMessages];
      }, [reversedFetchedMessages, websocketChatMessages]);

  return (
    <>
      <div className={css.messageArea}>
        {isLoading && page === 1 ? (
          <ChatSkeleton />
        ) : error ? (
          <div>Error loading messages</div>
        ) : (
          <MessageArea
            messages={combinedMessages}
            onLoadMore={loadMoreMessages}
            hasMore={hasMore}
        />

        )}
      </div>
      <MessageInput
        conversationData={selectedConversation}
        onSendMessage={handleSendMessage}
        onTyping={handleTyping}
      />
    </>
  );
};

export default ChatContent;
