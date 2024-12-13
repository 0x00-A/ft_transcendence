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
  const [chatMessages, setChatMessages] = useState<MessageProps[]>([]);
  const [websocketChatMessages, setWebsocketChatMessages] = useState<MessageProps[]>([]);
  const { messages: websocketMessages, sendMessage, sendTypingStatus, markAsRead, updateActiveConversation, clearMessages } = useWebSocketChat();
  const [fetchedChatMessages, setFetchedChatMessages] = useState<MessageProps[]>([]);

  const { data: fetchedMessages, isLoading, error } = useGetData<PaginatedMessagesResponse>(
    `chat/conversations/${selectedConversation?.id}/messages/?page=${page}`
  );

  useEffect(() => {
    if (!selectedConversation) return;
    
    clearMessages();
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

    if (websocketMessages.length === 0) {
      setChatMessages(fetchedChatMessages || []);
      return;
    }

    const lastMessageSocket = websocketMessages[websocketMessages.length - 1];
    if (lastMessageSocket?.conversation === selectedConversation.id) {
      setChatMessages([...(fetchedChatMessages || []), ...websocketMessages]);
      setWebsocketChatMessages(websocketMessages);
    } else {
      setChatMessages(fetchedChatMessages || []);
    }
  }, [fetchedChatMessages, websocketMessages, selectedConversation]);

  // useEffect(() => {
  //   if (!selectedConversation) return;

  //   const lastMessageSocket = websocketMessages[websocketMessages.length - 1];
  //   if (lastMessageSocket?.conversation === selectedConversation.id) {
  //     setWebsocketChatMessages(websocketMessages);
  //   }
  // }, [websocketMessages, selectedConversation]);

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

  const reversedFetchedMessages = useMemo(() => {
    console.log("**/*/*/*/*/*/*")
    return [...chatMessages].reverse();
  }, [chatMessages]);
  
  const combinedMessages = useMemo(() => {
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
          <>
            {hasMore && (
              <button className={css.loadMoreButton} onClick={loadMoreMessages}>
                Show More
              </button>
            )}
            <MessageArea messages={combinedMessages} />
          </>
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
