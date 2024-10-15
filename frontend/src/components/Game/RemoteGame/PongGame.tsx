import React from 'react';
import { useParams } from 'react-router-dom';
import LocalGame from '../LocalGame/LocalGame';
import RemoteGame from './RemoteGame';

const PongGame = () => {
  const { mode, gameId } = useParams(); // Retrieve mode and gameId from the URL

  // Use mode and gameId in your game logic
  console.log('Game Mode:', mode);
  console.log('Current Game ID:', gameId);

  // Handle game logic based on the mode
  if (mode === '0') {
    // Local game logic
    return (
      <div>
        <h1>Local Pong Game - ID: {gameId}</h1>
        <LocalGame />
      </div>
    );
  } else if (mode === '1') {
    // Remote game logic
    return (
      <div>
        <h1>Remote Pong Game - ID: {gameId}</h1>
        <RemoteGame></RemoteGame>
      </div>
    );
  }

  return <div>Invalid Game Mode</div>;
};

export default PongGame;
