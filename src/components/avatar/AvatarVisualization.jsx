import React, { useEffect, useState } from 'react';
import { useDigitalTwin } from '../../hooks/useDigitalTwin';
import maleAvatar from '../../assets/images/avatar-male.png';

const AvatarVisualization = () => {
  const { readinessScore, bodyPartStatus } = useDigitalTwin();
  const [debugMode, setDebugMode] = useState(false);

  // Helper function to determine aura color based on readiness
  const getReadinessColor = (score) => {
    if (score > 70) return 'rgba(16, 185, 129, 0.3)'; // Green/Good
    if (score > 40) return 'rgba(245, 158, 11, 0.3)'; // Yellow/Warning
    return 'rgba(239, 68, 68, 0.3)'; // Red/Danger
  };

  // Helper function to determine status color
  const getStatusColor = (status) => {
    switch (status) {
      case 'injured':
        return '#EF4444'; // Red
      case 'recovering':
        return '#F59E0B'; // Amber
      case 'optimal':
        return '#10B981'; // Green
      default:
        return '#6B7280'; // Gray
    }
  };

  const positionMap = {
    'right-shoulder': { x: '25%', y: '25%' },
    'left-knee': { x: '40%', y: '75%' },
    // Add more mappings as needed
  };

  // Log the body part status and position map for debugging
  useEffect(() => {
    if (debugMode) {
      console.log("Body Part Status:", bodyPartStatus);
      console.log("Position Map:", positionMap);
    }
  }, [bodyPartStatus, positionMap, debugMode]);

  return (
    <div className="flex flex-col items-center mb-6">
      <div className="relative mb-2">
        <div className="w-56 h-64 bg-white rounded-lg border border-blue-200 flex items-center justify-center overflow-hidden">
          <div 
            className="absolute inset-0"
            style={{ 
              backgroundImage: 'linear-gradient(to bottom, #4b83cc 0%, #4b83cc 60%, #68a336 60%, #68a336 100%)',
              opacity: 0.2
            }}
          ></div>
          
          {/* Background aura based on readiness */}
          <div 
            className="absolute inset-0 transition-colors duration-300"
            style={{ backgroundColor: getReadinessColor(readinessScore) }}
          ></div>
          
          <div className="relative z-10 h-60 flex items-center justify-center">
            <div className="relative h-full w-auto flex items-center justify-center">
              {/* Replace this with your actual image */}
              <img 
                src={maleAvatar}
                alt="Avatar" 
                className="h-full w-auto object-contain"
              />
              
              {/* Debug grid - only shown in debug mode */}
              {debugMode && (
                <div className="absolute inset-0 grid grid-cols-4 grid-rows-4">
                  {Array.from({ length: 16 }).map((_, index) => (
                    <div 
                      key={index} 
                      className="border border-blue-300 opacity-50 flex items-center justify-center text-xs text-blue-500"
                    >
                      {Math.floor(index / 4) * 25}%, {(index % 4) * 25}%
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            {/* Overlay indicators for body parts */}
            <div className="absolute inset-0">
              {bodyPartStatus.map((part) => {
                // Check if we have a mapping for this part.id
                // If we do, use it; otherwise fall back to the part's original position
                const mappedPosition = positionMap[part.id];
                
                // Create the final position style object
                const positionStyle = mappedPosition 
                  ? { top: mappedPosition.y, left: mappedPosition.x }
                  : { 
                      top: `${part.position.y / 200 * 100}%`, 
                      left: `${part.position.x / 120 * 100}%` 
                    };
                
                // Log the position being used for this part (in debug mode)
                if (debugMode) {
                  console.log(`Part ${part.id} position:`, positionStyle);
                }
                
                // Determine size and animation based on severity
                const sizeClass = part.severity > 60 ? 'w-5 h-5' : 'w-4 h-4';
                const animationClass = part.severity > 60 ? 'animate-pulse' : '';
                
                return (
                  <div key={part.id} className="absolute">
                    {/* Highlight circle */}
                    <div 
                      className={`absolute rounded-full ${sizeClass} ${animationClass} border-2 shadow-sm`}
                      style={{
                        ...positionStyle,
                        backgroundColor: `${getStatusColor(part.status)}${Math.round(part.severity / 100 * 70).toString(16).padStart(2, '0')}`,
                        borderColor: getStatusColor(part.status),
                        transform: 'translate(-50%, -50%)'
                      }}
                    />
                    
                    {/* Tooltip line */}
                    <div 
                      className="absolute h-px w-8"
                      style={{
                        ...positionStyle,
                        left: part.tooltipPosition === 'right' 
                          ? `calc(${positionStyle.left} + 0px)` 
                          : `calc(${positionStyle.left} - 32px)`,
                        backgroundColor: getStatusColor(part.status),
                        transform: 'translateY(-50%)'
                      }}
                    />
                    
                    {/* Tooltip */}
                    <div 
                      className={`absolute px-2 py-1 text-xs rounded whitespace-nowrap ${
                        part.status === 'injured' ? 'bg-red-100 text-red-800 border-red-200' :
                        part.status === 'recovering' ? 'bg-amber-100 text-amber-800 border-amber-200' :
                        'bg-green-100 text-green-800 border-green-200'
                      } border shadow-sm`}
                      style={{
                        ...positionStyle,
                        left: part.tooltipPosition === 'right' 
                          ? `calc(${positionStyle.left} + 32px)` 
                          : `calc(${positionStyle.left} - 72px)`,
                        transform: 'translateY(-50%)'
                      }}
                    >
                      {part.name}: {part.severity}%
                    </div>
                  </div>
                );
              })}
              
              {/* Heart rate indicator near the chest area */}
              <div className="absolute" style={{ left: '50%', top: '32%', transform: 'translate(-50%, -50%)' }}>
                <svg width="24" height="12" viewBox="0 0 24 12" className="animate-pulse">
                  <path 
                    d="M0,6 L4,6 L6,2 L10,10 L14,0 L18,8 L20,6 L24,6" 
                    fill="none" 
                    stroke="#EC4899" 
                    strokeWidth="1.5" 
                  />
                </svg>
              </div>
            </div>
          </div>
          
          {/* Performance level badge */}
          <div className="absolute top-2 right-2 bg-blue-600 px-2 py-1 rounded-full text-xs font-bold text-white shadow-md">
            Lvl {readinessScore}
          </div>
          
          {/* Debug toggle button */}
          <button 
            className="absolute bottom-2 right-2 text-xs bg-gray-200 px-2 py-1 rounded opacity-60 hover:opacity-100"
            onClick={() => setDebugMode(!debugMode)}
          >
            {debugMode ? 'Hide Grid' : 'Show Grid'}
          </button>
        </div>
      </div>
      
      <div className="text-center">
        <h3 className="text-xl font-bold">{readinessScore}%</h3>
        <p className="text-sm text-gray-500">Overall Readiness</p>
        
        <div className="flex items-center justify-center mt-2 text-xs">
          <span className="inline-flex items-center px-2 py-1 rounded bg-blue-100 text-blue-800 mr-2">
            <span className="mr-1">●</span> Real-time data
          </span>
          <span className="inline-flex items-center px-2 py-1 rounded bg-gray-100 text-gray-800">
            <span className="mr-1">◌</span> Simulated
          </span>
        </div>
      </div>
    </div>
  );
};

export default AvatarVisualization;