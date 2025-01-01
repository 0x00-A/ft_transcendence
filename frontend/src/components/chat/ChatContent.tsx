import { useCallback, useEffect, useMemo, useState } from 'react';
import css from './ChatContent.module.css';
import MessageArea from './MessageArea';
import MessageInput from './MessageInput';
import { useWebSocketChat } from '@/contexts/WebSocketChatProvider';
import { useSelectedConversation } from '@/contexts/SelectedConversationContext';
import ChatSkeleton from './ChatSkeleton';
import { apiGetConversationMessages } from '@/api/chatApi';

interface MessageProps {
  id: number;
  conversation: number;
  sender: number;
  receiver: number;
  content: string;
  timestamp: string;
  seen?: boolean;
}

// interface PaginatedMessagesResponse {
//   results: MessageProps[];
//   next: string | null;
//   previous: string | null;
//   count: number;
// }

const ChatContent = () => {
  const { selectedConversation } = useSelectedConversation();
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [websocketChatMessages, setWebsocketChatMessages] = useState<MessageProps[]>([]);
  const { messages: websocketMessages, sendMessage, sendTypingStatus, markAsRead, updateActiveConversation, clearMessages } = useWebSocketChat();
  const [fetchedChatMessages, setFetchedChatMessages] = useState<MessageProps[]>([]);
  const [reversedFetchedMessages, setReversedFetchedMessages] = useState<MessageProps[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);



  useEffect(() => {
    if (!selectedConversation) return;
    clearMessages();
    setWebsocketChatMessages([]);

    const fetchMessages = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const data = await apiGetConversationMessages(selectedConversation.id, page);
        if (data) {
          if (page === 1) {
            setFetchedChatMessages(data.results || []);
          } else {
            setFetchedChatMessages((prevMessages) => [
              ...prevMessages,
              ...data.results,
            ]);
          }
          setHasMore(!!data.next);
        }
        // console.log("fetching goood >>>>>>>");
      } catch (error) {
        console.error('Error fetching messages:', error);
        setError('Failed to load messages. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchMessages();
  }, [selectedConversation, page]);


  useEffect(() => {
    if (!selectedConversation) return;

    // console.log("websocket: ", websocketMessages);
    // console.log("Checking WebSocket messages for selectedConversation:", selectedConversation?.id);
    if (websocketMessages.length === 0) {
      // console.log("No websocket messages, using fetched messages");
      setReversedFetchedMessages([...fetchedChatMessages].reverse());
    } else {
      const filteredMessages = websocketMessages.filter(
        (message) => message.conversation === selectedConversation.id
      );
      // console.log("Filtered WebSocket messages:", filteredMessages);

      if (filteredMessages.length > 0) {
        setWebsocketChatMessages(filteredMessages);
      } else {
        // console.log("No messages found for selected conversation, using reversed fetched messages");
        setReversedFetchedMessages([...fetchedChatMessages].reverse());
      }
    }
  }, [websocketMessages, selectedConversation, fetchedChatMessages]);


  useEffect(() => {
    if (selectedConversation?.id) {
      // console.log("avtive ***********");
      updateActiveConversation(selectedConversation.id);
      if (selectedConversation.unreadCount) {
        markAsRead(selectedConversation.id);
      }
    }
  }, []);

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

  const combinedMessages = useMemo(() => {

    // console.log(" i here for set combinedMessages ")

    return [...reversedFetchedMessages, ...websocketChatMessages];
  }, [reversedFetchedMessages, websocketChatMessages]);
  // console.log(" combinedMessages: ", combinedMessages);

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
