import React, { useState } from 'react';
import { useDigitalTwin } from '../../hooks/useDigitalTwin';
import { Clock, Edit, Check, X } from 'lucide-react';

const CircadianActivitySchedule = () => {
  const { 
    scheduledActivities, 
    circadianData,
    updateScheduledActivity
  } = useDigitalTwin();
  
  const [editingTime, setEditingTime] = useState(null);
  const [editForm, setEditForm] = useState({
    activity: '',
    intensity: 50
  });
  
  // Prepare merged data to display activities alongside energy levels
  const mergedTimeData = circadianData.map(timeSlot => {
    const activity = scheduledActivities.find(act => act.time === timeSlot.time) || {
      time: timeSlot.time,
      activity: 'Unscheduled',
      intensity: 0
    };
    
    return {
      ...timeSlot,
      ...activity
    };
  });
  
  // Start editing an activity
  const handleEditClick = (timeSlot) => {
    setEditingTime(timeSlot.time);
    setEditForm({
      activity: timeSlot.activity,
      intensity: timeSlot.intensity
    });
  };
  
  // Save edited activity
  const handleSaveActivity = () => {
    updateScheduledActivity({
      time: editingTime,
      activity: editForm.activity,
      intensity: parseInt(editForm.intensity)
    });
    
    setEditingTime(null);
  };
  
  // Cancel editing
  const handleCancelEdit = () => {
    setEditingTime(null);
  };
  
  // Helper to get color for energy level
  const getEnergyColor = (energy) => {
    if (energy >= 80) return 'bg-green-100 border-green-300';
    if (energy >= 60) return 'bg-blue-100 border-blue-300';
    if (energy >= 40) return 'bg-yellow-50 border-yellow-300';
    if (energy >= 20) return 'bg-orange-50 border-orange-300';
    return 'bg-red-50 border-red-300';
  };
  
  // Helper to get color for activity intensity
  const getIntensityColor = (intensity) => {
    if (intensity >= 80) return 'bg-red-100';
    if (intensity >= 60) return 'bg-orange-100';
    if (intensity >= 40) return 'bg-yellow-100';
    if (intensity >= 20) return 'bg-blue-100';
    return 'bg-gray-100';
  };
  
  // Helper to check alignment between energy and activity
  const getAlignmentStatus = (energy, intensity) => {
    // High intensity activities need high energy
    if (intensity > 70 && energy < 50) return 'poor';
    if (intensity > 70 && energy > 70) return 'excellent';
    
    // Recovery activities are good during low energy
    if (intensity < 30 && energy < 30) return 'good';
    
    // Default is moderate alignment
    return 'neutral';
  };
  
  return (
    <div className="w-full">
      <h3 className="text-sm font-medium mb-2">Daily Schedule</h3>
      
      <div className="border rounded-lg overflow-hidden">
        {mergedTimeData.map((timeSlot, index) => {
          const alignment = getAlignmentStatus(timeSlot.energy, timeSlot.intensity);
          const isEditing = editingTime === timeSlot.time;
          
          return (
            <div 
              key={timeSlot.time}
              className={`flex items-center border-b last:border-b-0 ${getEnergyColor(timeSlot.energy)}`}
            >
              {/* Time column */}
              <div className="p-2 w-16 flex-shrink-0 text-xs font-medium border-r">
                {timeSlot.time}
              </div>
              
              {/* Energy level and activity */}
              <div className="flex-grow p-2">
                {!isEditing ? (
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center">
                        <div className="text-xs font-medium">{timeSlot.activity}</div>
                        {timeSlot.intensity > 0 && (
                          <div className={`ml-2 px-1.5 py-0.5 text-xs rounded-full ${getIntensityColor(timeSlot.intensity)}`}>
                            {timeSlot.intensity}%
                          </div>
                        )}
                      </div>
                      
                      <div className="text-xs mt-0.5 text-gray-500">
                        Energy: {timeSlot.energy}%
                        {timeSlot.note && ` — ${timeSlot.note}`}
                      </div>
                    </div>
                    
                    {/* Edit button */}
                    {timeSlot.time !== '12 AM' && (
                      <button 
                        className="p-1 text-gray-500 hover:text-gray-700"
                        onClick={() => handleEditClick(timeSlot)}
                      >
                        <Edit size={14} />
                      </button>
                    )}
                  </div>
                ) : (
                  <div className="flex items-center space-x-2">
                    <input
                      type="text"
                      className="flex-grow p-1 text-xs border rounded"
                      value={editForm.activity}
                      onChange={(e) => setEditForm({...editForm, activity: e.target.value})}
                      placeholder="Activity name"
                    />
                    
                    <div className="flex items-center">
                      <span className="text-xs mr-1">Intensity:</span>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        className="w-24"
                        value={editForm.intensity}
                        onChange={(e) => setEditForm({...editForm, intensity: e.target.value})}
                      />
                      <span className="text-xs ml-1 w-8">{editForm.intensity}%</span>
                    </div>
                    
                    <div className="flex">
                      <button 
                        className="p-1 text-green-600 hover:text-green-800"
                        onClick={handleSaveActivity}
                      >
                        <Check size={14} />
                      </button>
                      <button 
                        className="p-1 text-red-600 hover:text-red-800"
                        onClick={handleCancelEdit}
                      >
                        <X size={14} />
                      </button>
                    </div>
                  </div>
                )}
              </div>
              
              {/* Alignment indicator */}
              {!isEditing && timeSlot.intensity > 0 && (
                <div className="w-3 flex-shrink-0">
                  <div 
                    className={`h-full w-full ${
                      alignment === 'excellent' ? 'bg-green-500' :
                      alignment === 'good' ? 'bg-blue-400' :
                      alignment === 'neutral' ? 'bg-gray-300' :
                      'bg-red-400'
                    }`}
                  ></div>
                </div>
              )}
            </div>
          );
        })}
      </div>
      
      <div className="mt-2 flex justify-between text-xs text-gray-500">
        <div className="flex items-center">
          <Clock size={12} className="mr-1" />
          <span>Schedule aligned with your circadian rhythm</span>
        </div>
        
        <div className="flex items-center space-x-2">
          <div className="flex items-center">
            <div className="w-2 h-2 bg-green-500 rounded-full mr-1"></div>
            <span>Excellent</span>
          </div>
          <div className="flex items-center">
            <div className="w-2 h-2 bg-red-400 rounded-full mr-1"></div>
            <span>Misaligned</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CircadianActivitySchedule;