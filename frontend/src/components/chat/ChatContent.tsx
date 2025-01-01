import { useCallback, useEffect, useMemo, useState } from 'react';
import css from './ChatContent.module.css';
import MessageArea from './MessageArea';
import MessageInput from './MessageInput';
import { useWebSocketChat } from '@/contexts/WebSocketChatProvider';
import { useSelectedConversation } from '@/contexts/SelectedConversationContext';
import ChatSkeleton from './ChatSkeleton';
import { apiGetConversationMessages } from '@/api/chatApi';
import { OctagonAlert } from 'lucide-react';

interface MessageProps {
  id: number;
  conversation: number;
  sender: number;
  receiver: number;
  content: string;
  timestamp: string;
  seen?: boolean;
}

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
        console.log("fetching goood >>>>>>>");
      } catch (error) {
        setError('Failed to load messages. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchMessages();
  }, [page]);


  useEffect(() => {
    if (!selectedConversation) return;

    if (websocketMessages.length === 0) {
      setReversedFetchedMessages([...fetchedChatMessages].reverse());
    } else {
      const filteredMessages = websocketMessages.filter(
        (message) => message.conversation === selectedConversation.id
      );

      if (filteredMessages.length > 0) {
        setWebsocketChatMessages(filteredMessages);
      } else {
        setReversedFetchedMessages([...fetchedChatMessages].reverse());
      }
    }
  }, [websocketMessages, selectedConversation, fetchedChatMessages]);


  useEffect(() => {
    if (selectedConversation?.id) {
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
    return [...reversedFetchedMessages, ...websocketChatMessages];
  }, [reversedFetchedMessages, websocketChatMessages]);

  return (
    <>
      <div className={css.messageArea}>
        {isLoading && page === 1 ? (
          <ChatSkeleton />
        ) : error ? (
          <OctagonAlert />
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
