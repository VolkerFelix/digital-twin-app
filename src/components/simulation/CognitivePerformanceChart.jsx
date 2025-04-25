import React from 'react';
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
  ReferenceLine
} from 'recharts';

const CognitivePerformanceChart = () => {
  const { cognitiveData } = useDigitalTwin();
  
  // Format the data for the chart if there isn't any cognitive data yet
  const chartData = cognitiveData?.length > 0 
    ? cognitiveData 
    : [
        { time: '06:00', label: '6 AM', cognitive: 45, focus: 40, memory: 50 },
        { time: '09:00', label: '9 AM', cognitive: 75, focus: 80, memory: 70 },
        { time: '12:00', label: '12 PM', cognitive: 65, focus: 60, memory: 70 },
        { time: '15:00', label: '3 PM', cognitive: 55, focus: 50, memory: 60 },
        { time: '18:00', label: '6 PM', cognitive: 70, focus: 75, memory: 65 },
        { time: '21:00', label: '9 PM', cognitive: 50, focus: 45, memory: 55 }
      ];
  
  // Custom tooltip to show cognitive metrics
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-2 border border-gray-200 shadow-sm rounded text-xs">
          <p className="font-medium">{payload[0].payload.label}</p>
          <p className="text-indigo-600">Overall: {payload[0].value}%</p>
          <p className="text-blue-600">Focus: {payload[0].payload.focus}%</p>
          <p className="text-purple-600">Memory: {payload[0].payload.memory}%</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="h-40 mb-4 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={chartData}
          margin={{
            top: 5,
            right: 5,
            left: -25,
            bottom: 5,
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
          
          {/* Main line for overall cognitive performance */}
          <Line 
            type="monotone" 
            dataKey="cognitive" 
            stroke="#6366F1" 
            strokeWidth={2}
            dot={{ r: 4, fill: "#6366F1", strokeWidth: 1, stroke: "#fff" }}
            activeDot={{ r: 6, fill: "#6366F1", strokeWidth: 1, stroke: "#fff" }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default CognitivePerformanceChart;