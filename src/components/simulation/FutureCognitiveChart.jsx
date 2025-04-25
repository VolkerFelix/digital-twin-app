import React, { useState } from 'react';
import { useDigitalTwin } from '../../hooks/useDigitalTwin';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  ReferenceLine,
  Area,
  Brush
} from 'recharts';

const FutureCognitiveChart = ({ timeRange = '7days' }) => {
  const { cognitiveForecast } = useDigitalTwin();
  const [activeDomain, setActiveDomain] = useState(null);
  
  // Select data based on timeRange
  const getChartData = () => {
    if (!cognitiveForecast) {
      return generateDefaultData(timeRange);
    }
    
    return timeRange === '7days' 
      ? cognitiveForecast.slice(0, 7) 
      : cognitiveForecast;
  };
  
  // Generate default data if no forecast available
  const generateDefaultData = (range) => {
    const days = range === '7days' ? 7 : 30;
    const today = new Date();
    const data = [];
    
    // Starting with a baseline value
    let baseValue = 65;
    
    for (let i = 0; i < days; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      
      // Add some natural variation (with a slight upward trend for improvement)
      const variation = Math.sin(i * 0.5) * 8 + (i * 0.2);
      const predicted = Math.min(95, Math.max(40, Math.round(baseValue + variation)));
      const confidence = 10 - Math.min(6, i * 0.2); // Confidence decreases with time
      
      data.push({
        day: i,
        date: date.toISOString().split('T')[0],
        label: i === 0 ? 'Today' : 
               i === 1 ? 'Tomorrow' : 
               date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }),
        predicted,
        confidenceLower: Math.max(0, predicted - confidence),
        confidenceUpper: Math.min(100, predicted + confidence),
        sleepImpact: 8 + (Math.random() * 4 - 2),
        recoveryImpact: 10 + (Math.random() * 6 - 3),
        nutritionImpact: 6 + (Math.random() * 4 - 2)
      });
    }
    
    return data;
  };
  
  const chartData = getChartData();
  
  // Custom tooltip to show cognitive metrics
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-3 border border-gray-200 shadow-sm rounded text-xs">
          <p className="font-medium">{data.label}</p>
          <div className="mt-1">
            <p className="text-indigo-600 font-medium">Predicted: {data.predicted}%</p>
            <p className="text-gray-600">Confidence Range: {data.confidenceLower}% - {data.confidenceUpper}%</p>
          </div>
          <div className="mt-2 border-t pt-2">
            <p className="font-medium text-gray-700 mb-1">Impact Factors:</p>
            <div className="grid grid-cols-2 gap-x-4 gap-y-1">
              <p className="text-blue-600">Sleep: {data.sleepImpact > 0 ? '+' : ''}{data.sleepImpact.toFixed(1)}</p>
              <p className="text-green-600">Recovery: {data.recoveryImpact > 0 ? '+' : ''}{data.recoveryImpact.toFixed(1)}</p>
              <p className="text-amber-600">Nutrition: {data.nutritionImpact > 0 ? '+' : ''}{data.nutritionImpact.toFixed(1)}</p>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  // Handle brush change to update active domain
  const handleBrushChange = (domain) => {
    if (domain && domain.startIndex !== undefined && domain.endIndex !== undefined) {
      setActiveDomain(domain);
    } else {
      setActiveDomain(null);
    }
  };

  return (
    <div className="h-60 mb-4 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={chartData}
          margin={{
            top: 10,
            right: 5,
            left: -20,
            bottom: 20,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
          <XAxis 
            dataKey="label" 
            tick={{ fontSize: 10 }}
            tickMargin={5}
          />
          <YAxis 
            domain={[0, 100]} 
            tick={{ fontSize: 10 }}
            tickCount={5}
            tickFormatter={(value) => `${value}%`}
          />
          <Tooltip content={<CustomTooltip />} />
          <ReferenceLine 
            y={70} 
            label={{ value: "Optimal", position: "insideTopRight", fontSize: 10 }}
            stroke="#6366F1" 
            strokeDasharray="3 3" 
          />
          
          {/* Confidence interval area */}
          <Area 
            type="monotone" 
            dataKey="confidenceUpper" 
            fillOpacity={0.1}
            stroke="none"
            fill="#6366F1"
          />
          <Area 
            type="monotone" 
            dataKey="confidenceLower" 
            fillOpacity={0}
            stroke="none"
            fill="#6366F1"
          />
          
          {/* Main prediction line */}
          <Line 
            type="monotone" 
            dataKey="predicted" 
            stroke="#6366F1" 
            strokeWidth={2}
            dot={{ r: 4, fill: "#6366F1", strokeWidth: 1, stroke: "#fff" }}
            activeDot={{ r: 6, fill: "#6366F1", strokeWidth: 1, stroke: "#fff" }}
            // Add smooth transitions when data changes
            isAnimationActive={true}
            animationDuration={500}
            animationEasing="ease-in-out"
          />
          
          {timeRange === '30days' && (
            <Brush 
              dataKey="label" 
              height={20}
              stroke="#6366F1"
              onChange={handleBrushChange}
              startIndex={0}
              endIndex={6}
            />
          )}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default FutureCognitiveChart;