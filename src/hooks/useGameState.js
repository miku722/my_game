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
  maxStamina: 100,
  // Level progression tracking
  levelProgress: { 1: false },
  // Level 1 flags
  level1_flags: {
    noticed_missing_artifacts: false,
    noticed_key_clue: false,
    found_first_key: false,
    portal_clue_acquired: false
  },
  // Current level
  currentLevel: null,
  // Current step in level
  currentStep: null,
  // Inventory system
  inventory: []
};

export const useGameState = () => {
  const [gameState, setGameState] = useState(initialGameState);

  const updateGameState = useCallback((updates) => {
    setGameState(prev => ({ ...prev, ...updates }));
  }, []);

  const startLevel = useCallback((levelId) => {
    setGameState(prev => ({
      ...prev,
      currentLevel: levelId,
      currentStep: 1
    }));
  }, []);

  const completeLevel = useCallback((levelId) => {
    setGameState(prev => {
      const newLevelProgress = { ...prev.levelProgress };
      newLevelProgress[levelId] = true;
      
      // Automatically unlock next level
      if (levelId < 5) {
        newLevelProgress[levelId + 1] = true;
      }
      
      return {
        ...prev,
        levelProgress: newLevelProgress
      };
    });
  }, []);

  const updateLevelFlag = useCallback((levelId, flagName, value) => {
    setGameState(prev => {
      const flagKey = `level${levelId}_flags`;
      const newFlags = {
        ...prev[flagKey],
        [flagName]: value
      };
      
      return {
        ...prev,
        [flagKey]: newFlags
      };
    });
  }, []);

  const addItemToInventory = useCallback((item) => {
    setGameState(prev => {
      if (!prev.inventory.includes(item)) {
        return {
          ...prev,
          inventory: [...prev.inventory, item]
        };
      }
      return prev;
    });
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
    recruitAlly,
    startLevel,
    completeLevel,
    updateLevelFlag,
    addItemToInventory
  };
};