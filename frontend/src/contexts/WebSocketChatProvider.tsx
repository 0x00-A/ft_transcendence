import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import getWebSocketUrl from '@/utils/getWebSocketUrl';
import { useTyping } from './TypingContext';

interface MessageProps {
  id: number;
  conversation: number;
  sender: number;
  receiver: number;
  content: string;
  timestamp: string;
  seen: boolean;
}


interface WebSocketContextType {
  sendMessage: (userId: number, message: string) => void;
  sendTypingStatus: (userId: number, typing: boolean) => void;
  connectToSocket: (otherUserId: number) => void;
  messages: MessageProps[];
  lastMessage: {
    conversationId: number;
    content: string;
    timestamp: string;
  } | null;
}

const WebSocketContext = createContext<WebSocketContextType | null>(null);

export const useWebSocket = () => {
  const context = useContext(WebSocketContext);
  if (!context) {
    throw new Error('useWebSocket must be used within a WebSocketProvider');
  }
  return context;
};

interface WebSocketProviderProps {
  children: React.ReactNode;
  userId: number;
}

export const WebSocketChatProvider: React.FC<WebSocketProviderProps> = ({ children, userId }) => {
  const [messages, setMessages] = useState<MessageProps[]>([]);
  const [lastMessage, setLastMessage] = useState<{
    conversationId: number;
    content: string;
    timestamp: string;
  } | null>(null);
  const { setTyping } = useTyping();
  const socketsRef = useRef<{ [key: number]: WebSocket }>({});

  const getOrCreateSocket = (otherUserId: number) => {
    if (!socketsRef.current[otherUserId]) {
      const wsUrl = `${getWebSocketUrl(`chat/${otherUserId}/`)}`;
      const socket = new WebSocket(wsUrl);

      socket.onmessage = (event) => {
        console.log('WebSocket message received:', event.data);
        const data = JSON.parse(event.data);

        if (data.type === 'chat_message') {
          console.log('New message:', data.message);

          const newMessage: MessageProps = {
            id: Date.now(),
            conversation: 0,
            sender: data.sender_id,
            receiver: userId,
            content: data.message,
            timestamp: new Date().toISOString(),
            seen: false,
          };

          setMessages((prev) => [...prev, newMessage]);

          setLastMessage({
            conversationId: data.conversation_id,
            content: data.message,
            timestamp: new Date().toISOString(),
          });

        } else if (data.type === 'typing_status') {
          console.log('Typing status:', data);
          setTyping({ typing: data.typing, senderId: data.sender_id });

        } else if (data.type === 'mark_seen') {
          setMessages((prev) =>
            prev.map((msg) =>
              msg.sender === data.sender_id ? { ...msg, seen: true } : msg
            )
          );
        }
      };

      socket.onclose = () => {
        delete socketsRef.current[otherUserId];
      };

      socketsRef.current[otherUserId] = socket;
    }

    return socketsRef.current[otherUserId];
  };

  const connectToSocket = (otherUserId: number) => {
    getOrCreateSocket(otherUserId);
  };
  
  const sendMessage = (otherUserId: number, message: string) => {
    const socket = getOrCreateSocket(otherUserId);
    if (socket.readyState === WebSocket.OPEN) {
      socket.send(JSON.stringify({ action: 'send_message', message }));
    }
  };

  const sendTypingStatus = (otherUserId: number, typing: boolean) => {
    const socket = getOrCreateSocket(otherUserId);
    if (socket.readyState === WebSocket.OPEN) {
      socket.send(JSON.stringify({ action: 'typing', typing }));
    }
  };

  useEffect(() => {
    return () => {
      Object.values(socketsRef.current).forEach((socket) => {
        if (socket.readyState === WebSocket.OPEN) {
          socket.close();
        }
      });
    };
  }, []);

  return (
    <WebSocketContext.Provider value={{ sendMessage, sendTypingStatus, messages, connectToSocket, lastMessage }}>
      {children}
    </WebSocketContext.Provider>
  );
};
