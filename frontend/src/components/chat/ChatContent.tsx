import React, { useCallback, useEffect, useRef, useState } from 'react';
import css from './ChatContent.module.css';
import MessageArea from './MessageArea';
import MessageInput from './MessageInput';
import { useGetData } from '@/api/apiHooks';
import { useUser } from '@/contexts/UserContext';
import getWebSocketUrl from '@/utils/getWebSocketUrl';
import { useTyping } from '@/contexts/TypingContext';

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
  const { setTyping } = useTyping();
  const socketRef = useRef<WebSocket | null>(null);

  const connect = useCallback(() => {

    if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
      console.log('WebSocket already connected.');
      return socketRef.current;
    }
    const wsUrl = `${getWebSocketUrl(`chat/${otherUserId}/`)}`;
    const newSocket = new WebSocket(wsUrl);

    newSocket.onopen = () => {
      console.log('WebSocket connected for chat');
      socketRef.current = newSocket;
    };

    newSocket.onmessage = (event) => {
      console.log('WebSocket message received:', event.data);
      const data = JSON.parse(event.data);
      if (data.type === 'chat_message') {
        console.log('data message:', data.message);
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
      } else if (data.type === 'typing_status') {
        console.log('typing_status:', data);
        setTyping({ typing: data.typing, senderId: data.sender_id });
      } else if (data.type === 'mark_seen') {
        setMessages((prev) =>
          prev.map((msg) =>
            msg.sender === otherUserId ? { ...msg, seen: true } : msg
          )
        );
      }
    };

    newSocket.onclose = () => {
      console.log('WebSocket closed');
    };

    newSocket.onerror = (error) => {
      console.error('WebSocket error on chat:', error);
    };

    return newSocket;
  }, [otherUserId]);

useEffect(() => {
  // setTimeout(() => {
  //   const socket = connect();
  //   return () => {
  //     if (socket.readyState === WebSocket.OPEN || socket.readyState === WebSocket.CONNECTING) {
  //       console.log('Closing WebSocket...');
  //       socket.close();
  //     }
  //   };
  // }, 10);
  const socket = connect();
  return () => {
    if (socket.readyState === WebSocket.OPEN || socket.readyState === WebSocket.CONNECTING) {
      console.log('Closing WebSocket...');
      socket.close();
    }
  };
}, [connect]);


  const sendMessage = useCallback(
    (message: string) => {
      console.log(">>>>>>>>>>>>>: ", message);
      if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
        socketRef.current.send(JSON.stringify({ action: 'send_message', message }));
      }
    },
    []
  );

  const sendTypingStatus = useCallback(
    (typing: boolean) => {
      if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
        socketRef.current.send(JSON.stringify({ action: 'typing', typing }));
      }
    },
    []
  );

  return { messages, sendMessage, sendTypingStatus };
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
  const otherUserId = isCurrentUserUser1
    ? onSelectedConversation.user2_id
    : onSelectedConversation.user1_id;

  const { messages: websocketMessages, sendMessage, sendTypingStatus } = useWebSocket(
    user?.id ?? 0,
    otherUserId ?? 0,
  );

  useEffect(() => {
    setChatMessages(() => [
      ...(fetchedMessages || []),
      ...websocketMessages,
    ]);
  }, [fetchedMessages, websocketMessages]);

  const handleSendMessage = useCallback(
    (message: string) => {
      if (message.trim()) {
        sendMessage(message);
      }
    },
    [sendMessage]
  );

  const handleTyping = useCallback(
    (isTyping: boolean) => {
      sendTypingStatus(isTyping);
    },
    [sendTypingStatus]
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
        onTyping={handleTyping}
      />
    </>
  );
};

export default ChatContent;
