import React, { useState, useEffect } from 'react';
import { Brain, Clock } from 'lucide-react';

/**
 * A component that provides cognitive exercises to test and improve cognitive function
 */
const CognitiveStimulus = () => {
  const [activeTest, setActiveTest] = useState(null);
  const [testResult, setTestResult] = useState(null);
  const [startTime, setStartTime] = useState(null);
  
  // Simple memory test sequence
  const [memorySequence, setMemorySequence] = useState([]);
  const [userSequence, setUserSequence] = useState([]);
  const [sequenceStep, setSequenceStep] = useState(0);
  
  // Available cognitive tests
  const cognitiveTests = [
    { 
      id: 'memory', 
      name: 'Memory Sequence',
      description: 'Memorize and repeat a sequence of colors',
      duration: '15-30 seconds',
      difficulty: 'Medium'
    },
    { 
      id: 'reaction', 
      name: 'Reaction Time',
      description: 'Click as quickly as possible when the color changes',
      duration: '5-10 seconds',
      difficulty: 'Easy'
    }
  ];
  
  // Generate a random color sequence
  const generateSequence = (length = 4) => {
    const colors = ['red', 'blue', 'green', 'yellow'];
    const newSequence = [];
    
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * colors.length);
      newSequence.push(colors[randomIndex]);
    }
    
    return newSequence;
  };
  
  // Start memory test
  const startMemoryTest = () => {
    const sequence = generateSequence();
    setMemorySequence(sequence);
    setUserSequence([]);
    setSequenceStep(0);
    setActiveTest('memory');
    setTestResult(null);
    setStartTime(Date.now());
    
    // Show sequence to user
    showSequence(sequence);
  };
  
  // Function to sequentially show the colors
  const showSequence = (sequence) => {
    let step = 0;
    
    const interval = setInterval(() => {
      setSequenceStep(step);
      
      step++;
      if (step >= sequence.length) {
        clearInterval(interval);
        
        // After a delay, reset the active color and allow user input
        setTimeout(() => {
          setSequenceStep(-1); // No active color
        }, 500);
      }
    }, 1000);
  };
  
  // Handle user clicking a color
  const handleColorClick = (color) => {
    if (activeTest !== 'memory' || sequenceStep !== -1) return;
    
    const newUserSequence = [...userSequence, color];
    setUserSequence(newUserSequence);
    
    // Check if user has completed the sequence
    if (newUserSequence.length === memorySequence.length) {
      const correct = memorySequence.every(
        (color, index) => color === newUserSequence[index]
      );
      
      const timeTaken = ((Date.now() - startTime) / 1000).toFixed(1);
      
      setTestResult({
        correct,
        timeTaken,
        score: correct ? 100 : Math.floor((memorySequence.filter(
          (color, index) => color === newUserSequence[index]
        ).length / memorySequence.length) * 100)
      });
      
      setActiveTest(null);
    }
  };
  
  // Start reaction test
  const startReactionTest = () => {
    setActiveTest('reaction-waiting');
    setTestResult(null);
    
    // Random delay between 2-5 seconds
    const delay = 2000 + Math.random() * 3000;
    
    setTimeout(() => {
      setActiveTest('reaction-go');
      setStartTime(Date.now());
    }, delay);
  };
  
  // Handle reaction click
  const handleReactionClick = () => {
    if (activeTest === 'reaction-waiting') {
      // Clicked too early
      setTestResult({
        correct: false,
        timeTaken: 0,
        score: 0,
        message: 'Too early! Wait for green.'
      });
      setActiveTest(null);
    } else if (activeTest === 'reaction-go') {
      // Clicked on time - calculate reaction time
      const reactionTime = Date.now() - startTime;
      
      // Score based on reaction time (300-800ms is normal range)
      let score;
      if (reactionTime < 200) {
        score = 100; // Exceptional
      } else if (reactionTime < 300) {
        score = 90; // Excellent
      } else if (reactionTime < 400) {
        score = 80; // Very good
      } else if (reactionTime < 500) {
        score = 70; // Good
      } else if (reactionTime < 600) {
        score = 60; // Average
      } else {
        score = Math.max(0, 100 - Math.floor((reactionTime - 500) / 20));
      }
      
      setTestResult({
        correct: true,
        timeTaken: (reactionTime / 1000).toFixed(3),
        score,
        message: reactionTime < 400 ? 'Excellent reaction time!' : 'Good effort!'
      });
      
      setActiveTest(null);
    }
  };
  
  return (
    <div className="border rounded-lg p-4 bg-white">
      <h3 className="font-medium mb-3 flex items-center">
        <Brain size={18} className="text-indigo-600 mr-2" />
        Cognitive Assessment
      </h3>
      
      {!activeTest && !testResult && (
        <div>
          <p className="text-sm text-gray-600 mb-3">
            Take a quick assessment to measure your current cognitive performance.
          </p>
          
          <div className="space-y-2">
            {cognitiveTests.map(test => (
              <button
                key={test.id}
                className="w-full p-3 text-left border rounded-lg hover:bg-gray-50 transition-colors"
                onClick={() => test.id === 'memory' ? startMemoryTest() : startReactionTest()}
              >
                <div className="flex justify-between items-center">
                  <span className="font-medium">{test.name}</span>
                  <span className="text-xs px-2 py-1 bg-gray-100 rounded">
                    {test.difficulty}
                  </span>
                </div>
                <p className="text-xs text-gray-600 mt-1">{test.description}</p>
                <div className="flex items-center text-xs text-gray-500 mt-2">
                  <Clock size={12} className="mr-1" />
                  <span>{test.duration}</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
      
      {activeTest?.startsWith('memory') && (
        <div className="text-center py-2">
          <p className="text-sm mb-3">
            {sequenceStep === -1 
              ? "Now repeat the sequence by clicking the colors" 
              : "Remember this sequence:"}
          </p>
          
          <div className="grid grid-cols-2 gap-3 my-4">
            {['red', 'blue', 'green', 'yellow'].map((color) => {
              const isActive = memorySequence[sequenceStep] === color;
              const colorClasses = {
                red: 'bg-red-500 hover:bg-red-600',
                blue: 'bg-blue-500 hover:bg-blue-600',
                green: 'bg-green-500 hover:bg-green-600',
                yellow: 'bg-yellow-500 hover:bg-yellow-600'
              };
              
              return (
                <button
                  key={color}
                  className={`${colorClasses[color]} h-16 rounded-lg transition-transform ${isActive ? 'scale-110 ring-4 ring-white' : ''} ${sequenceStep === -1 ? 'cursor-pointer' : 'cursor-default'}`}
                  onClick={() => handleColorClick(color)}
                  disabled={sequenceStep !== -1}
                />
              );
            })}
          </div>
          
          {sequenceStep === -1 && (
            <div className="h-4 bg-gray-200 rounded-full overflow-hidden mt-2">
              <div 
                className="h-full bg-indigo-600 transition-all"
                style={{ width: `${(userSequence.length / memorySequence.length) * 100}%` }}
              ></div>
            </div>
          )}
        </div>
      )}
      
      {activeTest?.startsWith('reaction') && (
        <div 
          className={`h-40 flex items-center justify-center rounded-lg cursor-pointer ${
            activeTest === 'reaction-waiting' ? 'bg-red-500' : 'bg-green-500'
          }`}
          onClick={handleReactionClick}
        >
          <p className="text-white font-bold text-center">
            {activeTest === 'reaction-waiting' 
              ? "Wait for GREEN, then click quickly!" 
              : "CLICK NOW!"}
          </p>
        </div>
      )}
      
      {testResult && (
        <div className="p-3 border rounded-lg bg-indigo-50">
          <h4 className="font-medium mb-2">Test Results</h4>
          
          <div className="flex justify-between items-center mb-2">
            <span>Score:</span>
            <span className="font-bold text-lg">{testResult.score}%</span>
          </div>
          
          <div className="w-full bg-gray-200 rounded-full h-2 mb-3">
            <div 
              className={`h-2 rounded-full ${
                testResult.score > 80 ? 'bg-green-600' : 
                testResult.score > 60 ? 'bg-blue-600' : 
                testResult.score > 40 ? 'bg-yellow-600' : 'bg-red-600'
              }`}
              style={{ width: `${testResult.score}%` }}
            ></div>
          </div>
          
          <div className="text-sm">
            <div className="flex justify-between">
              <span>Time taken:</span>
              <span>{testResult.timeTaken} seconds</span>
            </div>
            
            {testResult.message && (
              <p className="mt-2 text-center font-medium">{testResult.message}</p>
            )}
          </div>
          
          <div className="mt-4 flex justify-center">
            <button 
              className="px-3 py-1 bg-indigo-600 text-white text-sm rounded"
              onClick={() => setTestResult(null)}
            >
              Try Another Test
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CognitiveStimulus;