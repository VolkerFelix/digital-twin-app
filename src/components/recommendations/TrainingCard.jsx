import React from 'react';

const TrainingCard = ({ recommendation, readinessScore, onAddToCalendar }) => {
  const { title, impact, description, timing, isHighlighted, addedToCalendar } = recommendation;
  
  // Determine the color scheme based on readiness and if card is highlighted
  const getCardStyle = () => {
    if (isHighlighted) {
      if (readinessScore > 70) {
        return "bg-green-50 border-green-200";
      } else {
        return "bg-yellow-50 border-yellow-200";
      }
    }
    return "";
  };
  
  return (
    <div className={`p-3 border rounded-lg ${getCardStyle()}`}>
      <div className="flex justify-between mb-1">
        <span className="font-medium text-sm">{title}</span>
        <span className="text-xs px-2 py-0.5 rounded bg-white">
          {impact}
        </span>
      </div>
      <p className="text-xs text-gray-600">
        {description}
      </p>
      {timing && timing !== 'Today' && (
        <div className="mt-1">
          <span className="text-xs px-2 py-0.5 rounded bg-gray-100">{timing}</span>
        </div>
      )}
      {(isHighlighted || timing === 'Today') && !addedToCalendar && (
        <div className="mt-2">
          <button 
            className="w-full px-2 py-1 bg-blue-600 text-white text-xs rounded"
            onClick={onAddToCalendar}
          >
            Add to Calendar
          </button>
        </div>
      )}
      {addedToCalendar && (
        <div className="mt-2">
          <span className="text-xs px-2 py-0.5 rounded bg-blue-100 text-blue-700">
            Added to calendar
          </span>
        </div>
      )}
    </div>
  );
};

export default TrainingCard;