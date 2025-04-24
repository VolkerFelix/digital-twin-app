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
  Area
} from 'recharts';

const RecoveryChart = () => {
  const { recoveryProjection, readinessScore } = useDigitalTwin();
  
  // Format the data for the chart if there isn't any projection data yet
  const chartData = recoveryProjection.length > 0 
    ? recoveryProjection 
    : [
        { day: 0, label: 'Today', readiness: readinessScore, confidenceLower: readinessScore - 5, confidenceUpper: readinessScore + 5 },
        { day: 1, label: 'Tomorrow', readiness: readinessScore + 5, confidenceLower: readinessScore, confidenceUpper: readinessScore + 10 },
        { day: 2, label: 'Day 3', readiness: readinessScore + 10, confidenceLower: readinessScore + 3, confidenceUpper: readinessScore + 17 },
        { day: 3, label: 'Day 4', readiness: readinessScore + 15, confidenceLower: readinessScore + 7, confidenceUpper: readinessScore + 23 }
      ];
  
  // Custom tooltip to show confidence interval
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-2 border border-gray-200 shadow-sm rounded text-xs">
          <p className="font-medium">{payload[0].payload.label}</p>
          <p className="text-blue-600">Readiness: {payload[0].value}%</p>
          <p className="text-gray-500">
            Confidence: {payload[0].payload.confidenceLower}% - {payload[0].payload.confidenceUpper}%
          </p>
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
            left: -25, // Adjust this to make room for the Y-axis
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
          
          {/* Confidence interval area */}
          <Area 
            type="monotone" 
            dataKey="confidenceUpper" 
            stroke="none" 
            fillOpacity={0.1}
            fill="#2563eb"
          />
          <Area 
            type="monotone" 
            dataKey="confidenceLower" 
            stroke="none" 
            fillOpacity={0}
            fill="#2563eb"
          />
          
          {/* Main line */}
          <Line 
            type="monotone" 
            dataKey="readiness" 
            stroke="#2563eb" 
            strokeWidth={2}
            dot={{ r: 4, fill: "#2563eb", strokeWidth: 1, stroke: "#fff" }}
            activeDot={{ r: 6, fill: "#2563eb", strokeWidth: 1, stroke: "#fff" }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default RecoveryChart;