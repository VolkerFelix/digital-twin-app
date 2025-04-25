import React, { useState } from 'react';
import { Brain, Coffee, BookOpen, Calendar, Clock } from 'lucide-react';
import { useDigitalTwin } from '../../hooks/useDigitalTwin';
import CognitivePerformanceChart from './CognitivePerformanceChart';
import CognitiveForecastPanel from './CognitiveForecastPanel';

const CognitivePerformancePanel = () => {
  const { cognitiveData } = useDigitalTwin();
  
  // Local state for UI purposes
  const [viewMode, setViewMode] = useState('current'); // current, forecast
  
  // Calculate current cognitive score (average of current day or most recent data)
  const calculateCurrentScore = () => {
    if (!cognitiveData || cognitiveData.length === 0) return 60; // Default value
    
    // In a real app, you'd find the most recent data point
    // For now, we'll just use the average of all points
    const sum = cognitiveData.reduce((acc, point) => acc + point.cognitive, 0);
    return Math.round(sum / cognitiveData.length);
  };
  
  // Determine current cognitive level
  const currentScore = calculateCurrentScore();
  const getCognitiveLevel = (score) => {
    if (score >= 80) return { level: 'Peak Performance', color: 'text-indigo-600' };
    if (score >= 65) return { level: 'High Functioning', color: 'text-blue-600' };
    if (score >= 50) return { level: 'Average', color: 'text-green-600' };
    if (score >= 35) return { level: 'Below Average', color: 'text-yellow-600' };
    return { level: 'Low Performance', color: 'text-red-600' };
  };
  
  const { level, color } = getCognitiveLevel(currentScore);
  
  // Get optimal time for cognitive tasks
  const getOptimalTime = () => {
    if (!cognitiveData || cognitiveData.length === 0) {
      return { time: '9 AM - 11 AM', score: 75 };
    }
    
    // Find time with highest cognitive score
    const highest = cognitiveData.reduce((best, current) => 
      current.cognitive > best.cognitive ? current : best, cognitiveData[0]);
    
    return { time: highest.label, score: highest.cognitive };
  };
  
  const optimalTime = getOptimalTime();
  
  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Cognitive Performance</h2>
        
        {/* View mode selector */}
        <div className="flex rounded-md overflow-hidden border">
          <button
            className={`px-3 py-1 text-sm ${viewMode === 'current' ? 'bg-indigo-600 text-white' : 'bg-gray-100'}`}
            onClick={() => setViewMode('current')}
          >
            Current
          </button>
          <button 
            className={`px-3 py-1 text-sm ${viewMode === 'forecast' ? 'bg-indigo-600 text-white' : 'bg-gray-100'}`}
            onClick={() => setViewMode('forecast')}
          >
            Forecast
          </button>
        </div>
      </div>
      
      {viewMode === 'current' ? (
        <>
          <p className="text-sm text-gray-500 mb-4">Your mental sharpness throughout the day</p>
          
          {/* Daily chart */}
          <CognitivePerformanceChart />
          
          {/* Current status and insights */}
          <div className="grid grid-cols-2 gap-3 mt-3">
            <div className="p-3 border rounded-lg">
              <div className="flex items-center gap-2 mb-1">
                <Brain size={16} className="text-indigo-600" />
                <span className="text-sm font-medium">Current Status</span>
              </div>
              <p className={`text-lg font-bold ${color}`}>{level}</p>
              <div className="flex w-full bg-gray-200 rounded-full h-1.5 mt-2">
                <div
                  className="bg-indigo-600 h-1.5 rounded-full"
                  style={{ width: `${currentScore}%` }}
                ></div>
              </div>
            </div>
            
            <div className="p-3 border rounded-lg">
              <div className="flex items-center gap-2 mb-1">
                <Coffee size={16} className="text-indigo-600" />
                <span className="text-sm font-medium">Optimal Time</span>
              </div>
              <p className="text-lg font-bold">{optimalTime.time}</p>
              <p className="text-xs text-gray-600">
                Schedule complex tasks during your peak cognitive hours
              </p>
            </div>
          </div>
          
          {/* Recommendations */}
          <div className="mt-3 p-3 border rounded-lg bg-indigo-50">
            <div className="flex items-center gap-2 mb-2">
              <BookOpen size={16} className="text-indigo-600" />
              <span className="text-sm font-medium">Cognitive Insight</span>
            </div>
            <p className="text-sm">
              Your cognitive performance is currently at <span className="font-bold">{currentScore}%</span>. 
              For best results, schedule critical thinking tasks between <span className="font-bold">{optimalTime.time}</span>, 
              when your mental sharpness typically peaks.
              {currentScore < 60 && " Consider a short break or light exercise to refresh your mental energy."}
            </p>
          </div>
        </>
      ) : (
        <CognitiveForecastPanel />
      )}
      
      {/* Footer with switching suggestion */}
      <div className="flex justify-center mt-4 text-xs text-gray-500">
        <button 
          className="flex items-center hover:text-indigo-600"
          onClick={() => setViewMode(viewMode === 'current' ? 'forecast' : 'current')}
        >
          {viewMode === 'current' ? (
            <>
              <Calendar size={14} className="mr-1" />
              <span>View cognitive forecast</span>
            </>
          ) : (
            <>
              <Clock size={14} className="mr-1" />
              <span>View current performance</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default CognitivePerformancePanel;