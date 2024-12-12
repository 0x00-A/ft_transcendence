import { useCallback, useEffect, useState } from 'react';
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

const ChatContent = () => {
  const { selectedConversation } = useSelectedConversation();
  const [page, setPage] = useState(1); // For pagination
  const [hasMore, setHasMore] = useState(true);
  const { data: fetchedMessages, isLoading, error } = useGetData<MessageProps[]>(
    `chat/conversations/${selectedConversation?.id}/messages?page=${page}`
  );
  const [chatMessages, setChatMessages] = useState<MessageProps[]>([]);
  const { messages: websocketMessages, sendMessage, sendTypingStatus, markAsRead, updateActiveConversation, clearMessages } = useWebSocketChat();
  const [fetchedChatMessages, setFetchedChatMessages] = useState<MessageProps[]>([]);

  console.log("rander chat content")

    useEffect(() => {
      if (!fetchedMessages) return;
  
      if (fetchedMessages.length === 0) {
        setHasMore(false); 
      } else {
        setChatMessages((prevMessages) => [...fetchedMessages, ...prevMessages]);
      }
    }, [fetchedMessages]);
  
    useEffect(() => {
      if (!selectedConversation) return;
  
      clearMessages();
      setChatMessages([]);
      setPage(1);
      setHasMore(true); 
    }, [selectedConversation]);
  
    useEffect(() => {
      if (!selectedConversation) return;
  
      if (websocketMessages.length === 0) return;
  
      const lastMessageSocket = websocketMessages[websocketMessages.length - 1];
      if (lastMessageSocket?.conversation === selectedConversation.id) {
        setChatMessages((prevMessages) => [...prevMessages, ...websocketMessages]);
      }
    }, [websocketMessages, selectedConversation]);

  
  // useEffect(() => {
  //   if (!selectedConversation) return;
  //   clearMessages()
  //   setFetchedChatMessages(fetchedMessages || []);
  // }, [selectedConversation, fetchedMessages]);
  
  // useEffect(() => {
  //   if (!selectedConversation) return;

  //   if (websocketMessages.length === 0) {
  //     setChatMessages(fetchedChatMessages || []);
  //     return;
  //   }

  //   const lastMessageSocket = websocketMessages[websocketMessages.length - 1];
  //   if (lastMessageSocket?.conversation === selectedConversation.id) {
  //     setChatMessages([...(fetchedChatMessages || []), ...websocketMessages]);
  //   } else {
  //     setChatMessages(fetchedChatMessages || []);
  //   }
  // }, [fetchedChatMessages, websocketMessages, selectedConversation]);

  useEffect(() => {
    if (selectedConversation?.id) {
      console.log("updateActiveConversation..")
      updateActiveConversation(selectedConversation.id);
      if (selectedConversation.unreadCount) {
        console.log("/* yes i here */")
        console.log(selectedConversation.id)
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
            <MessageArea messages={chatMessages} />
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
