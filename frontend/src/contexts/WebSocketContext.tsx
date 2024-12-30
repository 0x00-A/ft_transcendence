// WebSocketContext.tsx
import GameInviteCard from '@/components/Game/components/GameInviteCard/GameInviteCard';
import getWebSocketUrl from '@/utils/getWebSocketUrl';
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
} from 'react';
import { toast } from 'react-toastify';
import { useGameInvite } from './GameInviteContext';
import apiClient from '@/api/apiClient';
import { useAuth } from './AuthContext';
import { useUser } from '@/contexts/UserContext';
import FriendRequestCard from '@/components/Friends/FriendRequestCard';
import {
  apiAcceptFriendRequest,
  apiRejectFriendRequest,
} from '@/api/friendApi';
import { useTranslation } from 'react-i18next';
// import { WebSocketContextType, Notification } from './types';

// types.ts
export type MessageType =
  | 'game_invite'
  | 'error'
  | 'friend_request'
  | 'status_update';

export interface Notification {
  id: number;
  title: string;
  link: string;
  state: string;
  message: string;
  is_read: boolean;
  created_at: Date;
  user: string;
}

export interface WebSocketContextType {
  notifications: Notification[];
  sendMessage: (message: Record<string, any>) => void;
  fetchNotifications: () => Promise<void>;
  markAsRead: (notificationId: number) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  deleteAllNotifications: () => Promise<void>;
  unreadCount: number;
}

const WebSocketContext = createContext<WebSocketContextType | undefined>(
  undefined
);

export const WebSocketProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const ws = useRef<WebSocket | null>(null);

  const { isLoggedIn } = useAuth();
  const { t } = useTranslation();

  const fetchNotifications = async () => {
    try {
      const { data } = await apiClient.get('/notifications/');
      setNotifications(data);
      console.log('notification data: ', data);
      setUnreadCount(data.filter((n: Notification) => !n.is_read).length);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  const markAsRead = async (notificationId: number) => {
    try {
      await apiClient.patch(`/notifications/${notificationId}/mark-read/`);
      setNotifications((prev) =>
        prev.map((n) => (n.id === notificationId ? { ...n, is_read: true } : n))
      );
      setUnreadCount((prev) => prev - 1);
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const markAllAsRead = async () => {
    try {
      await apiClient.patch('/notifications/mark-all-read/');
      setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
      setUnreadCount(0);
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
    }
  };

  const deleteAllNotifications = async () => {
    try {
      await apiClient.delete('/notifications/delete-all/');
      setNotifications([]);
      setUnreadCount(0);
    } catch (error) {
      console.error('Error deleting all notifications:', error);
    }
  };

  const { acceptInvite } = useGameInvite();

  const showFriendRequestToast = (from: string) => {
    toast(
      <FriendRequestCard
        from={from}
        onAccept={() => handleAcceptRequest(from)}
        onReject={() => handleRejectRequest(from)}
      />,
      {
        toastId: from,
        autoClose: 10000,
        closeOnClick: false,
        closeButton: true,
        style: {
          padding: '0',
          margin: '0',
        },
      }
    );
  };

  const handleAcceptRequest = async (from: string) => {
    try {
      await apiAcceptFriendRequest(from);
      toast.dismiss(from);
    } catch (error) {
      toast.error(t('errorsFriends.request'));
    }
  };

  const handleRejectRequest = async (from: string) => {
    try {
      await apiRejectFriendRequest(from);
      toast.dismiss(from);
    } catch (error) {
      toast.error(t('errorsFriends.reject'));
    }
  };

  const showGameInviteToast = (from: string) => {
    toast(
      <GameInviteCard
        from={from}
        onAccept={() => handleAcceptInvite(from)}
        onReject={() => handleRejectInvite(from)}
      />,
      {
        toastId: from,
        autoClose: 10000,
        closeOnClick: false,
        closeButton: false,
        style: {
          padding: '0',
          margin: '0',
        },
      }
    );
  };

  const handleAcceptInvite = (from: string) => {
    console.log(`Accepted invite from ${from}`);
    sendMessage({
      event: 'invite_accept',
      from: from,
    });
    toast.dismiss();
  };

  const handleRejectInvite = (from: string) => {
    console.log(`Rejected invite from ${from}`);
    sendMessage({
      event: 'invite_reject',
      from: from,
    });
    toast.dismiss(from);
  };

  // console.log(user);
  useEffect(() => {
    if (!isLoggedIn) return;
    ws.current = new WebSocket(`${getWebSocketUrl('notifications/')}`);

    ws.current.onopen = () => {
      console.log('Notification WebSocket connected');
    };

    ws.current.onmessage = (event) => {
      const data = JSON.parse(event.data);

      console.log(data);

      if (data.event === 'friend_request_accepted') {
        toast.success(`${data.from} ${t('toast.requestAccepted')}`);
      }
      if (data.event === 'new_message') {
        toast(`${data.from} ${t('toast.newMessage')}`);
      }
      if (data.event === 'friend_request' || data.event === 'status_update') {
        showFriendRequestToast(data.from);
      }
      if (data.event === 'notification') {
        console.log('dataNotification: ', data);
        handleIncomingNotification(data.data);
      }

      if (data.event === 'game_invite') {
        // toast.info(data.message)
        showGameInviteToast(data.from);
      }
      if (data.event === 'error') {
        toast.error(data.message);
      }
      if (data.event === 'invite_reject') {
        toast.info(t(`${data.message}`));
      }
      if (data.event === 'game_address') {
        toast.info(t(`${data.message}`));
        acceptInvite(data.game_address, data.p1_id, data.p2_id);
      }
    };

    ws.current.onclose = () => {};

    return () => {
      ws.current?.close();
    };
  }, [isLoggedIn]);

  const handleIncomingNotification = (data: Notification) => {
    // const newNotification: Notification = {
    //   type: data.type,
    //   from: data.from,
    //   content: data.content || '',
    //   timestamp: new Date(),
    // };
    setNotifications((prev) => [data, ...prev]);
    setUnreadCount((prev) => prev + 1);
  };

  const sendMessage = (message: Record<string, any>) => {
    if (ws.current && ws.current.readyState === WebSocket.OPEN) {
      ws.current.send(JSON.stringify(message));
    } else {
      console.error("WebSocket is not open. Can't send message:", message);
    }
  };

  return (
    <WebSocketContext.Provider
      value={{
        notifications,
        sendMessage,
        fetchNotifications,
        markAllAsRead,
        markAsRead,
        deleteAllNotifications,
        unreadCount,
      }}
    >
      {children}
    </WebSocketContext.Provider>
  );
};

export const useWebSocket = (): WebSocketContextType => {
  const context = useContext(WebSocketContext);
  if (context === undefined) {
    throw new Error('useWebSocket must be used within a WebSocketProvider');
  }
  return context;
};
