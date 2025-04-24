import React from 'react';

const RecoveryCard = ({ recommendation }) => {
  const { title, description, tips } = recommendation;
  
  return (
    <div className="p-3 border rounded-lg">
      <span className="font-medium text-sm block mb-1">{title}</span>
      <p className="text-xs text-gray-600">
        {description}
      </p>
      {tips && tips.length > 0 && (
        <ul className="text-xs text-gray-600 list-disc pl-4 mt-1">
          {tips.map((tip, index) => (
            <li key={index}>{tip}</li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default RecoveryCard;