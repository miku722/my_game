import { useGameState } from '@hooks/useGameState';

const LevelSelection = ({ onStartLevel }) => {
  const { gameState } = useGameState();
  
  // Level data structure
  const levels = [
    {
      id: 1,
      title: '馆内启程',
      description: '带领玩家认识世界观，获取第一条线索',
      image: '/images/level1.jpg', // Placeholder for now
      locked: false,
      completed: false
    },
    {
      id: 2,
      title: '时空之门',
      description: '穿越时空，与文物化身对话',
      image: '/images/level2.jpg', // Placeholder for now
      locked: true,
      completed: false
    },
    {
      id: 3,
      title: '古代宫廷',
      description: '探索明代宫廷的神秘幻境',
      image: '/images/level3.jpg', // Placeholder for now
      locked: true,
      completed: false
    },
    {
      id: 4,
      title: '虚空集市',
      description: '在时空夹缝中的奇异集市探险',
      image: '/images/level4.jpg', // Placeholder for now
      locked: true,
      completed: false
    },
    {
      id: 5,
      title: '最终对决',
      description: '面对最终挑战，解开所有谜团',
      image: '/images/level5.jpg', // Placeholder for now
      locked: true,
      completed: false
    }
  ];
  
  // Check unlock conditions based on game state
  const getLevelStatus = (levelId) => {
    if (levelId === 1) return { locked: false, completed: false };
    
    // For now, just check if previous level is completed
    // This will be enhanced later based on actual game state
    const prevLevelCompleted = gameState.levelProgress && gameState.levelProgress[levelId - 1];
    return {
      locked: !prevLevelCompleted,
      completed: gameState.levelProgress && gameState.levelProgress[levelId]
    };
  };
  
  // Update level statuses based on current game state
  const updatedLevels = levels.map(level => ({
    ...level,
    ...getLevelStatus(level.id)
  }));
  
  return (
    <div className="max-w-4xl mx-auto p-6 bg-gradient-to-br from-blue-100 to-purple-100 min-h-screen flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-lg p-8 text-center max-w-2xl w-full">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">关卡选择</h1>
          <p className="text-lg text-gray-600">选择你的冒险旅程</p>
        </div>
        
        <div className="space-y-6">
        {updatedLevels.map((level, index) => (
          <div 
            key={level.id}
            className={`bg-white rounded-lg shadow-lg overflow-hidden transition-all duration-300 ${
              level.locked ? 'opacity-60 cursor-not-allowed' : 'hover:shadow-xl hover:scale-105 cursor-pointer'
            }`}
            onClick={() => !level.locked && onStartLevel(level.id)}
          >
            <div className="flex">
              <div className="w-40 h-40 bg-gray-300 flex items-center justify-center flex-shrink-0">
                {level.image ? (
                  <img 
                    src={level.image} 
                    alt={level.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="text-gray-500">关卡图片</div>
                )}
              </div>
              
              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-xl font-bold text-gray-800 mb-2">{level.title}</h3>
                  <p className="text-gray-600 mb-4">{level.description}</p>
                </div>
                
                <div className="flex items-center justify-between">
                  {level.locked ? (
                    <span className="bg-gray-200 text-gray-600 px-3 py-1 rounded-full text-sm font-medium">
                      锁定
                    </span>
                  ) : (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onStartLevel(level.id);
                      }}
                      className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                    >
                      开始
                    </button>
                  )}
                  
                  {level.completed && (
                    <span className="text-green-600">
                      ✓
                    </span>
                  )}
                </div>
              </div>
            </div>
            
            {index < updatedLevels.length - 1 && (
              <div className="border-t border-gray-200 my-2"></div>
            )}
          </div>
        ))}
      </div>
    </div>
  </div>
  );
};

export default LevelSelection;