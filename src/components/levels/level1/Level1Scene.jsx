import { useState, useEffect } from 'react';
import { useGameState } from '@hooks/useGameState';
import ActionInput from '@game_components/ActionInput';

const Level1Scene = () => {
  const { gameState, updateGameState, updateLevelFlag, addItemToInventory, completeLevel } = useGameState();
  const [currentText, setCurrentText] = useState('');
  const [showContinuePrompt, setShowContinuePrompt] = useState(false);
  const [sceneStep, setSceneStep] = useState(1);
  const [isTyping, setIsTyping] = useState(true);
  const [playerAction, setPlayerAction] = useState('');
  
  // Level 1 scene descriptions split into paragraphs
  const sceneDescriptionParagraphs = [
    [
      // Step 1 paragraphs
      "清晨的博物馆空无一人，窗外的晨光透过高大的落地窗洒在石质地面上，映出一条条拉长的影子。空气里弥漫着一种微妙的紧张感——你一踏入展厅，就察觉到异常。几个展柜的文物不翼而飞，原本静静陈列的青铜器、玉器和古籍，如今只剩下空荡荡的玻璃柜和微微发光的底座。",
      "你深吸一口气，感受到肩头的责任：身为博物馆管理员，这些珍贵的历史遗产安全与否，直接与你的职业荣誉与使命紧密相连。每一件失踪的文物，都是历史的碎片，而你必须找到它们，揭开这场异常背后的谜团。",
      "脚步轻轻踏在光滑的地砖上，回声在空旷的展厅里回荡。你环顾四周，注意到每个展柜旁都留有微微的灰尘痕迹，仿佛文物刚刚离开时的痕迹；空气里带着一丝奇异的凉意，让人不寒而栗。"
    ],
    [
      // Step 2 paragraphs
      "突然，你的目光被中央展厅角落的一抹微光吸引。那里，一件小巧的青铜钥匙静静躺在石台上，闪烁着柔和的魔法光芒。你下意识地伸手去拾起，掌心触碰到冰凉的金属，瞬间一股奇异的力量沿着手臂涌入全身，仿佛空气都在为你颤动。",
      "一道低沉而悠远的声音在心底回响，带着魔法的共鸣：\"守护者……尘封已久的力量在呼唤你，未解的秘密正在等待勇者开启。\"",
      "你的心跳骤然加快，思绪翻涌——不仅是为了文物的安全，更为了揭开这场魔法般的谜团。你感到整个展厅似乎开始轻微回应你的存在，一条不可见的力量在指引着你前行。你知道，这只是冒险的开端，而真正的奇迹与谜团，正潜伏在展厅深处，等待你的探索。"
    ],
    [
      // Step 4 paragraphs
      "你紧握手中的青铜钥匙，掌心传来的微光让你感到一种神秘力量在流动。展厅的灯光微微闪烁，空气中弥漫着淡淡的魔法香气和古老灰尘的味道。",
      "角落的阴影中，一条平时难以察觉的通道缓缓浮现，石壁上的古老符文闪烁着幽蓝色光芒，仿佛在低声吟唱，指引你前行。",
      "微风从通道深处吹来，卷起地面上落下的灰尘，带着低沉的回响。你感到胸口的悸动与紧张交织，意识到真正的冒险旅程即将开始。"
    ]
  ];
  
  // Current paragraph index within the current step
  const [paragraphIndex, setParagraphIndex] = useState(0);

  // Typewriter effect for scene descriptions
  useEffect(() => {
    if (sceneStep > 0 && sceneStep <= 3) {
      const paragraphs = sceneDescriptionParagraphs[sceneStep - 1];
      const currentParagraph = paragraphs[paragraphIndex];
      
      let index = 0;
      setIsTyping(true);
      setCurrentText('');
      
      const typeWriter = setInterval(() => {
        if (index < currentParagraph.length) {
          setCurrentText(currentParagraph.slice(0, index + 1));
          index++;
        } else {
          clearInterval(typeWriter);
          setIsTyping(false);
          setShowContinuePrompt(true);
        }
      }, 100);
      
      return () => clearInterval(typeWriter);
    }
  }, [sceneStep, paragraphIndex]);
  
  // Handle clicking to continue to next paragraph or scene
  const handleContinue = () => {
    if (isTyping) return;
    
    setShowContinuePrompt(false);
    
    const paragraphs = sceneDescriptionParagraphs[sceneStep - 1];
    
    // If there are more paragraphs in current step, go to next paragraph
    if (paragraphIndex < paragraphs.length - 1) {
      setParagraphIndex(paragraphIndex + 1);
    } else {
      // If this is the last paragraph, move to next step
      if (sceneStep === 1) {
        // Set flags for Step 1 completion
        updateLevelFlag(1, 'noticed_missing_artifacts', true);
        updateLevelFlag(1, 'noticed_key_clue', true);
      } else if (sceneStep === 2) {
        // Set flag for Step 2 completion and add key to inventory
        updateLevelFlag(1, 'found_first_key', true);
        addItemToInventory('金色钥匙');
      } else if (sceneStep === 3) {
        // Set flag for Step 4 completion
        updateLevelFlag(1, 'portal_clue_acquired', true);
      }

      if (sceneStep < 3) {
        setSceneStep(sceneStep + 1);
        setParagraphIndex(0); // Reset paragraph index for new step
      } else {
        // After final scene, allow player actions
        updateGameState({ currentStep: 'action' });
      }
    }
  };
  
  // Process player action
  const processPlayerAction = (action) => {
    // Define valid actions for each step
    const validActions = {
      1: ['检查失踪展柜', '察看周边环境', '搜寻安全监控记录'],
      2: ['拾起钥匙', '检查钥匙是否与文物出逃相关', '尝试在展厅寻找钥匙可能触发的机关'],
      3: ['探索通道', '检查通道周边环境', '准备角色属性']
    };
    
    const currentStep = sceneStep;
    const normalizedAction = action.trim();
    
    // Check if action is valid for current step
    const isValidAction = validActions[currentStep]?.some(
      validAction => normalizedAction.includes(validAction) || validAction.includes(normalizedAction)
    );
    
    if (isValidAction) {
      // Action is valid, progress story
      if (currentStep === 1 && normalizedAction.includes('检查失踪展柜')) {
        updateLevelFlag(1, 'noticed_missing_artifacts', true);
      }
      
      // Move to next step after valid action
      if (currentStep < 3) {
        setSceneStep(currentStep + 1);
      } else {
        // Check if all conditions for level completion are met
        const { level1_flags } = gameState;
        if (level1_flags.noticed_missing_artifacts && 
            level1_flags.noticed_key_clue && 
            level1_flags.found_first_key && 
            level1_flags.portal_clue_acquired) {
          completeLevel(1);
          updateGameState({ currentLocation: 'portal_discovery' });
        }
      }
    } else {
      // Invalid action, provide feedback but don't progress
      alert('这个动作在这里可能不太合适，试试其他行动？');
    }
    
    setPlayerAction('');
  };
  
  const handleSubmitAction = () => {
    if (playerAction.trim()) {
      processPlayerAction(playerAction.trim());
    }
  };
  
  return (
    <div className="max-w-4xl mx-auto p-6 bg-gradient-to-br from-blue-100 to-purple-100 min-h-screen">
      <div className="bg-white rounded-lg shadow-lg p-8">
        {/* Scene Content */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">馆内启程</h2>
          
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-6 mb-6 min-h-40">
            <p className="text-gray-700 leading-relaxed whitespace-pre-line">
              {currentText}
            </p>
            
            {showContinuePrompt && !isTyping && (
              <div 
                className="mt-4 p-4 bg-blue-100 border border-blue-300 rounded-lg text-center cursor-pointer hover:bg-blue-200"
                onClick={handleContinue}
              >
                点击空白处继续
              </div>
            )}
          </div>
        </div>
        
        {/* Action Input - only show after scene descriptions are complete */}
        {gameState.currentStep === 'action' && (
          <ActionInput 
            playerAction={playerAction} 
            setPlayerAction={setPlayerAction} 
            handleSubmitAction={handleSubmitAction}
            gameState={{ isProcessing: false }} 
          />
        )}
        
        {/* Back to Level Selection Button */}
        <div className="mt-8 text-center">
          <button
            onClick={() => {
              updateGameState({ 
                currentLevel: null 
              });
              // The parent component (MuseumPortalGame) will handle the phase change
            }}
            className="bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition-colors"
          >
            返回关卡选择
          </button>
        </div>
      </div>
    </div>
  );
};

export default Level1Scene;