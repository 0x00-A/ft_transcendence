import React, { useCallback, useEffect, useRef, useState } from 'react';
import css from './ChatContent.module.css';
import MessageArea from './MessageArea';
import MessageInput from './MessageInput';
import { useGetData } from '@/api/apiHooks';
import { useUser } from '@/contexts/UserContext';
import getWebSocketUrl from '@/utils/getWebSocketUrl';

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
  isBlocked: boolean;
  onUnblock: () => void;
  onSelectedConversation: ConversationProps;
}

const useWebSocket = (userId: number, otherUserId: number) => {
  const [messages, setMessages] = useState<MessageProps[]>([]);
  const socketRef = useRef<WebSocket | null>(null);

  console.log("Connecting to WebSocket with otherUserId:", otherUserId);
  const connect = useCallback(() => {
    const wsUrl = `${getWebSocketUrl(`chat/${otherUserId}/`)}`;
    const newSocket = new WebSocket(wsUrl);

    newSocket.onopen = () => {
      console.log('WebSocket connected for chat');
      socketRef.current = newSocket;
    };

    newSocket.onmessage = (event) => {
      const data = JSON.parse(event.data);
    
      const newMessage: MessageProps = {
        id: Date.now(),
        conversation: 0,
        sender: data.sender_id === userId ? userId : data.sender_id,
        receiver: data.sender_id === userId ? otherUserId : userId,
        content: data.message,
        timestamp: new Date().toISOString(),
      };
    
      setMessages((prev) => [...prev, newMessage]);
    };
    

    newSocket.onclose = () => {
      console.log('WebSocket closed, reconnecting...');
    };

    newSocket.onerror = (error) => {
      console.error('WebSocket error on chat:', error);
    };

    return newSocket;
  }, [userId, otherUserId]);

  useEffect(() => {
    const socket = connect();
    return () => socket.close();
  }, [connect]);

  const sendMessage = useCallback(
    (message: string) => {
      if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
        socketRef.current.send(JSON.stringify({ message }));
      }
    },
    []
  );

  return { messages, sendMessage };
};


const ChatContent: React.FC<ChatContentProps> = ({
  onSelectedConversation,
  customSticker,
  isBlocked,
  onUnblock,
}) => {
  const { user } = useUser();
  const [chatMessages, setChatMessages] = useState<MessageProps[]>([]);
  const { data: fetchedMessages, isLoading, error } = useGetData<MessageProps[]>(
    `chat/conversations/${onSelectedConversation?.id}/messages`
  );



  const isCurrentUserUser1 = user?.id === onSelectedConversation.user1_id;
  const otherUserId = isCurrentUserUser1 ? onSelectedConversation.user2_id : onSelectedConversation.user1_id;

  console.log(" otherUserId: ", onSelectedConversation.user2_id)
  const { messages: websocketMessages, sendMessage } = useWebSocket(
    user?.id ?? 0,
    otherUserId ?? 0,
  );

  useEffect(() => {
    setChatMessages(() => [
      ...(fetchedMessages || []),
      ...websocketMessages,
    ]);
  }, [fetchedMessages, websocketMessages]);
  console.log("chatMessages: ", chatMessages)

  const handleSendMessage = useCallback(
    (message: string) => {
      if (message.trim()) {
        sendMessage(message);
      }
    },
    [sendMessage, user?.id, onSelectedConversation.id]
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
        isBlocked={isBlocked}
        onUnblock={onUnblock}
        onSendMessage={handleSendMessage}
      />
    </>
  );
};

export default ChatContent;

