import { IoMdNotificationsOutline } from 'react-icons/io';

import css from './Topbar.module.css';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { refreshToken } from '../../utils/getToken';
import getWebSocketUrl from '../../utils/getWebSocketUrl';

const Topbar = () => {

  const navigate = useNavigate();
  const [isOpenNotification, setOpenNotification] = useState(false);


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

  useEffect(() => {
    const wsUrl = `${getWebSocketUrl('notifications/')}`;
    const ws = new WebSocket(wsUrl);
    ws.onopen = () => {
      console.log('connected to websocket');
    };

    ws.onmessage = (event) => {
      console.log('message received', event.data);
    };

    ws.onclose = () => {
      console.log('websocket closed');
    };

    return () => {
      ws.close();
    };
  }, []);

  const handleClick = () => {
    setOpenNotification(!isOpenNotification);
  }

  return (
    <div className={css.topbar}>
      <button type={css.button} className={css.iconButton} onClick={handleClick}>
        <IoMdNotificationsOutline size={32} color="#F8F3E3"/>
        <span className={css.counter}>99</span>
        {isOpenNotification && <div className={css.notifications}>
          {/* <p className={css.notificationTitle}>Notifications</p> */}
          </div>
        }
      </button>
      <div className={css.userAccount}  onClick={() => navigate('/profile')}>
        <p className={css.userName}>Mad Max</p>
        <img className={css.userIcon} src="https://picsum.photos/200" alt="" />
      </div>
    </div>
  );
};

export default Topbar;
