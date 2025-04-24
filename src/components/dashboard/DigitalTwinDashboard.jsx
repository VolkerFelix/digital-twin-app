import React from 'react';
import AvatarVisualization from '../avatar/AvatarVisualization';
import MetricsPanel from './MetricsPanel';
import SimulationControls from '../simulation/SimulationControls';
import RecoveryChart from '../simulation/RecoveryChart';
import AdaptiveSuggestions from '../recommendations/AdaptiveSuggestions';
import { DigitalTwinProvider } from '../../context/DigitalTwinContext';

const DigitalTwinDashboard = () => {
  return (
    <DigitalTwinProvider>
      <div className="bg-gray-100 w-full p-4 rounded-lg font-sans text-gray-800">
        <div className="flex flex-col gap-4">
          {/* Header */}
          <div className="flex justify-between items-center bg-white p-4 rounded-lg shadow">
            <h1 className="text-2xl font-bold">Athlete Digital Twin</h1>
            <div className="flex gap-2">
              <button className="px-4 py-2 bg-blue-600 text-white rounded-md">Sync Data</button>
              <button className="px-4 py-2 border border-gray-300 rounded-md">Settings</button>
            </div>
          </div>
          
          {/* Main content area */}
          <div className="flex gap-4">
            {/* Left panel - Avatar & Stats */}
            <div className="w-1/3 bg-white p-4 rounded-lg shadow">
              <h2 className="text-lg font-semibold mb-4">Current State</h2>
              
              <AvatarVisualization />
              
              <MetricsPanel />
            </div>
            
            {/* Center panel - Simulations & Projections */}
            <div className="w-2/5 bg-white p-4 rounded-lg shadow">
              <SimulationControls />
              
              <RecoveryChart />
            </div>
            
            {/* Right panel - Recommendations */}
            <div className="w-1/4 bg-white p-4 rounded-lg shadow">
              <AdaptiveSuggestions />
            </div>
          </div>
        </div>
      </div>
    </DigitalTwinProvider>
  );
};

export default DigitalTwinDashboard;