import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import getWebSocketUrl from '@/utils/getWebSocketUrl';

// Define types for the message and typing status
interface MessageProps {
  id: number;
  conversation: number;
  sender: number;
  receiver: number;
  content: string;
  timestamp: string;
  seen: boolean;
}

interface TypingStatus {
  typing: boolean;
  senderId: number;
}

interface WebSocketContextType {
  sendMessage: (userId: number, message: string) => void;
  sendTypingStatus: (userId: number, typing: boolean) => void;
  messages: MessageProps[];
  typing: TypingStatus | null;
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
  const [typing, setTyping] = useState<TypingStatus | null>(null);
  const socketsRef = useRef<{ [key: number]: WebSocket }>({});

  // Function to get or create WebSocket connection
  const getOrCreateSocket = (otherUserId: number) => {
    if (!socketsRef.current[otherUserId]) {
      const wsUrl = `${getWebSocketUrl(`chat/${otherUserId}/`)}`;
      const socket = new WebSocket(wsUrl);

      // WebSocket message handler
      socket.onmessage = (event) => {
        console.log('WebSocket message received:', event.data);
        const data = JSON.parse(event.data);

        // Handle different message types
        if (data.type === 'chat_message') {
          console.log('New message:', data.message);

          // Create a new message and update the state
          const newMessage: MessageProps = {
            id: Date.now(),
            conversation: 0, // Assuming no active conversation, set appropriately
            sender: data.sender_id,
            receiver: userId,
            content: data.message,
            timestamp: new Date().toISOString(),
            seen: false,
          };

          // Add the new message to the existing messages
          setMessages((prev) => [...prev, newMessage]);

        } else if (data.type === 'typing_status') {
          console.log('Typing status:', data);
          // Update the typing status
          setTyping({ typing: data.typing, senderId: data.sender_id });

        } else if (data.type === 'mark_seen') {
          // Mark messages as seen
          setMessages((prev) =>
            prev.map((msg) =>
              msg.sender === data.sender_id ? { ...msg, seen: true } : msg
            )
          );
        }
      };

      // Handle WebSocket closure
      socket.onclose = () => {
        delete socketsRef.current[otherUserId];
      };

      socketsRef.current[otherUserId] = socket;
    }

    return socketsRef.current[otherUserId];
  };

  // Function to send a message
  const sendMessage = (otherUserId: number, message: string) => {
    const socket = getOrCreateSocket(otherUserId);
    if (socket.readyState === WebSocket.OPEN) {
      socket.send(JSON.stringify({ action: 'send_message', message }));
    }
  };

  // Function to send typing status
  const sendTypingStatus = (otherUserId: number, typing: boolean) => {
    const socket = getOrCreateSocket(otherUserId);
    if (socket.readyState === WebSocket.OPEN) {
      socket.send(JSON.stringify({ action: 'typing', typing }));
    }
  };

  // Cleanup WebSocket connections on unmount
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
    <WebSocketContext.Provider value={{ sendMessage, sendTypingStatus, messages, typing }}>
      {children}
    </WebSocketContext.Provider>
  );
};
