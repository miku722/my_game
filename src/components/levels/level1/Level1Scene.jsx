import { useState, useEffect } from 'react';

const Level1Scene = () => {
  // Complete text that has been fully typed and displayed
  const [displayedText, setDisplayedText] = useState('');
  // Current text that is being typed (shown as if being typed)
  const [currentText, setCurrentText] = useState('');
  // Flag to track if we're waiting for user click
  const [waitingForClick, setWaitingForClick] = useState(false);
  // Current paragraph index
  const [currentParagraphIndex, setCurrentParagraphIndex] = useState(0);
  // Current step index (0 for first group of paragraphs)

  // Current index in the flattened paragraphs array
  const [currentParagraphFlatIndex, setCurrentParagraphFlatIndex] = useState(0);
  
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
    // All paragraphs flattened into a single array for sequential processing
  const allParagraphs = sceneDescriptionParagraphs.flat();
  
  // Current paragraph index within the current step
  const [paragraphIndex, setParagraphIndex] = useState(0);
  
  // Simple typewriter effect for scene descriptions
  useEffect(() => {
    // Get the current paragraph from the flattened array
    const currentParagraph = allParagraphs[currentParagraphFlatIndex];
    
    let index = 0;
    setCurrentText('');
    
    const typeWriter = setInterval(() => {
      if (index < currentParagraph.length) {
        setCurrentText(currentParagraph.slice(0, index + 1));
        index++;
      } else {
        clearInterval(typeWriter);
        // Set flag to wait for user click
        setWaitingForClick(true);
      }
    }, 40);
    
    return () => clearInterval(typeWriter);
  }, [currentParagraphFlatIndex]);

  // Handle click to continue to next paragraph
  const handleContinue = () => {
    if (waitingForClick) {
      setWaitingForClick(false);
      
      // Add the current paragraph to the displayed text
      setDisplayedText(prev => prev + allParagraphs[currentParagraphFlatIndex] + '\n\n');
      
      // Move to next paragraph in the flattened array
      if (currentParagraphFlatIndex < allParagraphs.length - 1) {
        setCurrentParagraphFlatIndex(prev => prev + 1);
      } else {
        // All paragraphs completed
        setCurrentText('');
      }
    }
  };

  return (
    <div 
      className="flex flex-col h-screen bg-gradient-to-br from-blue-100 to-purple-100"
      onClick={handleContinue}
      style={{ cursor: waitingForClick ? 'pointer' : 'default' }}
    >
      <div className="bg-white rounded-t-lg shadow-lg p-8 flex-grow">
        {/* Scene Content */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">馆内启程</h2>
          
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-6 mb-6 flex-grow overflow-y-auto custom-scrollbar">
            <div className="text-gray-700 leading-relaxed text-left">
              {/* Render all text as a single continuous flow */}
              <p className="whitespace-pre-line text-left">
                {displayedText}
                {currentText}
              </p>
              {/* Show click to continue prompt */}
              {waitingForClick && (
                <div className="text-center mt-4">
                  <p className="text-gray-500 text-sm italic">点击空白处继续...</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Level1Scene;