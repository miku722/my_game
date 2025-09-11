import React, { useState } from 'react';
import { Clock, Crown, Map, Shield, Star, History, Zap, BookOpen, Heart } from 'lucide-react';
import { useGameState } from '@hooks/useGameState';
import { collections } from '@data/collections';
import { locations } from '@data/locations';
import { villains } from '@data/villains';
import { player, updatePlayer } from '@data/player';
import StatusBar from './components/StatusBar';
import CurrentScene from './components/CurrentScene';
import AlliesList from './components/AlliesList';
import ActionHistory from './components/ActionHistory';
import ActionInput from './components/ActionInput';
import CollectionsInfo from './components/CollectionsInfo';
import Experiences from './components/Experiences';
import GameStat from './components/GameStat';
import StartScreen from '../components/StartScreen';
import LevelSelection from '../components/levels/LevelSelection';
import Level1Scene from '../components/levels/level1/Level1Scene';
import GameMainMenu from '../components/menu/GameMainMenu';
import CollectionPage from '../components/collection/CollectionPage';
import { processPlayerAction } from './components/ActionProcessor';

const MuseumPortalGame = () => {
  const { gameState, updateGameState, resetGame, recruitAlly } = useGameState();
  const [playerAction, setPlayerAction] = useState('');
  const [playerState, setPlayerState] = useState({
    mood: player.mood,
    inventory: [...player.inventory],
    health: player.health,
    san: player.san,
    stamina: player.stamina
  });
  const [actionHistory, setActionHistory] = useState([]);
  
  // 游戏状态：'start' | 'main_menu' | 'level_selection' | 'playing' | 'ending' | 'collection'
  const [gameStatePhase, setGameStatePhase] = useState('start');
  
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
  
  const handleSubmitAction = () => {
    if (playerAction.trim() && !gameState.isProcessing) {
      processPlayerAction(
        playerAction.trim(),
        gameState,
        playerState,
        updateGameState,
        setPlayerState,
        setActionHistory,
        recruitAlly
      );
      setPlayerAction('');
    }
  };

  // 游戏开始界面
  if (gameStatePhase === 'start') {
    return <StartScreen onStart={() => setGameStatePhase('main_menu')} />;
  }

  // 主菜单界面
  if (gameStatePhase === 'main_menu') {
    return (
      <GameMainMenu 
        onSelectAdventure={() => setGameStatePhase('level_selection')}
        onSelectCollection={() => setGameStatePhase('collection')}
      />
    );
  }

  // 馆藏收集界面
  if (gameStatePhase === 'collection') {
    return <CollectionPage onBack={() => setGameStatePhase('main_menu')} />;
  }
  
  // 关卡选择界面
  if (gameStatePhase === 'level_selection') {
    return <LevelSelection onStartLevel={(levelId) => {
      updateGameState({ currentLevel: levelId });
      setGameStatePhase('playing');
    }} />;
  }
  
  // 结局界面
  if (gameState.currentLocation === 'ending') {
    // 在结局界面时，更新游戏阶段
    if (gameStatePhase !== 'ending') {
      setGameStatePhase('ending');
    }
    
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
            <p className="text-gray-700 leading-relaxed">
              <strong>你的个人状态：</strong>
            </p>
            <div className="space-y-2 text-sm">
              <p>生命值: {playerState.health}/100</p>
              <p>SAN值: {playerState.san}/100</p>
              <p>体力值: {playerState.stamina}/50</p>
            </div>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="font-semibold text-blue-800 mb-2">📊 冒险统计</h3>
              <div className="space-y-2 text-sm">
                <p>最终心情: {getMoodText(playerState.mood)}</p>
                <p>当前心情: {playerState.mood}/5</p>
                <p>物品数量: {playerState.inventory.length + 2} 件</p>
                <p>物品清单: {playerState.inventory.join(', ')}</p>
                <p>招募伙伴: {gameState.companionsFound}/4</p>
                <p>成长经历: {gameState.experiences.length} 个</p>
                <p>危险等级: {getDangerText(gameState.dangerLevel)}</p>
              </div>
            </div>
            
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
              <h3 className="font-semibold text-purple-800 mb-2">👥 招募的伙伴</h3>
              <div className="space-y-1">
                {gameState.allies.map(ally => {
                  const char = collections[ally];
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
            onClick={() => {
              resetGame();
              setGameStatePhase('start');
            }}
            className="w-full bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors"
          >
            重新开始奇遇
          </button>
        </div>
      </div>
    );
  }

  // 如果当前有活动关卡，显示关卡内容
  if (gameState.currentLevel) {
    if (gameState.currentLevel === 1) {
      return <Level1Scene 
        onComplete={() => setGameStatePhase('ending')}
        gameState={gameState}
        updateGameState={updateGameState}
        playerState={playerState}
        setPlayerState={setPlayerState}
        setActionHistory={setActionHistory}
        recruitAlly={recruitAlly}
      />;
    }
    // 可以在这里添加更多关卡的条件
    // } else if (gameState.currentLevel === 2) {
    //   return <Level2Scene />;
    // }
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
        <StatusBar playerState={playerState} gameState={gameState} currentLocation={currentLocation} />
        
        {/* Current Scene */}
        <CurrentScene currentLocation={currentLocation} />
        
        {/* Current Allies */}
        <AlliesList gameState={gameState} collections={collections} />
        
        {/* Action History */}
        <ActionHistory actionHistory={actionHistory} />
        
        {/* Action Input */}
        <ActionInput 
          playerAction={playerAction} 
          setPlayerAction={setPlayerAction} 
          handleSubmitAction={handleSubmitAction}
          gameState={gameState} 
        />
        
        {/* Collection Info */}
        <CollectionsInfo collections={collections} villains={villains} />
        
        {/* Recent Experiences */}
        <Experiences gameState={gameState} />
      </div>
    </div>
  );
};

export default MuseumPortalGame;