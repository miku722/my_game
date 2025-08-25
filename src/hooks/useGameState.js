import { useState, useCallback } from 'react';
import { collections } from '@data/collections';

const initialGameState = {
  currentLocation: 'museum',
  playerMood: 3,
  companionsFound: 0,
  totalCompanions: 4,
  currentStory: 0,
  playerName: '小张',
  experiences: [],
  inventory: [],
  allies: [],
  timeRemaining: 300,
  isProcessing: false,
  dangerLevel: 1,
  health: 100,
  maxHealth: 100,
  sanity: 100,
  maxSanity: 100,
  stamina: 100,
  maxStamina: 100
};

export const useGameState = () => {
  const [gameState, setGameState] = useState(initialGameState);

  const updateGameState = useCallback((updates) => {
    setGameState(prev => ({ ...prev, ...updates }));
  }, []);

  const resetGame = useCallback(() => {
    setGameState(initialGameState);
    // 重置角色状态
    Object.values(collections).forEach(char => {
      char.recruited = false;
    });
  }, []);

  const recruitAlly = useCallback((allyName) => {
    setGameState(prev => {
      if (prev.allies.includes(allyName)) return prev;
      
      const newState = {
        ...prev,
        allies: [...prev.allies, allyName],
        companionsFound: prev.companionsFound + 1
      };

      // 标记角色为已招募
      if (collections[allyName]) {
        collections[allyName].recruited = true;
      }

      // 检查是否完成游戏
      if (newState.companionsFound >= 4) {
        newState.currentLocation = 'ending';
      }

      return newState;
    });
  }, []);

  return {
    gameState,
    updateGameState,
    resetGame,
    recruitAlly
  };
};