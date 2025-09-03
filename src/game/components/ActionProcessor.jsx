import { qwenAPI } from '@services/qwenAPI';
import { collections } from '@data/collections';
import { locations } from '@data/locations';

// Extract prompt generation logic from MuseumPortalGame
export const generatePrompt = (action, gameState, playerState) => {
  const currentLocation = locations[gameState.currentLocation];
  const availableCollections = Object.values(collections).filter(char => 
    gameState.currentLocation === 'portal_discovery' || gameState.allies.includes(char.name)
  );
  
  return `
你是一个博物馆时空冒险游戏的AI游戏主持人。玩家是年轻的夜班保安小张，要与文物化身对话将他们带回现代。

当前游戏状态：
- 位置：${currentLocation.name}
- 场景描述：${currentLocation.description}
- 场景背景：${currentLocation.context}
- 危险等级：${gameState.dangerLevel}/5
- 玩家心情：${playerState.mood}/5 (1=沮丧，5=开心)
- 已招募伙伴：${gameState.allies.length}/4
- 当前伙伴：${gameState.allies.join(', ') || '无'}
- 玩家物品：${playerState.inventory.join(', ') || '手电筒、对讲机'}

在场角色信息：
${availableCollections.map(char => `${char.name}（${char.origin}）：${char.personality}，${char.description}`).join('\n')}

玩家行动：${action}

游戏规则：
1. 这些文物化身有自己的想法和情感，需要通过对话说服
2. 每个角色都有独特的性格，要用不同方式应对
3. 危险等级影响行动成功率
4. 反派角色需要特殊方式处理

请分析行动结果，用JSON格式回复，只输出JSON：
{
  "feasible": true/false,
  "result": "详细描述行动结果，包括角色对话和反应",
  "moodChange": -2到+2之间的整数,
  "experienceGained": "玩家获得的感悟或成长",
  "inventoryChange": ["新物品"] 或 [],
  "allyRecruited": "角色名字" 或 null,
  "dangerChange": -1到+1之间的整数,
  "collectionDialogue": "相关角色的对话回应",
  "nextSuggestions": ["建议1", "建议2", "建议3"]
}
`;
};

// Process player action using the prompt and update game state
export const processPlayerAction = async (
  action,
  gameState,
  playerState,
  updateGameState,
  setPlayerState,
  setActionHistory,
  recruitAlly
) => {
  updateGameState({ isProcessing: true });
  
  try {
    const prompt = generatePrompt(action, gameState, playerState);
    const result = await qwenAPI.sendMessage(prompt);

    // 更新游戏状态
    if (result.feasible) {
      const updates = {
        isProcessing: false,
        playerMood: Math.max(1, Math.min(5, gameState.playerMood + (result.moodChange || 0))),
        dangerLevel: Math.max(1, Math.min(5, gameState.dangerLevel + (result.dangerChange || 0)))
      };

      if (result.experienceGained) {
        updates.experiences = [...gameState.experiences, result.experienceGained];
      }
      if (result.inventoryChange && result.inventoryChange.length > 0) {
        updates.inventory = [...gameState.inventory, ...result.inventoryChange];
        setPlayerState(prev => ({...prev, inventory: [...prev.inventory, ...result.inventoryChange]}));
      }

      updateGameState(updates);

      if (result.allyRecruited && !gameState.allies.includes(result.allyRecruited)) {
        recruitAlly(result.allyRecruited);
      }

      // 场景转换逻辑
      if (gameState.companionsFound >= 2 && gameState.currentLocation === 'portal_discovery') {
        const nextLocation = Math.random() > 0.5 ? 'ancient_court' : 'void_market';
        updateGameState({ currentLocation: nextLocation });
      }
    } else {
      updateGameState({ isProcessing: false });
    }
    
    // 添加到历史记录
    setActionHistory(prev => [...prev, {
      action: action,
      result: result.result,
      dialogue: result.collectionDialogue,
      feasible: result.feasible,
      suggestions: result.nextSuggestions || []
    }]);
    
  } catch (error) {
    console.error("处理行动时出错:", error);
    setActionHistory(prev => [...prev, {
      action: action,
      result: "抱歉，在处理你的行动时出现了问题。请尝试重新表达你的行动。",
      feasible: false,
      suggestions: ["重新描述你的行动", "尝试与某个角色对话", "观察周围环境"]
    }]);
    updateGameState({ isProcessing: false });
  }
  
  return '';
};