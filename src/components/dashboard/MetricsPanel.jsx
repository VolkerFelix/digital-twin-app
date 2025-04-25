import React from 'react';
import { Heart, Activity, Moon, BarChart2 } from 'lucide-react';
import { useDigitalTwin } from '../../hooks/useDigitalTwin';

const MetricsPanel = () => {
  const { 
    hrvReading, 
    fatigueLevel, 
    sleepData, 
    confidenceScore 
  } = useDigitalTwin();
  
  // Helper function to determine trend color
  const getTrendColor = (trend) => {
    if (trend === 'up' || trend === 'better') return 'text-green-600';
    if (trend === 'down' || trend === 'worse') return 'text-red-600';
    return 'text-yellow-600';
  };
  
  // Mock data comparisons - in a real app these would come from the context
  const hrvTrend = {
    direction: 'down',
    value: '15% from baseline',
    isPositive: false
  };
  
  const fatigueTrend = {
    direction: 'down',
    value: '12% from yesterday',
    isPositive: false
  };
  
  return (
    <div className="grid grid-cols-2 gap-3">
      <div className="p-3 border rounded-lg">
        <div className="flex items-center gap-2 mb-1">
          <Heart size={16} color="#EC4899" />
          <span className="text-sm font-medium">HRV</span>
        </div>
        <p className="text-xl font-bold">{hrvReading} ms</p>
        <div className={`mt-1 text-xs ${getTrendColor(hrvTrend.isPositive ? 'better' : 'worse')}`}>
          {hrvTrend.direction === 'up' ? '↑' : hrvTrend.direction === 'down' ? '↓' : '→'} {hrvTrend.value}
        </div>
      </div>
      
      <div className="p-3 border rounded-lg">
        <div className="flex items-center gap-2 mb-1">
          <Activity size={16} color="#8B5CF6" />
          <span className="text-sm font-medium">Fatigue</span>
        </div>
        <p className="text-xl font-bold">{fatigueLevel}%</p>
        <div className={`mt-1 text-xs ${getTrendColor(fatigueTrend.isPositive ? 'better' : 'worse')}`}>
          {fatigueTrend.direction === 'up' ? '↑' : fatigueTrend.direction === 'down' ? '↓' : '→'} {fatigueTrend.value}
        </div>
      </div>
      
      <div className="p-3 border rounded-lg">
        <div className="flex items-center gap-2 mb-1">
          <Moon size={16} color="#6366F1" />
          <span className="text-sm font-medium">Sleep Quality</span>
        </div>
        <p className="text-xl font-bold">{sleepData.duration}h</p>
        <div className={`mt-1 text-xs ${getTrendColor(sleepData.trend)}`}>
          {sleepData.trend === 'up' ? '↑' : sleepData.trend === 'down' ? '↓' : '→'} {sleepData.quality}
        </div>
      </div>
      
      <div className="p-3 border rounded-lg">
        <div className="flex items-center gap-2 mb-1">
          <BarChart2 size={16} color="#10B981" />
          <span className="text-sm font-medium">Prediction Conf.</span>
        </div>
        <p className="text-xl font-bold">{confidenceScore}%</p>
        <div className="flex w-full bg-gray-200 rounded-full h-1.5 mt-2">
          <div
            className="bg-green-600 h-1.5 rounded-full"
            style={{ width: `${confidenceScore}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default MetricsPanel;