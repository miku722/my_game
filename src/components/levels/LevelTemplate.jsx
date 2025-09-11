import { useState, useEffect } from 'react';
import { processPlayerAction } from '../../game/components/ActionProcessor';

const LevelTemplate = ({
  sceneDescriptionParagraphs: initialSceneDescriptionParagraphs,
  onComplete,
  gameState,
  updateGameState,
  playerState,
  setPlayerState,
  setActionHistory,
  recruitAlly
}) => {
  // Complete text that has been fully typed and displayed
  const [completedParagraphs, setCompletedParagraphs] = useState([]);
  // Current text that is being typed (shown as if being typed)
  const [currentText, setCurrentText] = useState('');
  // Current system move type: 'typing', 'continue', 'action', 'calling_api', or null
  const [currentSystemMove, setCurrentSystemMove] = useState(null);

  // Current step index
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  // Current paragraph index within the current step
  const [currentParagraphIndex, setCurrentParagraphIndex] = useState(0);
  
  // Current action type (do, say, see)
  const [actionType, setActionType] = useState(null);
  // Action input text
  const [actionInput, setActionInput] = useState('');
  // Flag to track if the action was rejected
  const [actionRejected, setActionRejected] = useState(false);
  // Rejected action message
  const [rejectionMessage, setRejectionMessage] = useState('');
  // Convert regular paragraphs to marked paragraphs (with action flags)
  const convertToMarkedParagraphs = (paragraphs) => {
    return paragraphs.map(step =>
      step.map((text, index, arr) => ({
        text,
        hasAction: index === arr.length - 1 // Last paragraph in step has action
      }))
    );
  };
  
  
  // Current scene description paragraphs with action markers (can be updated with AI responses)
  const [sceneDescriptionParagraphs, setSceneDescriptionParagraphs] = useState(convertToMarkedParagraphs(initialSceneDescriptionParagraphs));

  // Track the current typing position for each paragraph
  const [typingPositions, setTypingPositions] = useState({});
  
  // Simple typewriter effect for scene descriptions
  useEffect(() => {
    const currentStepParagraphs = sceneDescriptionParagraphs[currentStepIndex];
    if (!currentStepParagraphs || !currentStepParagraphs[currentParagraphIndex]) {
      console.error('No paragraph found for current step and paragraph index' + JSON.stringify(currentStepParagraphs) + '---' + currentParagraphIndex);
      return;
    }
    const currentParagraphObj = currentStepParagraphs[currentParagraphIndex];
    const currentParagraph = currentParagraphObj.text;
    
    // Get the current typing position for this paragraph
    const positionKey = `${currentStepIndex}-${currentParagraphIndex}`;
    const currentPosition = typingPositions[positionKey] || 0;
    
    // Use the stored position if we have one, otherwise start from beginning
    let index = currentText.length > 0 ? currentText.length : currentPosition;
    
    // Set system move to typing
    setCurrentSystemMove('typing');
    
    const typeWriter = setInterval(() => {
      if (index < currentParagraph.length) {
        const newText = currentParagraph.slice(0, index + 1);
        setCurrentText(newText);
        index++;
        
        // Update typing position
        setTypingPositions(prev => ({
          ...prev,
          [positionKey]: index
        }));
      } else {
        clearInterval(typeWriter);
        // Only add to completed paragraphs once to avoid duplicates
        setCompletedParagraphs(prev => [...prev, currentParagraph]);
        // Reset typing position for this paragraph
        setTypingPositions(prev => ({
          ...prev,
          [positionKey]: 0
        }));
        
        // Use the hasAction property to determine next system move
        if (currentParagraphObj.hasAction) {
          // If this paragraph has an action, wait for player action
          setCurrentSystemMove('action');
        } else {
          // Otherwise, wait for continue click
          setCurrentSystemMove('continue');
        }
      }
    }, 1000 / 30); // Approx 30 characters per second
    
    return () => clearInterval(typeWriter);
  }, [currentStepIndex, currentParagraphIndex, sceneDescriptionParagraphs, currentText]);
  
  // Effect to detect when new text is added and trigger typewriter
  useEffect(() => {
    const currentStepParagraphs = sceneDescriptionParagraphs[currentStepIndex];
    if (!currentStepParagraphs || !currentStepParagraphs[currentParagraphIndex]) {
      console.error('No paragraph found for current step and paragraph index' + JSON.stringify(currentStepParagraphs) + '---' + currentParagraphIndex);
      return;
    }
    const currentParagraphObj = currentStepParagraphs[currentParagraphIndex];
    const currentParagraph = currentParagraphObj.text;
    
    // Only check if we're not already typing and have a current text
    if (currentSystemMove !== 'typing' && currentText) {
      // If the paragraph has been updated (length increased) and we haven't completed it
      if (currentParagraph.length > currentText.length && !completedParagraphs.includes(currentText)) {
        // Continue typing from current position
        setCurrentSystemMove('typing');
      }
    }
  }, [sceneDescriptionParagraphs, currentStepIndex, currentParagraphIndex, currentSystemMove, currentText, completedParagraphs]);
  
  // Reset typing position when moving to a new paragraph
  useEffect(() => {
    const positionKey = `${currentStepIndex}-${currentParagraphIndex}`;
    // If we have no current text, reset the typing position
    if (!currentText) {
      setTypingPositions(prev => ({
        ...prev,
        [positionKey]: 0
      }));
    }
  }, [currentStepIndex, currentParagraphIndex, currentText]);

  // Handle continue click within a step
  const handleContinue = () => {
    if (currentSystemMove === 'continue') {
      const currentStepParagraphs = sceneDescriptionParagraphs[currentStepIndex];
      
      // Check if we've reached the end of current step
      if (currentParagraphIndex >= currentStepParagraphs.length - 1) {
        // If there's a next step
        if (currentStepIndex < sceneDescriptionParagraphs.length - 1) {
          // Move to next step
          setCurrentStepIndex(prev => prev + 1);
          setCurrentParagraphIndex(0);
          // Reset current text and set to typing mode for the new step
          setCurrentText('');
          setCurrentSystemMove('typing');
        } else {
          // No more steps, mark as complete
          setCurrentSystemMove('complete');
        }
      } else {
        // Move to next paragraph in current step
        setCurrentParagraphIndex(prev => prev + 1);
        // Reset current text and set to typing mode
        setCurrentText('');
        setCurrentSystemMove('typing');
      }
    }
  };

  // Handle action submission between steps
  const handleSubmitAction = async () => {
    if (currentSystemMove === 'action' && actionType && actionInput.trim()) {
      setCurrentSystemMove('calling_api');
      setActionRejected(false);
      
      try {
        // Call the API with the player's action
        const action = `${actionType}: ${actionInput}`;
        const result = await processPlayerAction(
          action,
          gameState,
          playerState,
          updateGameState,
          setPlayerState,
          setActionHistory,
          recruitAlly,
          currentStepIndex,
          currentParagraphIndex,
          sceneDescriptionParagraphs
        );
        console.error('API result:', JSON.stringify(result));
        // Process the API response from processPlayerAction
        // The result is already parsed JSON, no need to parse again
        if (result && result.feasible !== false) {
          // Action was successful or undefined, add the result to the current step
          const newParagraphs = [...sceneDescriptionParagraphs];
          
          // Split the result into paragraphs by double line breaks
          const resultParagraphs = result.result.split('\n\n').filter(p => p.trim().length > 0);
          
          // Convert result paragraphs to marked paragraphs (all marked as not having action)
          const markedResultParagraphs = resultParagraphs.map(text => ({
            text,
            hasAction: false
          }));
          
          // Add the result paragraphs to the end of the current step
          newParagraphs[currentStepIndex] = [...newParagraphs[currentStepIndex], ...markedResultParagraphs];
          
          // Update the scene description paragraphs
          setSceneDescriptionParagraphs(newParagraphs);
          
          // Move to the next paragraph in the current step (which now includes the result)
          // We move to the first paragraph of the result (after the original content)
          const originalParagraphCount = sceneDescriptionParagraphs[currentStepIndex].length;
          setCurrentParagraphIndex(originalParagraphCount);
          setCurrentSystemMove('continue'); // Set system move to continue
          
          // Reset current text to start the typewriter effect
          setCurrentText('');
        } else {
          // Action was rejected, add rejection to current step
          const newParagraphs = [...sceneDescriptionParagraphs];
          
          // Create rejection message with result and suggestions
          let rejectionContent = result.result || '你的行动无法实现，这可能导致关卡失败。';
          
          // Add suggestions if available
          if (result.nextSuggestions && result.nextSuggestions.length > 0) {
            rejectionContent += '\n\n建议：' + result.nextSuggestions.join('，');
          }
          
          // Add the rejection message as a new paragraph in the current step with hasAction: true
          newParagraphs[currentStepIndex] = [...newParagraphs[currentStepIndex], {
            text: rejectionContent,
            hasAction: true
          }];
          
          // Update the scene description paragraphs
          setSceneDescriptionParagraphs(newParagraphs);
          
          // Move to the new paragraph with the rejection message
          const originalParagraphCount = sceneDescriptionParagraphs[currentStepIndex].length;
          setCurrentParagraphIndex(originalParagraphCount);
          setCurrentSystemMove('action'); // Keep system move as action
          
          // Reset current text to start the typewriter effect
          setCurrentText('');
          
          // Set flag to indicate rejection (used for styling if needed)
          setActionRejected(true);
        }
      } catch (error) {
        // Handle API call errors
        setActionRejected(true);
        setRejectionMessage('在处理你的行动时出现了问题，请重试。' + JSON.stringify(error));
        setCurrentSystemMove('action'); // Restore system move on error
      }
    }
  };

  return (
    <div 
      className="flex flex-col h-screen bg-gradient-to-br from-blue-100 to-purple-100"
      onClick={handleContinue}
      style={{ cursor: currentSystemMove === 'continue' ? 'pointer' : 'default' }}
    >
      <div className="bg-white rounded-t-lg shadow-lg p-8 flex-grow">
        {/* Scene Content */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">馆内启程</h2>
          
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-6 mb-6 flex-grow overflow-y-auto custom-scrollbar">
            <div className="text-gray-700 leading-relaxed text-left">
              {/* Render all completed paragraphs */}
              {completedParagraphs.map((paragraph, idx) => (
                <p key={idx} className="whitespace-pre-line text-left mb-4">{paragraph}</p>
              ))}
              {/* Current typing paragraph */}
              {(currentSystemMove === 'typing' || (currentSystemMove === null && currentText)) && (
                <p className="whitespace-pre-line text-left">{currentText}</p>
              )}
              
              {/* Show continue prompt within a step */}
              {currentSystemMove === 'continue' && (
                <div className="text-center mt-4">
                  <p className="text-gray-500 text-sm italic">点击空白处继续...</p>
                </div>
              )}
              
              {/* Show action interface between steps */}
              {currentSystemMove === 'action' && (
                <div className="mt-4">
                  <p className="text-center text-gray-700 mb-2">该你行动了</p>
                  <div className="flex justify-center space-x-4 mb-2 text-sm">
                    <button 
                      type="button" 
                      className={actionType === 'do' ? 'font-bold text-blue-600' : 'text-gray-500'}
                      onClick={() => setActionType('do')}
                    >
                      do
                    </button>
                    <button 
                      type="button" 
                      className={actionType === 'say' ? 'font-bold text-blue-600' : 'text-gray-500'}
                      onClick={() => setActionType('say')}
                    >
                      say
                    </button>
                    <button 
                      type="button" 
                      className={actionType === 'see' ? 'font-bold text-blue-600' : 'text-gray-500'}
                      onClick={() => {
                        setActionType('see');
                        setActionInput('你观察了四周');
                      }}
                    >
                      see
                    </button>
                  </div>
                  <input
                    type="text"
                    value={actionInput}
                    onChange={(e) => setActionInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSubmitAction()}
                    placeholder="输入你的行动..."
                    className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    disabled={currentSystemMove === 'calling_api'}
                  />
                </div>
              )}
              
              {/* Show API call in progress message */}
              {currentSystemMove === 'calling_api' && (
                <div className="text-center mt-4">
                  <p className="text-gray-700">让我来看看这样是否可行？</p>
                </div>
              )}
              
              {/* Show action rejection message */}
              {actionRejected && rejectionMessage && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 mt-4">
                  <p className="text-red-700">{rejectionMessage}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LevelTemplate;