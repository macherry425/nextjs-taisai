// contexts/GameContext.js
import React, { createContext, useState, useEffect } from 'react';
import ably from '../lib/ably';

export const GameContext = createContext();

export const GameProvider = ({ children }) => {
  const [gameState, setGameState] = useState({});

  useEffect(() => {
    const channel = ably.channels.get('sicbo');
    channel.subscribe('game-update', (message) => {
      setGameState(message.data);
    });

    return () => {
      channel.unsubscribe();
    };
  }, []);

  return (
    <GameContext.Provider value={{ gameState, setGameState }}>
      {children}
    </GameContext.Provider>
  );
};