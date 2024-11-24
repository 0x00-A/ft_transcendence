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
  sendMessage: (receiverId: number, message: string) => void;
  sendTypingStatus: (receiverId: number, typing: boolean) => void;
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
  const socketRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    const wsUrl = `${getWebSocketUrl(`chat/`)}`;
    const socket = new WebSocket(wsUrl);

    socket.onopen = () => {
      console.log('WebSocket connection opened');
    };

    socket.onmessage = (event) => {
      console.log('WebSocket message received:', event.data);
      const data = JSON.parse(event.data);

      if (data.type === 'chat_message') {
        const newMessage: MessageProps = {
          id: Date.now(),
          conversation: data.conversation_id,
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
        setTyping({ typing: data.typing, senderId: data.sender_id });

      } else if (data.type === 'messages_seen') {
        setMessages((prev) =>
          prev.map((msg) =>
            msg.sender === data.receiver_id ? { ...msg, seen: true } : msg
          )
        );
      }
    };

    socket.onclose = () => {
      console.log('WebSocket connection closed');
    };

    socket.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    socketRef.current = socket;

    return () => {
      socket.close();
    };
  }, []);

  const sendMessage = (receiverId: number, message: string) => {
    const socket = socketRef.current;
    if (socket && socket.readyState === WebSocket.OPEN) {
      socket.send(
        JSON.stringify({
          action: 'send_message',
          receiver_id: receiverId,
          message,
        })
      );
    }
  };

  const sendTypingStatus = (receiverId: number, typing: boolean) => {
    const socket = socketRef.current;
    if (socket && socket.readyState === WebSocket.OPEN) {
      socket.send(
        JSON.stringify({
          action: 'typing',
          receiver_id: receiverId,
          typing,
        })
      );
    }
  };

  return (
    <WebSocketContext.Provider value={{ sendMessage, sendTypingStatus, messages, lastMessage }}>
      {children}
    </WebSocketContext.Provider>
  );
};
