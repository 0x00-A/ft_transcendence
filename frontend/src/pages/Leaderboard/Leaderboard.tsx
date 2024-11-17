import { Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import css from './Leaderboard.module.css';
import { useEffect, useRef, useState } from 'react';
import { log } from 'console';
import { useWebSocket } from '@/contexts/WebSocketContext';

const Leaderboard = () => {
  const { isLoggedIn } = useAuth();
  const boxRef = useRef<HTMLDivElement | null>(null);
  // const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });

  // useEffect(() => {

  // function resizeBox() {

  //   if (boxRef.current) {
  //     const originalWidth = 1082;
  //     // const { width, height } = boxRef.current.getBoundingClientRect();
  //     const width = window.innerWidth;
  //     const height = window.innerHeight;

  //     console.log(width, height);

  //     const scaleWidth = width / 1082; // Compare window width to the box width
  //   const scaleHeight = height / 698; // Compare window height to the box height
  //   const scaleFactor = Math.min(scaleWidth, scaleHeight, 1.4); // Ensure it doesn't scale up
  //   // boxRef.current.style.transform = `scale(${scaleFactor - 0.2})`;
  //     console.log('in');
  //     const newWidth = originalWidth * scaleFactor;
  //     // boxRef.current.style.marginLeft = `-${(newWidth / 2) - 300}px`;
  //   }
  //   // const windowWidth = window.innerWidth;
  //   // const windowHeight = window.innerHeight;

  //   // Calculate scale factor based on the window size
  //   // const scaleWidth = windowWidth / 1082; // Compare window width to the box width
  //   // const scaleHeight = windowHeight / 698; // Compare window height to the box height

  //   // Use the smaller of the two scale values to maintain aspect ratio
  //   // const scaleFactor = Math.min(scaleWidth, scaleHeight, 1); // Ensure it doesn't scale up

  //   // Apply the scale transformation
  //   // if (boxRef.current)
  //   //   boxRef.current.style.transform = `scale(${scaleFactor})`;
  // }

  // // Call the function once to initialize
  // resizeBox();

  // // Add event listener to adjust scaling when the window is resized
  // window.addEventListener('resize', resizeBox);

  // return () => {
  //   window.removeEventListener('resize', resizeBox);

  // }
  // }, [])

  if (!isLoggedIn) {
    return <Navigate to="/signup" />;
  }
  return (
    <main ref={boxRef} className={css.container}>
      <p>Leaderboard</p>
      <button>send Invite</button>
    </main>
  );
};

export default Leaderboard;
