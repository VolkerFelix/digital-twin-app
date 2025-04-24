import React from 'react';
import { Calendar, Clock } from 'lucide-react';
import { useDigitalTwin } from '../../hooks/useDigitalTwin';
import TrainingCard from './TrainingCard';
import RecoveryCard from './RecoveryCard';

const AdaptiveSuggestions = () => {
  const { recommendations, readinessScore, handleAddToCalendar } = useDigitalTwin();
  const { training, recovery } = recommendations;
  
  return (
    <div className="w-full">
      <h2 className="text-lg font-semibold mb-4">Adaptive Suggestions</h2>
      
      {/* Training suggestions */}
      <div className="mb-4">
        <h3 className="text-sm font-medium mb-2 flex items-center">
          <Calendar size={16} className="mr-1" />
          Recommended Training
        </h3>
        
        <div className="space-y-3">
          {training.map(recommendation => (
            <TrainingCard
              key={recommendation.id}
              recommendation={recommendation}
              readinessScore={readinessScore}
              onAddToCalendar={() => handleAddToCalendar(recommendation.id)}
            />
          ))}
        </div>
      </div>
      
      {/* Recovery suggestions */}
      <div>
        <h3 className="text-sm font-medium mb-2 flex items-center">
          <Clock size={16} className="mr-1" />
          Recovery Recommendations
        </h3>
        
        <div className="space-y-3">
          {recovery.map((recommendation, index) => (
            <RecoveryCard 
              key={`recovery-${index}`}
              recommendation={recommendation}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdaptiveSuggestions;