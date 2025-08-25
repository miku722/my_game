import React from 'react';
import { Send } from 'lucide-react';

const ActionInput = ({ playerAction, setPlayerAction, handleSubmitAction, gameState }) => {
  return (
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
  );
};

export default ActionInput;