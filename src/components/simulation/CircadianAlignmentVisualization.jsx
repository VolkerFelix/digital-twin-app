import React from 'react';
import { useDigitalTwin } from '../../hooks/useDigitalTwin';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  ReferenceLine 
} from 'recharts';

const CircadianAlignmentVisualization = () => {
  const { circadianData, scheduledActivities } = useDigitalTwin();
  
  // Prepare data for visualization
  const prepareChartData = () => {
    if (!circadianData?.length || !scheduledActivities?.length) {
      return [];
    }
    
    return circadianData.map(timeSlot => {
      const scheduledActivity = scheduledActivities.find(
        activity => activity.time === timeSlot.time
      ) || { activity: 'None', intensity: 0 };
      
      // Calculate alignment score
      let alignmentScore = 0;
      
      // High energy + high intensity = good alignment (+2)
      if (timeSlot.energy >= 70 && scheduledActivity.intensity >= 70) {
        alignmentScore = 2;
      } 
      // Low energy + recovery activity = good alignment (+1)
      else if (timeSlot.energy <= 40 && scheduledActivity.intensity <= 30) {
        alignmentScore = 1;
      }
      // High energy + low intensity = underutilized (-1)
      else if (timeSlot.energy >= 70 && scheduledActivity.intensity <= 30) {
        alignmentScore = -1;
      }
      // Low energy + high intensity = poor alignment (-2)
      else if (timeSlot.energy <= 40 && scheduledActivity.intensity >= 70) {
        alignmentScore = -2;
      }
      
      return {
        time: timeSlot.time,
        energy: timeSlot.energy,
        activity: scheduledActivity.activity,
        intensity: scheduledActivity.intensity,
        alignmentScore
      };
    });
  };
  
  const chartData = prepareChartData();
  
  // Custom tooltip
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      const alignmentText = 
        data.alignmentScore === 2 ? "Excellent Alignment" :
        data.alignmentScore === 1 ? "Good Alignment" :
        data.alignmentScore === -1 ? "Underutilized Energy" :
        data.alignmentScore === -2 ? "Poor Alignment" :
        "Neutral";
      
      const alignmentColor = 
        data.alignmentScore === 2 ? "text-green-600" :
        data.alignmentScore === 1 ? "text-blue-600" :
        data.alignmentScore === -1 ? "text-yellow-600" :
        data.alignmentScore === -2 ? "text-red-600" :
        "text-gray-600";
      
      return (
        <div className="bg-white p-2 border border-gray-200 shadow-sm rounded text-xs">
          <p className="font-medium">{data.time}</p>
          <div className="grid grid-cols-2 gap-x-3 gap-y-1 mt-1">
            <p>Energy: {data.energy}%</p>
            <p>Activity: {data.activity}</p>
            <p>Intensity: {data.intensity}%</p>
            <p className={alignmentColor}>{alignmentText}</p>
          </div>
        </div>
      );
    }
    return null;
  };
  
  // Get bar color based on alignment score
  const getBarColor = (score) => {
    if (score === 2) return "#10B981"; // Green - excellent
    if (score === 1) return "#60A5FA"; // Blue - good
    if (score === -1) return "#FBBF24"; // Yellow - warning
    if (score === -2) return "#EF4444"; // Red - poor
    return "#9CA3AF"; // Gray - neutral
  };
  
  return (
    <div className="h-60 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={chartData}
          margin={{ top: 10, right: 10, left: -20, bottom: 10 }}
        >
          <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
          <XAxis 
            dataKey="time" 
            tick={{ fontSize: 10 }}
            tickMargin={5}
          />
          <YAxis 
            tick={{ fontSize: 10 }}
            tickCount={5}
            ticks={[-2, -1, 0, 1, 2]}
            tickFormatter={(value) => {
              if (value === 2) return "Excellent";
              if (value === 1) return "Good";
              if (value === 0) return "Neutral";
              if (value === -1) return "Warning";
              if (value === -2) return "Poor";
              return "";
            }}
          />
          <Tooltip content={<CustomTooltip />} />
          <ReferenceLine y={0} stroke="#666" strokeWidth={1} />
          
          <Bar 
            dataKey="alignmentScore" 
            fill="#60A5FA"
            fillOpacity={0.8}
            isAnimationActive={true}
            animationDuration={500}
            // Use different colors based on alignment score
            {...{
              fill: "#60A5FA", // Default color
              onMouseEnter: (data, index) => {},
              // Custom shape to provide different colors
              shape: (props) => {
                const { x, y, width, height, alignmentScore } = props;
                const fill = getBarColor(alignmentScore);
                const barHeight = Math.abs(height);
                const barY = alignmentScore >= 0 ? y : y - height;
                
                return (
                  <rect
                    x={x}
                    y={barY}
                    width={width}
                    height={barHeight}
                    fill={fill}
                    radius={[2, 2, 0, 0]}
                  />
                );
              }
            }}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default CircadianAlignmentVisualization;