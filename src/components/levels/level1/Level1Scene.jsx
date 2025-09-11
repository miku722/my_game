import LevelTemplate from '../LevelTemplate';

// This component receives all necessary state and functions from MuseumPortalGame
const Level1Scene = ({
  sceneDescriptionParagraphs,
  onComplete,
  gameState,
  updateGameState,
  playerState,
  setPlayerState,
  setActionHistory,
  recruitAlly
}) => {
  // Level 1 scene descriptions split into paragraphs
  const level1Paragraphs = [
    [
      // Step1 paragraphs
      "凌晨的博物馆空无一人，窗外的月光透过高大的落地窗洒在石质地面上，映出一条条拉长的影子。空气里弥漫着一种微妙的紧张感——你一踏入展厅，就察觉到异常。几个展柜的文物不翼而飞，原本静静陈列的青铜器、玉器和古籍，如今只剩下空荡荡的玻璃柜和微微发光的底座。",
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
      // Step 3 paragraphs
      "你紧握手中的青铜钥匙，掌心传来的微光让你感到一种神秘力量在流动。展厅的灯光微微闪烁，空气中弥漫着淡淡的魔法香气和古老灰尘的味道。",
      "角落的阴影中，一条平时难以察觉的通道缓缓浮现，石壁上的古老符文闪烁着幽蓝色光芒，仿佛在低声吟唱，指引你前行。",
      "微风从通道深处吹来，卷起地面上落下的灰尘，带着低沉的回响。你感到胸口的悸动与紧张交织，意识到真正的冒险旅程即将开始。"
    ]
  ];

  const handleComplete = () => {
    // Create custom modal for completion
    const modal = document.createElement('div');
    modal.style.position = 'fixed';
    modal.style.top = '0';
    modal.style.left = '0';
    modal.style.width = '100%';
    modal.style.height = '100%';
    modal.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
    modal.style.display = 'flex';
    modal.style.justifyContent = 'center';
    modal.style.alignItems = 'center';
    modal.style.zIndex = '1000';
    
    const modalContent = document.createElement('div');
    modalContent.style.backgroundColor = 'white';
    modalContent.style.padding = '20px';
    modalContent.style.borderRadius = '8px';
    modalContent.style.textAlign = 'center';
    
    const message = document.createElement('p');
    message.textContent = '恭喜你，顺利通关！';
    message.style.fontSize = '18px';
    message.style.marginBottom = '20px';
    
    const button = document.createElement('button');
    button.textContent = '返回关卡选择';
    button.style.padding = '10px 20px';
    button.style.backgroundColor = '#3B82F6';
    button.style.color = 'white';
    button.style.border = 'none';
    button.style.borderRadius = '4px';
    button.style.cursor = 'pointer';
    
    button.onclick = () => {
      // Update game state to mark level as completed and unlock next level
      updateGameState(prev => ({
        ...prev,
        levelProgress: {
          ...prev.levelProgress,
          level1: true,
          level2: true // Unlock next level
        }
      }));
      // Remove modal
      document.body.removeChild(modal);
      // Navigate back to level selection
      if (onComplete) onComplete();
    };
    
    modalContent.appendChild(message);
    modalContent.appendChild(button);
    modal.appendChild(modalContent);
    document.body.appendChild(modal);
  };

  return (
    <LevelTemplate
      sceneDescriptionParagraphs={level1Paragraphs}
      onComplete={handleComplete}
      gameState={gameState}
      updateGameState={updateGameState}
      playerState={playerState}
      setPlayerState={setPlayerState}
      setActionHistory={setActionHistory}
      recruitAlly={recruitAlly}
    />
  );
};

export default Level1Scene;