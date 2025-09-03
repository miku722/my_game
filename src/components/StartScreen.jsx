import { useGameState } from '@hooks/useGameState';

const StartScreen = ({ onStart }) => {
  const { resetGame } = useGameState();
  
  const handleStartGame = () => {
    resetGame();
    // Notify parent component to change game phase
    if (onStart) {
      onStart();
    }
  };
  
  return (
    <div className="max-w-4xl mx-auto p-6 bg-gradient-to-br from-blue-100 to-purple-100 min-h-screen flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-lg p-8 text-center max-w-2xl w-full">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            🏛️ 博物馆时空穿越游戏
          </h1>
          <p className="text-lg text-gray-600 mb-6">
            与历史文物化身对话，体验跨越千年的奇幻冒险！
          </p>
        </div>
        
        <div className="bg-gray-50 rounded-lg p-6 mb-8 text-left">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">游戏简介</h2>
          <p className="text-gray-700 mb-4">
            作为一名夜班保安，你在博物馆中发现了一个神秘的时空之门。珍贵的文物开始复活，化身为有思想的生命。你需要通过对话说服他们回到现代，同时解开时空之门的秘密。
          </p>
          
          <h3 className="text-lg font-medium text-gray-800 mt-6 mb-3">玩法说明</h3>
          <ul className="text-gray-700 space-y-2">
            <li>• 与文物化身对话，了解他们的故事</li>
            <li>• 通过真诚沟通说服他们回到现代</li>
            <li>• 注意危险等级和自身状态</li>
            <li>• 收集伙伴，共同面对挑战</li>
          </ul>
        </div>
        
        <button 
          onClick={handleStartGame}
          className="bg-purple-600 text-white px-8 py-4 rounded-lg text-lg hover:bg-purple-700 transition-colors font-medium"
        >
          开始游戏
        </button>
        
        <p className="text-sm text-gray-500 mt-6">
          制作：博物馆奇遇团队
        </p>
      </div>
    </div>
  );
};

export default StartScreen;