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
      {/* Tab controls */}
      <div className="flex mb-4">
        <button
          className={`px-4 py-2 rounded-l-md ${activeTab === 'current' ? 'bg-blue-600 text-white' : 'bg-gray-100'}`}
          onClick={() => setActiveTab('current')}
        >
          Current Projection
        </button>
        <button 
          className={`px-4 py-2 rounded-r-md ${activeTab === 'simulation' ? 'bg-blue-600 text-white' : 'bg-gray-100'}`}
          onClick={() => setActiveTab('simulation')}
        >
          "What If" Simulation
        </button>
      </div>
      
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
      
      {/* Recovery insight information */}
      <div className="p-3 border rounded-lg bg-blue-50">
        <h3 className="text-sm font-medium mb-1">Recovery Insight</h3>
        <p className="text-sm">
          With {sleepHours}h of sleep and {workoutIntensity}% workout intensity, 
          you'll reach optimal readiness in <span className="font-bold">
            {recoveryTime} days
          </span>. 
          <span className={workoutIntensity > 80 ? "text-red-600" : ""}>
            {workoutIntensity > 80 ? " Consider reducing intensity to improve recovery time." : ""}
          </span>
        </p>
      </div>
    </div>
  );
};

export default SimulationControls;