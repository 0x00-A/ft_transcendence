import { IoMdNotificationsOutline } from 'react-icons/io';

import css from './Topbar.module.css';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import getWebSocketUrl from '../../utils/getWebSocketUrl';
import { useWebSocket } from '@/contexts/WebSocketContext';
import NotificationsDropdown from './NotificationsDropdown';

const NotificationDropdown = () => {
  const { notifications, markAsRead } = useWebSocket();

  return (
    <div className="absolute bg-white shadow-lg rounded-lg w-80">
      {notifications.length === 0 ? (
        <p className="p-4 text-red-500">No notifications</p>
      ) : (
        <ul>
          {notifications.map((notification, index) => (
            <li
              key={index}
              className={`p-4 border-b ${
                notification.is_read ? "bg-gray-100" : "bg-white"
              }`}
              // onClick={() => markAsRead(notification.id)}
            >
              <h3 className="font-semibold">{notification.title}</h3>
              <p className='text-red-500'>{notification.message}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

const Topbar = () => {

  const navigate = useNavigate();
  const [isOpenNotification, setOpenNotification] = useState(false);

  const {unreadCount, fetchNotifications, markAllAsRead} = useWebSocket()


  //   useEffect(() => {
  //   (async () => {
  //       const token = await getToken();
  //       if (!token) {
  //         console.log(`No valid token: ${token}`);
  //         return;
  //       }
  //       const wsUrl = `${getWebSocketUrl('online-status/')}?token=${token}`;
  //       const socket = new WebSocket(wsUrl);
  //       onlineSocketRef.current = socket;
  //   })()

  //   return () => {
  //       if (onlineSocketRef.current) {
  //           onlineSocketRef.current.close();
  //       }
  //   };
  // }, [])

  // useEffect(() => {
  //   const wsUrl = `${getWebSocketUrl('notifications/')}`;
  //   const ws = new WebSocket(wsUrl);
  //   ws.onopen = () => {
  //     console.log('connected to websocket');
  //   };

  //   ws.onmessage = (event) => {
  //     console.log('message received', event.data);
  //     ws.send(JSON.stringify({'message': 'hello message recieved!' }));
  //   };

  //   ws.onclose = () => {
  //     console.log('websocket closed');
  //   };

  //   return () => {
  //     ws.close();
  //   };
  // }, []);





  return (
    <div className={css.topbar}>
      <NotificationsDropdown />
      <div className={css.userAccount}  onClick={() => navigate('/profile')}>
        <p className={css.userName}>Mad Max</p>
        <img className={css.userIcon} src="https://picsum.photos/200" alt="" />
      </div>
    </div>
  );
};

export default Topbar;
