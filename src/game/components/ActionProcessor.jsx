import { qwenAPI } from '@services/qwenAPI';
import { collections } from '@data/collections';
import { locations } from '@data/locations';

// Extract prompt generation logic from MuseumPortalGame
export const generatePrompt = (action, gameState, playerState, currentStepIndex, currentParagraphIndex, sceneDescriptionParagraphs) => {
  const currentLocation = locations[gameState.currentLocation];
  const availableCollections = Object.values(collections).filter(char => 
    gameState.currentLocation === 'portal_discovery' || gameState.allies.includes(char.name)
  );

  // 构建已发生的故事情节
  let pastStory = '';
  if (sceneDescriptionParagraphs && Array.isArray(sceneDescriptionParagraphs)) {
    for (let i = 0; i <= currentStepIndex; i++) {
      if (i < currentStepIndex) {
        // 完成的步骤，包含所有段落
        if (sceneDescriptionParagraphs[i] && Array.isArray(sceneDescriptionParagraphs[i])) {
          pastStory += sceneDescriptionParagraphs[i].join(' ') + '\n';
        }
      } else if (i === currentStepIndex) {
        // 当前步骤，只包含已完成的段落
        if (sceneDescriptionParagraphs[i] && Array.isArray(sceneDescriptionParagraphs[i])) {
          for (let j = 0; j <= currentParagraphIndex; j++) {
            if (sceneDescriptionParagraphs[i][j]) {
              pastStory += sceneDescriptionParagraphs[i][j] + '\n';
            }
          }
        }
      }
    }
  }

  // 获取即将要到来的故事情节（下一个步骤的第一个段落）
  let nextStepStory = '暂无后续剧情';
  if (sceneDescriptionParagraphs && 
      Array.isArray(sceneDescriptionParagraphs) && 
      currentStepIndex + 1 < sceneDescriptionParagraphs.length && 
      sceneDescriptionParagraphs[currentStepIndex + 1] && 
      Array.isArray(sceneDescriptionParagraphs[currentStepIndex + 1]) && 
      sceneDescriptionParagraphs[currentStepIndex + 1].length > 0) {
    nextStepStory = sceneDescriptionParagraphs[currentStepIndex + 1][0];
  }

  return `
  作为游戏主持人，请评估玩家是否有能力进行他描述的行动，不要告知玩家即将要到来的故事情节。背景：
  
  已发生的故事情节：
  ${pastStory}
  
  即将要到来的故事情节：
  ${nextStepStory}
  
  在场角色信息：
  ${availableCollections.map(char => `${char.name}（${char.origin}）：${char.personality}，${char.description}`).join('\n')}。
  
  玩家行动：${action}
  
  游戏规则：
  1. 最重要的：即将要到来的故事情节是绝对不能提前透露给玩家的。比如：还未发生的故事情节、未出现的角色、未获得的物品等
  2. 只能通过暗示和引导的方式让玩家探索未知
  3. 检查玩家的行动是否可以触发即将要到来的故事情节，可以的话feasible为true，否则为false
  4. 回复玩家的话发生在即将要到来的故事之前，确保你的回复可以和即将要到来的故事情节自然衔接，不要透露即将要到来的故事情节
  4. 回答应简洁，不要说过多的话
  5. 保持神秘感，激发玩家的好奇心
  6. 根据玩家行动自然推进剧情
  
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
  recruitAlly,
  currentStepIndex = 0,
  currentParagraphIndex = 0,
  sceneDescriptionParagraphs = []
) => {
  updateGameState({ isProcessing: true });
  
  try {
    const prompt = generatePrompt(action, gameState, playerState, currentStepIndex, currentParagraphIndex, sceneDescriptionParagraphs);
    const result = await qwenAPI.sendMessage(prompt);

    // // 更新游戏状态
    // if (result.feasible) {
    //   const updates = {
    //     isProcessing: false,
    //     playerMood: Math.max(1, Math.min(5, gameState.playerMood + (result.moodChange || 0))),
    //     dangerLevel: Math.max(1, Math.min(5, gameState.dangerLevel + (result.dangerChange || 0)))
    //   };

    //   if (result.experienceGained) {
    //     updates.experiences = [...gameState.experiences, result.experienceGained];
    //   }
    //   if (result.inventoryChange && result.inventoryChange.length > 0) {
    //     updates.inventory = [...gameState.inventory, ...result.inventoryChange];
    //     setPlayerState(prev => ({...prev, inventory: [...prev.inventory, ...result.inventoryChange]}));
    //   }

    //   updateGameState(updates);

    //   if (result.allyRecruited && !gameState.allies.includes(result.allyRecruited)) {
    //     recruitAlly(result.allyRecruited);
    //   }

    //   // 场景转换逻辑
    //   if (gameState.companionsFound >= 2 && gameState.currentLocation === 'portal_discovery') {
    //     const nextLocation = Math.random() > 0.5 ? 'ancient_court' : 'void_market';
    //     updateGameState({ currentLocation: nextLocation });
    //   }
    // } else {
    //   updateGameState({ isProcessing: false });
    // }
    
    // // 添加到历史记录
    // setActionHistory(prev => [...prev, {
    //   action: action,
    //   result: result.result,
    //   dialogue: result.collectionDialogue,
    //   feasible: result.feasible,
    //   suggestions: result.nextSuggestions || []
    // }]);

    return result;
    
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
  return 'ActionProcessr is error'
};