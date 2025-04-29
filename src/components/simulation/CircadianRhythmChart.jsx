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
  ReferenceLine,
  ReferenceArea
} from 'recharts';
import { Sun, Moon } from 'lucide-react';

const CircadianRhythmChart = () => {
  const { circadianData, userChronotype } = useDigitalTwin();
  
  // Default 24-hour data if none is provided
  const chartData = circadianData?.length > 0 
    ? circadianData 
    : generateDefaultCircadianData(userChronotype);
  
  // Custom tooltip to show details
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-2 border border-gray-200 shadow-sm rounded text-xs">
          <p className="font-medium">{data.label}</p>
          <div className="flex items-center mt-1">
            <div 
              className="w-3 h-3 rounded-full mr-1"
              style={{ backgroundColor: getEnergyColor(data.energy) }}
            ></div>
            <p>Energy Level: {data.energy}%</p>
          </div>
          <p className="text-gray-600 text-xs mt-1">{getEnergyDescription(data.energy)}</p>
          {data.note && (
            <p className="text-indigo-600 text-xs mt-1 italic">{data.note}</p>
          )}
        </div>
      );
    }
    return null;
  };

  // Helper to get color based on energy level
  const getEnergyColor = (energy) => {
    if (energy >= 80) return '#10B981'; // Green for high energy
    if (energy >= 60) return '#60A5FA'; // Blue for good energy
    if (energy >= 40) return '#FBBF24'; // Yellow for moderate
    if (energy >= 20) return '#F97316'; // Orange for low
    return '#EF4444'; // Red for very low
  };
  
  // Helper to get description based on energy level
  const getEnergyDescription = (energy) => {
    if (energy >= 80) return 'Peak Performance';
    if (energy >= 60) return 'High Functioning';
    if (energy >= 40) return 'Moderate Energy';
    if (energy >= 20) return 'Low Energy';
    return 'Rest Period';
  };
  
  // Find optimal periods for different activities
  const findOptimalPeriods = () => {
    // Clone and sort data by energy level, descending
    const sortedData = [...chartData].sort((a, b) => b.energy - a.energy);
    
    // Get top periods for intense training
    const trainingPeriods = sortedData.slice(0, 3).map(period => period.label);
    
    // Get moderate periods good for technical work
    const technicalPeriods = sortedData
      .filter(period => period.energy >= 50 && period.energy < 75)
      .slice(0, 3)
      .map(period => period.label);
    
    // Get low periods best for recovery
    const recoveryPeriods = sortedData
      .filter(period => period.energy < 40)
      .slice(0, 3)
      .map(period => period.label);
      
    return { trainingPeriods, technicalPeriods, recoveryPeriods };
  };
  
  const optimalPeriods = findOptimalPeriods();
  
  return (
    <div className="w-full">
      <div className="h-40 mb-4">
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
            
            {/* Day/night reference areas */}
            <ReferenceArea 
              x1="6 AM" 
              x2="6 PM" 
              fill="#F0F9FF" 
              fillOpacity={0.3} 
            />
            <ReferenceArea 
              x1="6 PM" 
              x2="12 AM" 
              fill="#E0E7FF" 
              fillOpacity={0.2} 
            />
            <ReferenceArea 
              x1="12 AM" 
              x2="6 AM" 
              fill="#E0E7FF" 
              fillOpacity={0.2} 
            />
            
            {/* Optimal threshold line */}
            <ReferenceLine 
              y={70} 
              label={{ value: "Optimal", position: "insideTopRight", fontSize: 10 }}
              stroke="#6366F1" 
              strokeDasharray="3 3" 
            />
            
            {/* Main energy line */}
            <Line 
              type="monotone" 
              dataKey="energy" 
              stroke="#6366F1" 
              strokeWidth={2}
              dot={{ r: 4, fill: "#6366F1", strokeWidth: 1, stroke: "#fff" }}
              activeDot={{ r: 6, fill: "#6366F1", strokeWidth: 1, stroke: "#fff" }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
      
      {/* Optimal period recommendations */}
      <div className="grid grid-cols-3 gap-2 mb-3">
        <div className="p-2 border rounded-lg bg-green-50">
          <div className="flex items-center gap-1 mb-1">
            <Sun size={14} className="text-green-600" />
            <span className="text-xs font-medium text-green-800">Best for Training</span>
          </div>
          <div className="text-xs">
            {optimalPeriods.trainingPeriods.join(', ')}
          </div>
        </div>
        
        <div className="p-2 border rounded-lg bg-blue-50">
          <div className="flex items-center gap-1 mb-1">
            <span className="text-xs font-medium text-blue-800">Technical Work</span>
          </div>
          <div className="text-xs">
            {optimalPeriods.technicalPeriods.join(', ')}
          </div>
        </div>
        
        <div className="p-2 border rounded-lg bg-indigo-50">
          <div className="flex items-center gap-1 mb-1">
            <Moon size={14} className="text-indigo-600" />
            <span className="text-xs font-medium text-indigo-800">Recovery</span>
          </div>
          <div className="text-xs">
            {optimalPeriods.recoveryPeriods.join(', ')}
          </div>
        </div>
      </div>
      
      <div className="text-xs text-gray-500 flex justify-center">
        <div className="inline-flex items-center px-2 py-1 rounded border bg-gray-50">
          <span className="mr-1 font-medium">Chronotype:</span>
          <span>{userChronotype === 'morning' ? 'Early Bird' : 
                userChronotype === 'evening' ? 'Night Owl' : 'Intermediate'}</span>
        </div>
      </div>
    </div>
  );
};

