import React from 'react';
import { Map, Shield, Zap, BookOpen, Star, Heart, History } from 'lucide-react';

const StatusBar = ({ playerState, gameState, currentLocation }) => {
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

  return (
    <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
      <div className="text-center">
        <Heart className={`w-6 h-6 mx-auto mb-2 ${getMoodColor(playerState.mood)}`} />
        <p className="text-sm font-medium">心情</p>
        <p className={`text-xs ${getMoodColor(playerState.mood)}`}> 
          {getMoodText(playerState.mood)}
        </p>
        <p className={`text-xs ${getMoodColor(playerState.mood).replace('text-', 'bg-').replace(' mx-auto mb-2', '')} h-2 w-2 flex-shrink-0`}>
          &nbsp;
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
        <Zap className="w-6 h-6 text-red-600 mx-auto mb-2" />
        <p className="text-sm font-medium">生命</p>
        <p className="text-xs text-red-600">{playerState.health}/100</p>
      </div>
      <div className="text-center">
        <BookOpen className="w-6 h-6 text-blue-600 mx-auto mb-2" />
        <p className="text-sm font-medium">理智</p>
        <p className="text-xs text-blue-600">{playerState.san}/100</p>
      </div>
      <div className="text-center">
        <Star className="w-6 h-6 text-green-600 mx-auto mb-2" />
        <p className="text-sm font-medium">体力</p>
        <p className="text-xs text-green-600">{playerState.stamina}/100</p>
      </div>
    </div>
  );
};

export default StatusBar;