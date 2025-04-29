import React, { useState } from 'react';
import { Calendar, Brain, TrendingUp, Moon, Activity, Apple, BookOpen } from 'lucide-react';
import { useDigitalTwin } from '../../hooks/useDigitalTwin';
import FutureCognitiveChart from './FutureCognitiveChart';

const CognitiveForecastPanel = () => {
  const { 
    cognitiveForecast, 
    cognitiveSimulation, 
    shortTermForecast, 
    longTermForecast,
    updateCognitiveSimulation
  } = useDigitalTwin();
  
  // Local state for UI purposes
  const [forecastRange, setForecastRange] = useState('7days'); // 7days, 30days
  const [simulationParams, setSimulationParams] = useState(cognitiveSimulation);
  
  const handleParamChange = (param, value) => {
    const newParams = { ...simulationParams, [param]: value };
    setSimulationParams(newParams);
    
    // Instead of just logging, actually update the simulation
    updateCognitiveSimulation(newParams);
  };
  
  // Helper to get trending icon and color
  const getTrendingInfo = (improvementRate) => {
    const rate = parseFloat(improvementRate);
    if (rate > 15) return { icon: <TrendingUp size={16} className="text-green-600" />, color: 'text-green-600' };
    if (rate > 5) return { icon: <TrendingUp size={16} className="text-blue-600" />, color: 'text-blue-600' };
    if (rate > -5) return { icon: <TrendingUp size={16} className="text-gray-600 rotate-45" />, color: 'text-gray-600' };
    return { icon: <TrendingUp size={16} className="text-red-600 rotate-90" />, color: 'text-red-600' };
  };
  
  const forecast = forecastRange === '7days' ? shortTermForecast : longTermForecast;
  const { icon: trendIcon, color: trendColor } = getTrendingInfo(forecast?.improvementRate || 0);
  
  return (
    <div className="w-full">     
      {/* Simulation Controls */}
      <div className="mb-4 p-3 border rounded-lg">
        <h3 className="text-sm font-medium mb-3">Simulation Parameters</h3>
        
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-medium mb-1">Sleep Quality</label>
            <div className="flex items-center gap-2">
              <Moon size={14} />
              <input
                type="range"
                min="4"
                max="10"
                value={simulationParams.sleepQuality}
                onChange={(e) => handleParamChange('sleepQuality', parseInt(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
              <span className="text-xs font-medium">{simulationParams.sleepQuality}h</span>
                <div className="text-xs ml-2">
                    Impact: {(simulationParams.sleepQuality - 6) * 1.5 > 0 ? '+' : ''}
                    {((simulationParams.sleepQuality - 6) * 1.5).toFixed(1)}%
                </div>
            </div>
          </div>
          
          <div>
            <label className="block text-xs font-medium mb-1">Workout Intensity</label>
            <div className="flex items-center gap-2">
              <Activity size={14} />
              <input
                type="range"
                min="10"
                max="100"
                value={simulationParams.workoutIntensity}
                onChange={(e) => handleParamChange('workoutIntensity', parseInt(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
              <span className="text-xs font-medium">{simulationParams.workoutIntensity}%</span>
                <div className="text-xs ml-2">
                    Impact: {simulationParams.workoutIntensity > 80 
                    ? '-' + (((simulationParams.workoutIntensity - 80) * 0.1)).toFixed(1) 
                    : '+' + ((simulationParams.workoutIntensity / 100) * 2).toFixed(1)}%
                </div>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="recovery-toggle"
                checked={simulationParams.recoveryActivities}
                onChange={(e) => handleParamChange('recoveryActivities', e.target.checked)}
                className="mr-2 h-4 w-4 text-indigo-600 rounded"
              />
              <label htmlFor="recovery-toggle" className="text-xs">Recovery Exercises</label>
                <div className="text-xs ml-2">
                    Impact: {simulationParams.recoveryActivities ? '+5.0%' : '+0.0%'}
                </div>
            </div>
            
            <div className="flex items-center">
              <input
                type="checkbox"
                id="mental-toggle"
                checked={simulationParams.mentalExercises}
                onChange={(e) => handleParamChange('mentalExercises', e.target.checked)}
                className="mr-2 h-4 w-4 text-indigo-600 rounded"
              />
              <label htmlFor="mental-toggle" className="text-xs">Mental Training</label>
                <div className="text-xs ml-2">
                    Impact: {simulationParams.mentalExercises ? '+7.0%' : '+0.0%'}
                </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Chart */}
      <FutureCognitiveChart timeRange={forecastRange} />
      
      {/* Insights */}
      <div className="grid grid-cols-2 gap-3 mt-4">
        {/* Projected improvement */}
        <div className="p-3 border rounded-lg">
          <div className="flex items-center gap-2 mb-1">
            <Brain size={16} className="text-indigo-600" />
            <span className="text-sm font-medium">Projected Improvement</span>
          </div>
          <div className="flex items-center">
            <span className="text-xl font-bold">+{forecastRange === '7days' ? forecast?.improvementRate : forecast?.projectedImprovement}%</span>
            <div className={`flex items-center ml-2 text-xs ${trendColor}`}>
              {trendIcon}
              <span className="ml-1">
                {forecastRange === '7days' ? 'Next 7 days' : 'Next 30 days'}
              </span>
            </div>
          </div>
        </div>
        
        {/* Optimal day/time */}
        <div className="p-3 border rounded-lg">
          <div className="flex items-center gap-2 mb-1">
            <Calendar size={16} className="text-indigo-600" />
            <span className="text-sm font-medium">Optimal Performance</span>
          </div>
          <p className="text-lg font-bold">{forecast?.bestDay.label}</p>
          <p className="text-xs text-gray-600">
            Projected peak: {forecast?.bestDay.predicted}% cognitive function
          </p>
        </div>
      </div>
      
      {/* Additional insights for 30-day forecast */}
      {forecastRange === '30days' && forecast && (
        <div className="mt-3 grid grid-cols-2 gap-3">
          <div className="p-3 border rounded-lg">
            <div className="flex items-center gap-2 mb-1">
              <TrendingUp size={16} className="text-indigo-600" />
              <span className="text-sm font-medium">Path to Optimal</span>
            </div>
            <p className="text-lg font-bold">{forecast.timeToOptimal} days</p>
            <p className="text-xs text-gray-600">
              Estimated time to reach 85% cognitive function
            </p>
          </div>
          
          <div className="p-3 border rounded-lg">
            <div className="flex items-center gap-2 mb-1">
              <Activity size={16} className="text-indigo-600" />
              <span className="text-sm font-medium">Sustainability</span>
            </div>
            <p className={`text-lg font-bold ${
              forecast.sustainabilityRisk === 'High' ? 'text-red-600' : 
              forecast.sustainabilityRisk === 'Moderate' ? 'text-yellow-600' : 
              'text-green-600'
            }`}>
              {forecast.sustainabilityRisk} Risk
            </p>
            <p className="text-xs text-gray-600">
              {forecast.sustainabilityRisk === 'High' 
                ? 'Reduce intensity to maintain long-term progress' 
                : forecast.sustainabilityRisk === 'Moderate'
                ? 'Monitor fatigue levels closely during recovery'
                : 'Current plan is well-balanced for sustainability'}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default CognitiveForecastPanel;