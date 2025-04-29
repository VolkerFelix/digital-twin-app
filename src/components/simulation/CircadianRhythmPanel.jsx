import React, { useState } from 'react';
import { Clock, Moon, Sun, AlertCircle, Settings, Calendar, BarChart2 } from 'lucide-react';
import { useDigitalTwin } from '../../hooks/useDigitalTwin';
import CircadianRhythmChart from './CircadianRhythmChart';
import CircadianActivitySchedule from './CircadianActivitySchedule';
import CircadianAlignmentVisualization from './CircadianAlignmentVisualization';

const CircadianRhythmPanel = () => {
  const { 
    userChronotype, 
    circadianAlignment,
    updateChronotype,
    currentTime
  } = useDigitalTwin();
  
  const [showSettings, setShowSettings] = useState(false);
  const [activeTab, setActiveTab] = useState('chart'); // 'chart', 'schedule', 'alignment'
  
  // Format current time
  const formattedTime = currentTime?.toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit'
  }) || '9:00 AM';

  // Get chronotype display name
  const getChronotypeLabel = (type) => {
    switch (type) {
      case 'morning': return 'Early Bird';
      case 'evening': return 'Night Owl';
      default: return 'Intermediate';
    }
  };
  
  // Get alignment status display information
  const getAlignmentStatus = () => {
    switch (circadianAlignment) {
      case 'optimal':
        return {
          icon: <Sun size={16} className="text-green-600" />,
          label: 'Optimal Alignment',
          color: 'text-green-600',
          description: 'Your activities align well with your natural rhythm'
        };
      case 'moderate':
        return {
          icon: <Sun size={16} className="text-yellow-600" />,
          label: 'Moderate Alignment',
          color: 'text-yellow-600',
          description: 'Some activities could be better scheduled'
        };
      case 'misaligned':
        return {
          icon: <AlertCircle size={16} className="text-red-600" />,
          label: 'Misaligned',
          color: 'text-red-600',
          description: 'Your schedule conflicts with your natural rhythm'
        };
      default:
        return {
          icon: <Moon size={16} className="text-indigo-600" />,
          label: 'Not Analyzed',
          color: 'text-gray-600',
          description: 'Add activities to analyze alignment'
        };
    }
  };
  
  const alignment = getAlignmentStatus();
  
  // Handle chronotype change
  const handleChronotypeChange = (type) => {
    updateChronotype(type);
    setShowSettings(false);
  };
  
  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Circadian Rhythm</h2>
        
        <div className="flex items-center gap-2">
          <div className="text-sm flex items-center">
            <Clock size={14} className="mr-1" />
            <span>{formattedTime}</span>
          </div>
          
          <button 
            className={`p-1 rounded-full ${showSettings ? 'bg-indigo-100' : 'hover:bg-gray-100'}`}
            onClick={() => setShowSettings(!showSettings)}
          >
            <Settings size={16} />
          </button>
        </div>
      </div>
      
      <p className="text-sm text-gray-500 mb-4">Your natural energy peaks and dips throughout the day</p>
      
      {/* Settings panel */}
      {showSettings && (
        <div className="mb-4 p-3 border rounded-lg bg-gray-50">
          <h3 className="text-sm font-medium mb-2">Your Chronotype</h3>
          <div className="flex gap-2">
            <button
              className={`px-3 py-1 text-xs rounded-full ${userChronotype === 'morning' ? 'bg-blue-100 text-blue-700 border-blue-300' : 'bg-gray-100 border-gray-300'} border`}
              onClick={() => handleChronotypeChange('morning')}
            >
              Early Bird
            </button>
            <button
              className={`px-3 py-1 text-xs rounded-full ${userChronotype === 'intermediate' ? 'bg-purple-100 text-purple-700 border-purple-300' : 'bg-gray-100 border-gray-300'} border`}
              onClick={() => handleChronotypeChange('intermediate')}
            >
              Intermediate
            </button>
            <button
              className={`px-3 py-1 text-xs rounded-full ${userChronotype === 'evening' ? 'bg-indigo-100 text-indigo-700 border-indigo-300' : 'bg-gray-100 border-gray-300'} border`}
              onClick={() => handleChronotypeChange('evening')}
            >
              Night Owl
            </button>
          </div>
          <p className="text-xs text-gray-500 mt-2">
            Your chronotype affects when your energy peaks and dips occur
          </p>
        </div>
      )}
      
      {/* Main chart */}
      <CircadianRhythmChart />
      
      {/* View switcher */}
      <div className="flex gap-2 mt-4 mb-3">
        <button
          className={`flex-1 text-xs py-1.5 rounded-md border ${
            activeTab === 'chart' ? 'bg-indigo-50 border-indigo-200 text-indigo-700' : 'bg-gray-50 border-gray-200'
          }`}
          onClick={() => setActiveTab('chart')}
        >
          <div className="flex items-center justify-center">
            <Sun size={14} className="mr-1" />
            <span>Energy Chart</span>
          </div>
        </button>
        
        <button
          className={`flex-1 text-xs py-1.5 rounded-md border ${
            activeTab === 'schedule' ? 'bg-indigo-50 border-indigo-200 text-indigo-700' : 'bg-gray-50 border-gray-200'
          }`}
          onClick={() => setActiveTab('schedule')}
        >
          <div className="flex items-center justify-center">
            <Calendar size={14} className="mr-1" />
            <span>Schedule</span>
          </div>
        </button>
        
        <button
          className={`flex-1 text-xs py-1.5 rounded-md border ${
            activeTab === 'alignment' ? 'bg-indigo-50 border-indigo-200 text-indigo-700' : 'bg-gray-50 border-gray-200'
          }`}
          onClick={() => setActiveTab('alignment')}
        >
          <div className="flex items-center justify-center">
            <BarChart2 size={14} className="mr-1" />
            <span>Alignment</span>
          </div>
        </button>
      </div>
      
      {/* Settings panel */}
      {showSettings && (
        <div className="mb-4 p-3 border rounded-lg bg-gray-50">
          <h3 className="text-sm font-medium mb-2">Your Chronotype</h3>
          <div className="flex gap-2">
            <button
              className={`px-3 py-1 text-xs rounded-full ${userChronotype === 'morning' ? 'bg-blue-100 text-blue-700 border-blue-300' : 'bg-gray-100 border-gray-300'} border`}
              onClick={() => handleChronotypeChange('morning')}
            >
              Early Bird
            </button>
            <button
              className={`px-3 py-1 text-xs rounded-full ${userChronotype === 'intermediate' ? 'bg-purple-100 text-purple-700 border-purple-300' : 'bg-gray-100 border-gray-300'} border`}
              onClick={() => handleChronotypeChange('intermediate')}
            >
              Intermediate
            </button>
            <button
              className={`px-3 py-1 text-xs rounded-full ${userChronotype === 'evening' ? 'bg-indigo-100 text-indigo-700 border-indigo-300' : 'bg-gray-100 border-gray-300'} border`}
              onClick={() => handleChronotypeChange('evening')}
            >
              Night Owl
            </button>
          </div>
          <p className="text-xs text-gray-500 mt-2">
            Your chronotype affects when your energy peaks and dips occur
          </p>
        </div>
      )}
    </div>
  );
};

export default CircadianRhythmPanel;