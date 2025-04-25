import React, { useState } from 'react';
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

  return (
    <div className="flex flex-col items-center mb-6">
      <div className="relative mb-2">
        <div className="w-56 h-64 bg-white rounded-lg border border-blue-200 flex items-center justify-center overflow-hidden">
          {/* Background gradient */}
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
          
          {/* Avatar container */}
          <div className="relative z-10 h-60 w-full flex items-center justify-center">
            <div className="relative h-full w-auto flex items-center justify-center">
              {/* Avatar image */}
              <img 
                src={maleAvatar}
                alt="Avatar" 
                className="h-full w-auto object-contain"
              />
              
              {/* Debug grid */}
              {debugMode && (
                <div className="absolute inset-0 grid grid-cols-10 grid-rows-10">
                  {Array.from({ length: 100 }).map((_, index) => {
                    const row = Math.floor(index / 10);
                    const col = index % 10;
                    return (
                      <div 
                        key={index} 
                        className="border border-blue-300 opacity-50 flex items-center justify-center text-[6px] text-blue-500"
                      >
                        {col*10},{row*10}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
            
            {/* Body part indicators */}
            <div className="absolute inset-0">
              {bodyPartStatus.map((part) => {
                // Determine size and animation based on readiness
                const sizeClass = part.readiness < 40 ? 'w-5 h-5' : 'w-4 h-4';
                const animationClass = part.readiness < 40 ? 'animate-pulse' : '';
                
                return (
                  <div key={part.id} className="absolute" style={{ left: 0, top: 0, width: '100%', height: '100%' }}>
                    {/* Highlight circle */}
                    <div 
                      className={`absolute rounded-full ${sizeClass} ${animationClass} border-2 shadow-sm`}
                      style={{
                        left: `${part.position.x}%`,
                        top: `${part.position.y}%`,
                        backgroundColor: `${getStatusColor(part.status)}${Math.round(part.readiness / 100 * 70).toString(16).padStart(2, '0')}`,
                        borderColor: getStatusColor(part.status),
                        transform: 'translate(-50%, -50%)'
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
                        left: part.tooltipPosition === 'right' 
                          ? `calc(${part.position.x}% + 15px)` 
                          : `calc(${part.position.x}% - 15px)`,
                        top: `${part.position.y}%`,
                        transform: part.tooltipPosition === 'right'
                          ? 'translate(0, -50%)'
                          : 'translate(-100%, -50%)'
                      }}
                    >
                      {part.readiness}%
                    </div>

                    {/* Connecting line */}
                    <div 
                      className="absolute h-px"
                      style={{
                        top: `${part.position.y}%`,
                        left: part.tooltipPosition === 'right' 
                          ? `${part.position.x}%` 
                          : `calc(${part.position.x}% - 15px)`,
                        width: '15px',
                        backgroundColor: getStatusColor(part.status),
                        transform: 'translateY(-50%)',
                        transformOrigin: part.tooltipPosition === 'right' ? 'left' : 'right'
                      }}
                    />
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