import React, { useState } from 'react';
import { Calendar, Clock, Sun, Moon, Plus, Check, AlertCircle } from 'lucide-react';

const StandaloneCalendarIntegration = () => {
  const [added, setAdded] = useState({
    strategicNap: false,
    lightExposure: false,
    sleepMeasurement: false
  });
  
  const [showInfo, setShowInfo] = useState(false);

  const recommendedInterventions = [
    {
      id: 'strategicNap',
      title: 'Strategic Nap',
      day: 'Tuesday',
      time: '2:45-3:05 PM',
      description: '20-minute power nap with pre-nap caffeine for optimal effect',
      icon: <Moon size={16} className="text-indigo-600" />,
      impact: '+24% afternoon cognitive processing speed',
      color: 'bg-indigo-50 border-indigo-200'
    },
    {
      id: 'lightExposure',
      title: 'Light Exposure',
      day: 'Wednesday',
      time: '7:30-7:50 AM',
      description: 'Bright light (10,000 lux) exposure for circadian reset',
      icon: <Sun size={16} className="text-yellow-600" />,
      impact: '+1.2 hour circadian alignment',
      color: 'bg-yellow-50 border-yellow-200'
    },
    {
      id: 'sleepMeasurement',
      title: 'Sleep Measurement',
      day: 'Wednesday',
      time: '10:00 PM - 06:00 AM',
      description: 'Wear device overnight to capture sleep metrics',
      icon: <Clock size={16} className="text-blue-600" />,
      impact: '+31% prediction accuracy',
      color: 'bg-blue-50 border-blue-200'
    }
  ];

  const handleAddToCalendar = (intervention) => {
    // In a real app, this would integrate with a calendar API
    setAdded(prev => ({
      ...prev,
      [intervention.id]: true
    }));
    
    // You could add additional actions here like syncing with a calendar service
    console.log(`Added to calendar: ${intervention.title}`);
  };
  
  const getEventCount = () => {
    return Object.values(added).filter(value => value).length;
  };

  return (
    <div className="w-full bg-white p-4 rounded-lg shadow">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center">
          <Calendar size={18} className="text-indigo-600 mr-2" />
          <h2 className="text-lg font-semibold">Performance Interventions</h2>
        </div>
        
        {getEventCount() > 0 && (
          <div className="flex items-center bg-green-100 px-2 py-1 rounded-full text-green-800 text-xs">
            <Calendar size={12} className="mr-1" />
            <span>{getEventCount()} Event{getEventCount() !== 1 ? 's' : ''} Added</span>
          </div>
        )}
      </div>
      
      <div className="mb-3">
        <div className="flex justify-between items-center">
          <p className="text-sm text-gray-600">
            Add these interventions to boost cognitive performance for Thursday's board presentation
          </p>
          <button 
            className="text-indigo-600 hover:text-indigo-800"
            onClick={() => setShowInfo(!showInfo)}
          >
            <AlertCircle size={16} />
          </button>
        </div>
        
        {showInfo && (
          <div className="mt-2 p-3 bg-indigo-50 rounded-lg text-xs text-indigo-800">
            These interventions are tailored based on your digital twin model and are projected 
            to increase your cognitive performance from 62% to 85-91% with 78% confidence. The recommendations 
            account for your circadian rhythm, historical performance patterns, and current readiness metrics.
          </div>
        )}
      </div>
      
      <div className="space-y-3">
        {recommendedInterventions.map(intervention => (
          <div 
            key={intervention.id}
            className={`p-3 border rounded-lg ${intervention.color}`}
          >
            <div className="flex justify-between mb-2">
              <div className="flex items-center">
                {intervention.icon}
                <span className="ml-2 font-medium text-sm">{intervention.title}</span>
              </div>
              <div className="text-xs px-2 py-0.5 bg-white rounded-full">
                {intervention.day}
              </div>
            </div>
            
            <div className="mb-2">
              <div className="flex items-center text-xs text-gray-600 mb-1">
                <Clock size={12} className="mr-1" />
                {intervention.time}
              </div>
              <p className="text-xs">{intervention.description}</p>
            </div>
            
            <div className="flex justify-between items-center text-xs">
              <span className="text-green-700 font-medium">Impact: {intervention.impact}</span>
              
              {!added[intervention.id] ? (
                <button
                  className="flex items-center px-2 py-1 bg-indigo-600 text-white rounded-md"
                  onClick={() => handleAddToCalendar(intervention)}
                >
                  <Plus size={12} className="mr-1" />
                  Add to Calendar
                </button>
              ) : (
                <span className="flex items-center px-2 py-1 bg-green-100 text-green-800 rounded-md">
                  <Check size={12} className="mr-1" />
                  Added to Calendar
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StandaloneCalendarIntegration;