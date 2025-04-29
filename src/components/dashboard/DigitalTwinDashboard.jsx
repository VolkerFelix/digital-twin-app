import React from 'react';
import AvatarVisualization from '../avatar/AvatarVisualization';
import MetricsPanel from './MetricsPanel';
import SimulationControls from '../simulation/SimulationControls';
import RecoveryChart from '../simulation/RecoveryChart';
import CognitivePerformancePanel from '../simulation/CognitivePerformancePanel';
import AdaptiveSuggestions from '../recommendations/AdaptiveSuggestions';
import { DigitalTwinProvider } from '../../context/DigitalTwinContext';
import CircadianRhythmPanel from '../simulation/CircadianRhythmPanel';

const DigitalTwinDashboard = () => {
  return (
    <DigitalTwinProvider>
      <div className="bg-gray-100 w-full p-4 rounded-lg font-sans text-gray-800">
        <div className="flex flex-col gap-4">
          {/* Main content area */}
          <div className="flex gap-4">
            {/* Left panel - Avatar & Stats */}
            <div className="w-1/4 bg-white p-4 rounded-lg shadow">
              <h2 className="text-lg font-semibold mb-4">Current State</h2>
              
              <AvatarVisualization />
              
              <MetricsPanel />
            </div>
            
            {/* Center panels - Simulations & Projections */}
            <div className="w-2/4 flex flex-col gap-4">

              {/* Cognitive performance panel */}
              <div className="bg-white p-4 rounded-lg shadow">
                <CognitivePerformancePanel />
              </div>

              {/* Physical recovery panel */}
              <div className="bg-white p-4 rounded-lg shadow">
                <SimulationControls />
                <RecoveryChart />
              </div>
              
              {/* Circadian rhythm panel */}
              <div className="bg-white p-4 rounded-lg shadow">
                <CircadianRhythmPanel />
              </div>
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