// Helper function to generate default circadian data based on chronotype
function generateDefaultCircadianData(chronotype = 'intermediate') {
  const timePoints = [
    '12 AM', '3 AM', '6 AM', '9 AM', '12 PM', '3 PM', '6 PM', '9 PM', '12 AM'
  ];
  
  // Different energy patterns based on chronotype
  const energyPatterns = {
    morning: [15, 10, 30, 85, 70, 55, 40, 30, 15],
    intermediate: [10, 5, 40, 70, 65, 75, 60, 40, 10],
    evening: [20, 10, 25, 50, 65, 80, 85, 70, 20]
  };
  
  const pattern = energyPatterns[chronotype] || energyPatterns.intermediate;
  
  // Notes for specific times
  const timeNotes = {
    morning: {
      '6 AM': 'Natural wake-up',
      '9 AM': 'Peak performance',
      '3 PM': 'Afternoon dip',
      '9 PM': 'Ready for sleep'
    },
    intermediate: {
      '6 AM': 'Waking up',
      '3 PM': 'Second peak',
      '9 PM': 'Starting to wind down'
    },
    evening: {
      '9 AM': 'Still warming up',
      '3 PM': 'Hitting stride',
      '6 PM': 'Peak performance',
      '3 AM': 'Natural sleep period'
    }
  };
  
  const notes = timeNotes[chronotype] || {};
  
  return timePoints.map((time, index) => ({
    time,
    label: time,
    energy: pattern[index],
    note: notes[time] || null,
    activityType: getDefaultActivity(time, chronotype)
  }));
}

// Helper to assign default recommended activities
function getDefaultActivity(time, chronotype) {
  // Early bird pattern
  if (chronotype === 'morning') {
    if (time === '6 AM' || time === '9 AM') return 'training';
    if (time === '12 PM' || time === '3 PM') return 'technical';
    if (time === '6 PM' || time === '9 PM' || time === '12 AM' || time === '3 AM') return 'recovery';
  }
  
  // Night owl pattern
  if (chronotype === 'evening') {
    if (time === '3 PM' || time === '6 PM') return 'training';
    if (time === '9 AM' || time === '12 PM') return 'technical';
    if (time === '12 AM' || time === '3 AM' || time === '6 AM') return 'recovery';
  }
  
  // Intermediate pattern
  if (time === '9 AM' || time === '3 PM') return 'training';
  if (time === '12 PM' || time === '6 PM') return 'technical';
  if (time === '9 PM' || time === '12 AM' || time === '3 AM') return 'recovery';
  
  return 'neutral';
}

export default CircadianRhythmChart;