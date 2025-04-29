import React from 'react';
import { useDigitalTwin } from '../../hooks/useDigitalTwin';
import { Clock, Sun, Moon, AlertCircle } from 'lucide-react';

const CircadianRecommendations = () => {
  const { 
    currentTimePeriod, 
    circadianRecommendations, 
    optimalTimes, 
    userChronotype 
  } = useDigitalTwin();
  
  // If we don't have data yet, show loading state
  if (!currentTimePeriod) {
    return (
      <div className="p-3 border rounded-lg animate-pulse bg-gray-50">
        <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
        <div className="h-3 bg-gray-200 rounded w-1/2 mb-1"></div>
        <div className="h-3 bg-gray-200 rounded w-5/6"></div>
      </div>
    );
  }
  
  // Determine the icon to show based on current energy level
  const getEnergyIcon = () => {
    const { currentEnergyLevel } = circadianRecommendations;
    
    if (currentEnergyLevel === 'high') {
      return <Sun className="text-yellow-500" size={18} />;
    } else if (currentEnergyLevel === 'moderate') {
      return <Sun className="text-yellow-300" size={18} />;
    } else {
      return <Moon className="text-indigo-400" size={18} />;
    }
  };
  
  // Get background color based on training match
  const getMatchColor = () => {
    const { trainingMatch } = circadianRecommendations;
    
    switch (trainingMatch) {
      case 'excellent':
        return 'bg-green-50 border-green-200';
      case 'good':
        return 'bg-blue-50 border-blue-200';
      case 'moderate':
        return 'bg-yellow-50 border-yellow-200';
      default:
        return 'bg-red-50 border-red-200';
    }
  };
  
  // Get chronotype name
  const getChronotypeLabel = () => {
    switch (userChronotype) {
      case 'morning':
        return 'Early Bird';
      case 'evening':
        return 'Night Owl';
      default:
        return 'Intermediate';
    }
  };
  
  const {
    currentEnergyLevel,
    recommendation,
    nextIdealTime,
    trainingMatch
  } = circadianRecommendations;
  
  return (
    <div className={`p-3 border rounded-lg ${getMatchColor()}`}>
      <div className="flex justify-between items-start mb-2">
        <div className="flex items-center">
          <Clock size={16} className="mr-1 text-indigo-600" />
          <span className="text-sm font-medium">Circadian Insights</span>
        </div>
        {getEnergyIcon()}
      </div>
      
      <div className="mb-2">
        <div className="flex items-center mb-1">
          <span className="text-xs font-medium">Current Energy Level:</span>
          <span className={`ml-1 text-xs px-1.5 py-0.5 rounded-full ${
            currentEnergyLevel === 'high' ? 'bg-green-100 text-green-800' :
            currentEnergyLevel === 'moderate' ? 'bg-blue-100 text-blue-800' :
            'bg-gray-100 text-gray-800'
          }`}>
            {currentEnergyLevel.charAt(0).toUpperCase() + currentEnergyLevel.slice(1)}
          </span>
        </div>
        
        <p className="text-xs text-gray-700">
          {recommendation}
        </p>
      </div>
      
      <div className="text-xs text-gray-600 flex flex-col gap-1">
        <div className="flex justify-between">
          <span>Chronotype:</span>
          <span className="font-medium">{getChronotypeLabel()}</span>
        </div>
        
        <div className="flex justify-between">
          <span>Next Ideal Training Time:</span>
          <span className="font-medium">{nextIdealTime}</span>
        </div>
      </div>
    </div>
  );
};

export default CircadianRecommendations;