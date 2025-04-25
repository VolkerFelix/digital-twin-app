import React from 'react';

const BodyPartHighlight = ({ cx, cy, radius, status, readiness }) => {
  // Determine color based on status
  const getHighlightColor = (status, readiness) => {
    const alpha = readiness / 100 * 0.7; // Adjust opacity based on readiness
    
    switch (status) {
      case 'injured':
        return {
          fill: `rgba(239, 68, 68, ${alpha})`, // Red with dynamic opacity
          stroke: '#EF4444' // Solid red border
        };
      case 'recovering':
        return {
          fill: `rgba(245, 158, 11, ${alpha})`, // Yellow with dynamic opacity
          stroke: '#F59E0B' // Solid yellow border
        };
      case 'optimal':
        return {
          fill: `rgba(16, 185, 129, ${alpha})`, // Green with dynamic opacity
          stroke: '#10B981' // Solid green border
        };
      default:
        return {
          fill: `rgba(107, 114, 128, ${alpha})`, // Gray with dynamic opacity
          stroke: '#6B7280' // Solid gray border
        };
    }
  };

  const { fill, stroke } = getHighlightColor(status, readiness);
  const isPulsing = readiness > 60; // Only add pulsing animation for severe issues
  const highlightSize = readiness > 60 ? radius : radius * 0.8; // Bigger highlight for severe issues

  return (
    <circle 
      cx={cx} 
      cy={cy} 
      r={highlightSize}
      fill={fill}
      stroke={stroke}
      strokeWidth="2"
      className={isPulsing ? "animate-pulse" : ""}
    />
  );
};

export default BodyPartHighlight;