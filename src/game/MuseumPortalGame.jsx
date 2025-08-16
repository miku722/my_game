import React, { useState } from 'react';
import { Clock, Map, Heart, Star, ArrowRight, History, Send, Shield, Zap, BookOpen, Crown, Eye } from 'lucide-react';
import { useGameState } from '@hooks/useGameState';
import { qwenAPI } from '@services/qwenAPI';
import { characters } from '@data/characters';
import { locations } from '@data/locations';
import { villains } from '@data/villains';

const MuseumPortalGame = () => {
  const { gameState, updateGameState, resetGame, recruitAlly } = useGameState();
  const [playerAction, setPlayerAction] = useState('');
  const [actionHistory, setActionHistory] = useState([]);

  const processPlayerAction = async (action) => {
    updateGameState({ isProcessing: true });
    
    const currentLocation = locations[gameState.currentLocation];
    const availableCharacters = Object.values(characters).filter(char => 
      gameState.currentLocation === 'portal_discovery' || gameState.allies.includes(char.name)
    );
    
    const prompt = `
你是一个博物馆时空冒险游戏的AI游戏主持人。玩家是年轻的夜班保安小张，要与文物化身对话将他们带回现代。

当前游戏状态：
- 位置：${currentLocation.name}
- 场景描述：${currentLocation.description}
- 场景背景：${currentLocation.context}
- 危险等级：${gameState.dangerLevel}/5
- 玩家心情：${gameState.playerMood}/5 (1=沮丧，5=开心)
- 已招募伙伴：${gameState.allies.length}/4
- 当前伙伴：${gameState.allies.join(', ') || '无'}
- 玩家物品：${gameState.inventory.join(', ') || '手电筒、对讲机'}

在场角色信息：
${availableCharacters.map(char => `${char.name}（${char.origin}）：${char.personality}，${char.description}`).join('\n')}

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
  "characterDialogue": "相关角色的对话回应",
  "nextSuggestions": ["建议1", "建议2", "建议3"]
}
`;

    try {
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
        dialogue: result.characterDialogue,
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
    
    setPlayerAction('');
  };

  const handleSubmitAction = () => {
    if (playerAction.trim() && !gameState.isProcessing) {
      processPlayerAction(playerAction.trim());
    }
  };

  const getMoodText = (mood) => {
    const moods = ['😰 恐惧', '😟 紧张', '😐 冷静', '😊 自信', '😄 兴奋'];
    return moods[mood - 1] || '😊 开心';
  };

  const getMoodColor = (mood) => {
    const colors = ['text-red-500', 'text-orange-500', 'text-yellow-500', 'text-blue-500', 'text-green-500'];
    return colors[mood - 1] || 'text-green-500';
  };

  const getDangerText = (danger) => {
    const levels = ['🟢 安全', '🟡 警戒', '🟠 危险', '🔴 高危', '💀 致命'];
    return levels[danger - 1] || '🟢 安全';
  };

  const getDangerColor = (danger) => {
    const colors = ['text-green-500', 'text-yellow-500', 'text-orange-500', 'text-red-500', 'text-purple-500'];
    return colors[danger - 1] || 'text-green-500';
  };

  // 结局界面
  if (gameState.currentLocation === 'ending') {
    return (
      <div className="max-w-4xl mx-auto p-6 bg-gradient-to-br from-purple-100 to-blue-100 min-h-screen">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="text-center mb-6">
            <Crown className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
            <h1 className="text-3xl font-bold text-gray-800 mb-4">博物馆奇遇：时空之门</h1>
            <h2 className="text-xl text-gray-600">圆满结局</h2>
          </div>
          
          <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4 text-green-800">🎉 使命达成！</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              恭喜你！通过耐心的对话和真诚的沟通，你成功说服了所有{gameState.totalCompanions}位文物化身回到现代。
              更重要的是，你学会了理解和尊重每一段历史，每一个生命背后的故事。
            </p>
            <p className="text-gray-700 leading-relaxed">
              作为一名普通的夜班保安，你用自己的善良和智慧化解了一场时空危机。
              博物馆重新恢复了平静，但你的内心已经发生了翻天覆地的变化。
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="font-semibold text-blue-800 mb-2">📊 冒险统计</h3>
              <div className="space-y-2 text-sm">
                <p>最终心情: {getMoodText(gameState.playerMood)}</p>
                <p>招募伙伴: {gameState.companionsFound}/4</p>
                <p>成长经历: {gameState.experiences.length} 个</p>
                <p>危险等级: {getDangerText(gameState.dangerLevel)}</p>
              </div>
            </div>
            
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
              <h3 className="font-semibold text-purple-800 mb-2">👥 招募的伙伴</h3>
              <div className="space-y-1">
                {gameState.allies.map(ally => {
                  const char = characters[ally];
                  return char ? (
                    <p key={ally} className="text-sm text-purple-600">
                      {char.icon} {char.name}（{char.origin}）
                    </p>
                  ) : null;
                })}
              </div>
            </div>
          </div>
          
          <button 
            onClick={resetGame}
            className="w-full bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors"
          >
            重新开始奇遇
          </button>
        </div>
      </div>
    );
  }

  const currentLocation = locations[gameState.currentLocation];

  return (
    <div className="max-w-4xl mx-auto p-6 bg-gradient-to-br from-blue-100 to-purple-100 min-h-screen">
      <div className="bg-white rounded-lg shadow-lg p-8">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="flex items-center justify-center mb-4">
            <Clock className="w-8 h-8 text-blue-600 mr-2" />
            <h1 className="text-2xl font-bold text-gray-800">博物馆奇遇：时空之门</h1>
          </div>
          <p className="text-gray-600">与文物化身对话，说服他们回到现代</p>
        </div>

        {/* Status Bar */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
          <div className="text-center">
            <Heart className={`w-6 h-6 mx-auto mb-2 ${getMoodColor(gameState.playerMood)}`} />
            <p className="text-sm font-medium">心情</p>
            <p className={`text-xs ${getMoodColor(gameState.playerMood)}`}>
              {getMoodText(gameState.playerMood)}
            </p>
          </div>
          <div className="text-center">
            <Map className="w-6 h-6 text-purple-600 mx-auto mb-2" />
            <p className="text-sm font-medium">位置</p>
            <p className="text-xs text-purple-600">{currentLocation.name}</p>
          </div>
          <div className="text-center">
            <Shield className={`w-6 h-6 mx-auto mb-2 ${getDangerColor(gameState.dangerLevel)}`} />
            <p className="text-sm font-medium">危险</p>
            <p className={`text-xs ${getDangerColor(gameState.dangerLevel)}`}>
              {getDangerText(gameState.dangerLevel)}
            </p>
          </div>
          <div className="text-center">
            <Star className="w-6 h-6 text-green-600 mx-auto mb-2" />
            <p className="text-sm font-medium">伙伴</p>
            <p className="text-xs text-green-600">{gameState.companionsFound}/4</p>
          </div>
          <div className="text-center">
            <History className="w-6 h-6 text-orange-600 mx-auto mb-2" />
            <p className="text-sm font-medium">物品</p>
            <p className="text-xs text-orange-600">{gameState.inventory.length + 2}</p>
          </div>
        </div>

        {/* Current Scene */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">
            📍 {currentLocation.name}
          </h2>
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
            <p className="text-gray-700 leading-relaxed">
              {currentLocation.description}
            </p>
            <div className="mt-3 pt-3 border-t border-amber-300">
              <p className="text-sm text-amber-800">
                <strong>场景信息：</strong>{currentLocation.context}
              </p>
            </div>
          </div>
        </div>

        {/* Current Allies */}
        {gameState.allies.length > 0 && (
          <div className="mb-6">
            <h3 className="text-lg font-medium text-gray-800 mb-3">👥 当前伙伴</h3>
            <div className="flex flex-wrap gap-2">
              {gameState.allies.map(ally => {
                const char = characters[ally];
                return char ? (
                  <div key={ally} className="bg-green-100 border border-green-300 rounded-lg p-2 text-sm">
                    <span className="text-lg mr-1">{char.icon}</span>
                    <span className="font-medium">{char.name}</span>
                    <span className="text-gray-600 ml-1">({char.ability})</span>
                  </div>
                ) : null;
              })}
            </div>
          </div>
        )}

        {/* Action History */}
        {actionHistory.length > 0 && (
          <div className="mb-6 max-h-60 overflow-y-auto">
            <h3 className="text-lg font-medium text-gray-800 mb-3">📜 互动记录</h3>
            {actionHistory.slice(-2).map((entry, index) => (
              <div key={index} className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm text-blue-800 font-medium">你的行动：{entry.action}</p>
                <p className="text-sm text-gray-700 mt-1">{entry.result}</p>
                {entry.dialogue && (
                  <div className="mt-2 p-2 bg-white rounded border-l-4 border-blue-400">
                    <p className="text-sm text-blue-600 italic">💬 "{entry.dialogue}"</p>
                  </div>
                )}
                {entry.suggestions && entry.suggestions.length > 0 && (
                  <div className="mt-2">
                    <p className="text-xs text-gray-500">建议行动：</p>
                    <ul className="text-xs text-gray-600 ml-2">
                      {entry.suggestions.map((suggestion, i) => (
                        <li key={i}>• {suggestion}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Action Input */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-gray-800">💬 你想要做什么或说什么？</h3>
          <div className="space-y-3">
            <textarea
              value={playerAction}
              onChange={(e) => setPlayerAction(e.target.value)}
              placeholder="描述你的行动或对话，比如：我走向翠娘，温和地说：'您好，我是这里的保安小张。我知道您可能对现代世界感到困惑，但我希望能帮助您...'"
              className="w-full p-3 border border-gray-300 rounded-lg resize-none h-24 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              disabled={gameState.isProcessing}
            />
            <button
              onClick={handleSubmitAction}
              disabled={!playerAction.trim() || gameState.isProcessing}
              className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
            >
              {gameState.isProcessing ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  AI正在处理你的行动...
                </div>
              ) : (
                <div className="flex items-center">
                  <Send className="w-5 h-5 mr-2" />
                  执行行动
                </div>
              )}
            </button>
          </div>
        </div>

        {/* Character Info */}
        <div className="mt-6 grid md:grid-cols-2 gap-4">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="font-semibold text-blue-800 mb-2">📚 文物伙伴</h3>
            <div className="space-y-2">
              {Object.values(characters).map(char => (
                <div key={char.name} className={`text-sm ${char.recruited ? 'text-green-600' : 'text-gray-600'}`}>
                  <span className="text-lg mr-1">{char.icon}</span>
                  <strong>{char.name}</strong>({char.origin})
                  {char.recruited && <span className="ml-2 text-green-500">✓已招募</span>}
                </div>
              ))}
            </div>
          </div>
          
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <h3 className="font-semibold text-red-800 mb-2">⚠️ 危险角色</h3>
            <div className="space-y-2">
              {Object.values(villains).map(villain => (
                <div key={villain.name} className="text-sm text-red-600">
                  <span className="text-lg mr-1">{villain.icon}</span>
                  <strong>{villain.name}</strong>({villain.origin})
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Experiences */}
        {gameState.experiences.length > 0 && (
          <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
            <h3 className="font-semibold text-green-800 mb-2">✨ 最近的感悟</h3>
            <div className="space-y-1">
              {gameState.experiences.slice(-3).map((exp, index) => (
                <p key={index} className="text-sm text-green-700">• {exp}</p>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MuseumPortalGame;