import React from 'react';
import BodyPartHighlight from './BodyPartHighlight';
import AvatarTooltip from './AvatarTooltip';
import { useDigitalTwin } from '../../hooks/useDigitalTwin';

const AvatarVisualization = () => {
  const { readinessScore, bodyPartStatus } = useDigitalTwin();

  // Helper function to determine aura color based on readiness
  const getAuraColor = (score) => {
    if (score > 70) return 'rgba(16, 185, 129, 0.1)'; // Green/Good
    if (score > 40) return 'rgba(245, 158, 11, 0.1)'; // Yellow/Warning
    return 'rgba(239, 68, 68, 0.1)'; // Red/Danger
  };

  return (
    <div className="flex flex-col items-center mb-6">
      <div className="relative mb-2">
        <div className="w-56 h-64 bg-gradient-to-b from-blue-50 to-blue-100 rounded-lg border border-blue-200 flex items-center justify-center overflow-hidden">
          {/* Game-style human avatar */}
          <svg viewBox="0 0 120 200" className="w-48">
            {/* Body outline */}
            <path 
              d="M60,20 C80,20 85,35 85,45 L85,80 C85,85 90,90 90,95 L90,140 C90,155 80,160 75,165 L75,190 C75,195 70,200 60,200 C50,200 45,195 45,190 L45,165 C40,160 30,155 30,140 L30,95 C30,90 35,85 35,80 L35,45 C35,35 40,20 60,20" 
              fill="#E2E8F0" 
              stroke="#2D3748" 
              strokeWidth="1" 
            />
            
            {/* Head */}
            <circle cx="60" cy="20" r="15" fill="#E2E8F0" stroke="#2D3748" strokeWidth="1" />
            
            {/* Face features */}
            <circle cx="55" cy="15" r="1" fill="#2D3748" />
            <circle cx="65" cy="15" r="1" fill="#2D3748" />
            <path d="M55,25 C58,28 62,28 65,25" fill="none" stroke="#2D3748" strokeWidth="1" />
            
            {/* Arms */}
            <path 
              d="M35,50 C25,55 20,70 20,80 L20,110 C20,115 25,120 30,120" 
              fill="#E2E8F0" 
              stroke="#2D3748" 
              strokeWidth="1" 
            />
            <path 
              d="M85,50 C95,55 100,70 100,80 L100,110 C100,115 95,120 90,120" 
              fill="#E2E8F0" 
              stroke="#2D3748" 
              strokeWidth="1" 
            />
            
            {/* Readiness aura */}
            <rect 
              x="15" 
              y="5" 
              width="90" 
              height="190" 
              rx="45" 
              fill={getAuraColor(readinessScore)} 
            />
            
            {/* Map through bodyPartStatus to render highlights */}
            {bodyPartStatus.map((part) => (
              <React.Fragment key={part.id}>
                {/* Highlight circle */}
                <circle 
                  cx={part.position.x} 
                  cy={part.position.y} 
                  r={part.severity > 60 ? 10 : 8}
                  fill={`rgba(${part.status === 'injured' ? '239, 68, 68' : 
                              part.status === 'recovering' ? '245, 158, 11' : 
                              '16, 185, 129'}, ${part.severity / 100 * 0.7})`}
                  stroke={part.status === 'injured' ? '#EF4444' : 
                          part.status === 'recovering' ? '#F59E0B' : 
                          '#10B981'}
                  strokeWidth="2" 
                  className={part.severity > 60 ? "animate-pulse" : ""}
                />
                
                {/* Connection line to tooltip */}
                <line 
                  x1={part.position.x + (part.tooltipPosition === 'right' ? 10 : -10)} 
                  y1={part.position.y} 
                  x2={part.position.x + (part.tooltipPosition === 'right' ? 20 : -20)} 
                  y2={part.position.y} 
                  stroke={part.status === 'injured' ? '#EF4444' : 
                          part.status === 'recovering' ? '#F59E0B' : 
                          '#10B981'} 
                  strokeWidth="1" 
                />
                
                {/* Tooltip */}
                <AvatarTooltip 
                  x={part.tooltipPosition === 'right' ? part.position.x + 25 : part.position.x - 65}
                  y={part.position.y - 10}
                  width={60}
                  height={20}
                  status={part.status}
                  bodyPart={part.name}
                  value={part.severity}
                />
              </React.Fragment>
            ))}
            
            {/* Performance indicators */}
            <circle cx="60" cy="80" r="8" 
              fill="rgba(16, 185, 129, 0.4)" 
              stroke="#10B981" 
              strokeWidth="1" 
            />
            <circle cx="60" cy="100" r="5" 
              fill="rgba(16, 185, 129, 0.3)" 
              stroke="#10B981" 
              strokeWidth="0.5" 
            />
            
            {/* Vitals indicator near heart */}
            <path 
              d="M50,65 L53,68 L56,60 L59,74 L62,67 L65,70" 
              fill="none" 
              stroke="#EC4899" 
              strokeWidth="1" 
              className="animate-pulse" 
            />
          </svg>
          
          {/* Status indicators around avatar */}
          <div className="absolute top-2 right-2 bg-blue-100 px-2 py-1 rounded text-xs font-medium text-blue-800">
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