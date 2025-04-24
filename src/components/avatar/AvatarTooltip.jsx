import React from 'react';

const AvatarTooltip = ({ x, y, width, height, status, bodyPart, value }) => {
  // Determine color scheme based on status
  const getColorScheme = (status) => {
    switch (status) {
      case 'injured':
        return {
          bgColor: '#FEE2E2', // Light red
          textColor: '#991B1B' // Dark red
        };
      case 'recovering':
        return {
          bgColor: '#FEF3C7', // Light yellow
          textColor: '#92400E' // Dark amber
        };
      case 'optimal':
        return {
          bgColor: '#D1FAE5', // Light green
          textColor: '#065F46' // Dark green
        };
      default:
        return {
          bgColor: '#E5E7EB', // Light gray
          textColor: '#1F2937' // Dark gray
        };
    }
  };

  const { bgColor, textColor } = getColorScheme(status);

  // Format text based on status
  const getTooltipText = () => {
    switch (status) {
      case 'injured':
        return `${bodyPart} Strain: ${value}%`;
      case 'recovering':
        return `${bodyPart}: Recovering ${value}%`;
      case 'optimal':
        return `${bodyPart}: Optimal ${value}%`;
      default:
        return `${bodyPart}: ${value}%`;
    }
  };

  return (
    <>
      <rect 
        x={x} 
        y={y} 
        width={width} 
        height={height} 
        rx="5" 
        fill={bgColor} 
        className="avatarTooltip" 
      />
      <text 
        x={x + 5} 
        y={y + 13} 
        fontSize="7" 
        fill={textColor}
      >
        {getTooltipText()}
      </text>
    </>
  );
};

export default AvatarTooltip;