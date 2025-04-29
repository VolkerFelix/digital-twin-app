import React from 'react';
import { useDigitalTwin } from '../../hooks/useDigitalTwin';
import { Clock, Sun, Moon, AlertCircle } from 'lucide-react';

const CircadianFitnessScore = () => {
  const { 
    userChronotype, 
    circadianAlignment, 
    circadianData, 
    scheduledActivities 
  } = useDigitalTwin();
  
  // Calculate a numeric fitness score based on alignment
  const calculateFitnessScore = () => {
    if (!circadianData || !scheduledActivities || circadianData.length === 0) {
      return { score: 70, label: 'Good', color: 'text-blue-600' };
    }
    
    // Start with a baseline score
    let baseScore = 70;
    
    // Count alignment hits and misses
    let alignmentHits = 0;
    let alignmentMisses = 0;
    
    // For each scheduled high-intensity activity
    scheduledActivities.filter(a => a.intensity > 60).forEach(activity => {
      const timeSlot = circadianData.find(slot => slot.time === activity.time);
      if (!timeSlot) return;
      
      // Good alignment: high-intensity during high energy
      if (timeSlot.energy > 70) {
        alignmentHits++;
      } 
      // Poor alignment: high-intensity during low energy
      else if (timeSlot.energy < 40) {
        alignmentMisses++;
      }
    });
    
    // For each scheduled low-intensity activity
    scheduledActivities.filter(a => a.intensity <= 30).forEach(activity => {
      const timeSlot = circadianData.find(slot => slot.time === activity.time);
      if (!timeSlot) return;
      
      // Good alignment: recovery during low energy
      if (timeSlot.energy < 40) {
        alignmentHits++;
      }
      // Poor alignment: recovery during peak energy (wasted opportunity)
      else if (timeSlot.energy > 70) {
        alignmentMisses++;
      }
    });
    
    // Adjust score based on alignment quality
    const adjustment = (alignmentHits * 5) - (alignmentMisses * 8);
    const finalScore = Math.min(100, Math.max(0, baseScore + adjustment));
    
    // Determine label and color based on score
    let label, color;
    if (finalScore >= 85) {
      label = 'Excellent';
      color = 'text-green-600';
    } else if (finalScore >= 70) {
      label = 'Good';
      color = 'text-blue-600';
    } else if (finalScore >= 50) {
      label = 'Moderate';
      color = 'text-yellow-600';
    } else {
      label = 'Poor';
      color = 'text-red-600';
    }
    
    return { score: Math.round(finalScore), label, color };
  };
  
  const { score, label, color } = calculateFitnessScore();
  
  // Generate insights based on score and chronotype
  const getInsights = () => {
    if (score < 60) {
      // Poor alignment
      if (userChronotype === 'morning') {
        return "Consider moving high-intensity activities earlier in the day to match your 'early bird' energy pattern.";
      } else if (userChronotype === 'evening') {
        return "Try shifting your intense workouts to later in the day when your 'night owl' energy peaks.";
      } else {
        return "Your training schedule doesn't align well with your natural energy patterns.";
      }
    } else if (score < 80) {
      // Moderate alignment
      return "Your schedule has good alignment in some areas, but could be optimized further.";
    } else {
      // Good alignment
      return "Your current schedule works well with your natural circadian rhythm.";
    }
  };
  
  return (
    <div className="p-3 border rounded-lg">
      <div className="flex justify-between">
        <div className="flex items-center mb-1">
          <Clock size={16} className="mr-1 text-indigo-600" />
          <span className="text-sm font-medium">Circadian Fitness Score</span>
        </div>
        
        {/* Help icon with tooltip */}
        <div className="group relative">
          <div className="cursor-help text-gray-400 hover:text-gray-600">
            <AlertCircle size={14} />
          </div>
          <div className="absolute right-0 -bottom-1 transform translate-y-full w-48 px-2 py-1 bg-gray-800 rounded-md text-xs text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
            How well your training schedule aligns with your natural energy patterns
          </div>
        </div>
      </div>
      
      <div className="mt-2 flex items-center">
        {/* Score circle */}
        <div className="relative w-16 h-16 mr-3">
          {/* Background circle */}
          <svg className="w-full h-full" viewBox="0 0 36 36">
            <path
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              fill="none"
              stroke="#E5E7EB"
              strokeWidth="3"
              strokeDasharray="100, 100"
            />
            {/* Foreground circle - score percentage */}
            <path
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              fill="none"
              stroke={score >= 85 ? "#10B981" : score >= 70 ? "#3B82F6" : score >= 50 ? "#F59E0B" : "#EF4444"}
              strokeWidth="3"
              strokeDasharray={`${score}, 100`}
              className="transition-all duration-1000 ease-in-out"
            />
            <text x="18" y="20.5" textAnchor="middle" className="text-3xl font-bold">
              {score}
            </text>
          </svg>
        </div>
        
        <div>
          <div className={`font-bold text-lg ${color}`}>
            {label}
          </div>
          <div className="text-xs text-gray-600 mt-1">
            {getInsights()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CircadianFitnessScore;