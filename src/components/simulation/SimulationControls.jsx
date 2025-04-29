import React, { useState } from 'react';
import { Moon, Activity } from 'lucide-react';
import { useDigitalTwin } from '../../hooks/useDigitalTwin';

const SimulationControls = () => {
  const { 
    simulationData, 
    handleSleepChange, 
    handleIntensityChange,
    recoveryTime
  } = useDigitalTwin();
  
  const { sleepHours, workoutIntensity } = simulationData;
  
  // Local state for UI purposes
  const [activeTab, setActiveTab] = useState('current');
  
  // Handle slider change for sleep hours
  const onSleepChange = (e) => {
    const hours = parseInt(e.target.value);
    handleSleepChange(hours);
  };
  
  // Handle slider change for workout intensity
  const onIntensityChange = (e) => {
    const intensity = parseInt(e.target.value);
    handleIntensityChange(intensity);
  };
  
  return (
    <div className="w-full">      
      <h2 className="text-lg font-semibold">Recovery Projection</h2>
      <p className="text-sm text-gray-500 mb-4">How different factors affect your recovery timeline</p>
      
      {/* Simulation Controls */}
      <div className="mb-4 p-3 border rounded-lg">
        <div className="mb-3">
          <label className="block text-sm font-medium mb-1">Sleep Quality</label>
          <div className="flex items-center gap-2">
            <Moon size={16} />
            <input
              type="range"
              min="4"
              max="10"
              value={sleepHours}
              onChange={onSleepChange}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
            <span className="text-sm font-medium">{sleepHours}h</span>
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">Next Workout Intensity</label>
          <div className="flex items-center gap-2">
            <Activity size={16} />
            <input
              type="range"
              min="10"
              max="100"
              value={workoutIntensity}
              onChange={onIntensityChange}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
            <span className="text-sm font-medium">{workoutIntensity}%</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SimulationControls;