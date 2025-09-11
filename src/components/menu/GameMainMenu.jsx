import { useState } from 'react';

const GameMainMenu = ({ onSelectAdventure, onSelectCollection }) => {
  return (
    <div className="max-w-4xl mx-auto p-6 bg-gradient-to-br from-blue-100 to-purple-100 min-h-screen flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-lg p-8 text-center max-w-2xl w-full">
        <h1 className="text-4xl font-bold text-gray-800 mb-8">博物馆奇遇</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Adventure Section */}
          <div 
            className="bg-blue-50 rounded-lg p-6 hover:bg-blue-100 transition-colors cursor-pointer"
            onClick={onSelectAdventure}
          >
            <h2 className="text-2xl font-bold text-blue-800 mb-4">冒险之旅</h2>
            <p className="text-gray-700">开启你的博物馆神秘探险，解开古老文物的秘密</p>
          </div>
          
          {/* Collection Section */}
          <div 
            className="bg-green-50 rounded-lg p-6 hover:bg-green-100 transition-colors cursor-pointer"
            onClick={onSelectCollection}
          >
            <h2 className="text-2xl font-bold text-green-800 mb-4">馆藏收集</h2>
            <p className="text-gray-700">查看你已收集的珍贵文物，了解它们背后的故事</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GameMainMenu;