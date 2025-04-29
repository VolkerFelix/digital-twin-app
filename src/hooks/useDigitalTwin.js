import { useEffect, useState } from 'react';
import { useDigitalTwinContext } from '../context/DigitalTwinContext';

/**
 * Custom hook that provides processed data and functionality for the digital twin
 * interface components. This hook abstracts away the complexity of working with 
 * the raw context data.
 */
export const useDigitalTwin = () => {
  const context = useDigitalTwinContext();
  const [recoveryProjection, setRecoveryProjection] = useState([]);
  
  const {
    readinessScore,
    fatigueLevel,
    confidenceScore,
    hrvReading,
    sleepData,
    bodyPartStatus,
    simulationData,
    recommendations,
    cognitiveData,
    cognitiveForecast,
    cognitiveSimulation, 
    updateSimulation,
    addToCalendar,
    updateCognitiveSimulation,
    userChronotype,
    circadianAlignment,
    circadianData,
    scheduledActivities,
    currentTime,
    updateChronotype,
    updateScheduledActivity,
    analyzeAlignment
  } = context;

// Add function to analyze short-term cognitive projection (next 7 days)
const analyzeShortTermForecast = () => {
  if (!cognitiveForecast || cognitiveForecast.length === 0) return null;
  
  const sevenDayData = cognitiveForecast.slice(0, 7);
  
  // Find days with highest and lowest predicted performance
  const bestDay = [...sevenDayData].sort((a, b) => b.predicted - a.predicted)[0];
  const worstDay = [...sevenDayData].sort((a, b) => a.predicted - b.predicted)[0];
  
  // Calculate improvement rate
  const startValue = sevenDayData[0].predicted;
  const endValue = sevenDayData[sevenDayData.length - 1].predicted;
  const improvementRate = ((endValue - startValue) / startValue) * 100;
  
  // Identify key impact factors
  const averageSleepImpact = sevenDayData.reduce((sum, day) => sum + day.sleepImpact, 0) / sevenDayData.length;
  const averageRecoveryImpact = sevenDayData.reduce((sum, day) => sum + day.recoveryImpact, 0) / sevenDayData.length;
  const averageNutritionImpact = sevenDayData.reduce((sum, day) => sum + day.nutritionImpact, 0) / sevenDayData.length;
  
  // Determine top factor
  const impacts = [
    { name: 'Sleep', value: averageSleepImpact },
    { name: 'Recovery', value: averageRecoveryImpact },
    { name: 'Nutrition', value: averageNutritionImpact }
  ];
  
  const topFactor = impacts.sort((a, b) => b.value - a.value)[0];
  
  return {
    startPerformance: startValue,
    endPerformance: endValue,
    improvementRate: improvementRate.toFixed(1),
    bestDay,
    worstDay,
    isPeakAhead: bestDay.day > 0,
    topFactor
  };
};

// Add function to analyze long-term cognitive projection (next 30 days)
const analyzeLongTermForecast = () => {
  // In a real implementation, this would analyze the full 30 days of forecast data
  // For now, we'll just extend the 7-day analysis
  
  const shortTerm = analyzeShortTermForecast();
  if (!shortTerm) return null;
  
  // Extrapolate the trend for longer term
  const projectedImprovement = shortTerm.improvementRate * 4; // Simplified 30-day projection
  
  return {
    ...shortTerm,
    projectedImprovement: projectedImprovement.toFixed(1),
    sustainabilityRisk: projectedImprovement > 50 ? 'High' : projectedImprovement > 25 ? 'Moderate' : 'Low',
    estimatedPeak: Math.min(100, Math.round(shortTerm.endPerformance + (shortTerm.endPerformance - shortTerm.startPerformance))),
    timeToOptimal: Math.ceil((85 - shortTerm.startPerformance) / ((shortTerm.endPerformance - shortTerm.startPerformance) / 7))
  };
};

  // Calculate status color based on readiness
  const getReadinessColor = () => {
    if (readinessScore > 70) return '#10B981'; // Green
    if (readinessScore > 40) return '#F59E0B'; // Yellow
    return '#EF4444'; // Red
  };

  // Calculate recovery time based on current parameters
  const calculateRecoveryTime = () => {
    const { sleepHours, workoutIntensity } = simulationData;
    return Math.max(1, Math.ceil(4 - (sleepHours - 6) * 0.5 + workoutIntensity/40));
  };

  // Set up derived recovery projection data when simulation parameters change
  useEffect(() => {
    if (simulationData.projectedReadiness?.length > 0) {
      const processedData = simulationData.projectedReadiness.map((day, index) => ({
        day: index,
        label: index === 0 ? 'Today' : index === 1 ? 'Tomorrow' : `Day ${index + 1}`,
        readiness: day.readiness,
        confidenceLower: day.confidenceLower,
        confidenceUpper: day.confidenceUpper
      }));
      
      setRecoveryProjection(processedData);
    }
  }, [simulationData]);

  // Handle sleep setting changes
  const handleSleepChange = (hours) => {
    updateSimulation({
      ...simulationData,
      sleepHours: hours
    });
  };

  // Handle intensity setting changes
  const handleIntensityChange = (intensity) => {
    updateSimulation({
      ...simulationData,
      workoutIntensity: intensity
    });
  };

  // Get recommended actions based on current state
  const getRecommendedActions = () => {
    const urgentIssues = bodyPartStatus.filter(part => part.status === 'injured' && part.severity > 60);
    
    if (urgentIssues.length > 0) {
      return {
        priority: 'rest',
        message: `Focus on recovery for your ${urgentIssues[0].name.toLowerCase()}.`
      };
    }
    
    if (readinessScore < 50) {
      return {
        priority: 'light',
        message: 'Stick to light training today to improve recovery.'
      };
    }
    
    return {
      priority: 'normal',
      message: 'Your body is ready for a regular training session.'
    };
  };

  // Handle adding a recommendation to calendar
  const handleAddToCalendar = (recommendationId) => {
    addToCalendar(recommendationId);
    // Could add additional UI feedback here
  };
  
  return {
    // Raw data
    readinessScore,
    fatigueLevel,
    confidenceScore,
    hrvReading,
    sleepData,
    bodyPartStatus,
    simulationData,
    recommendations,
    cognitiveData,
    cognitiveForecast,
    cognitiveSimulation,
    
    // Derived data
    readinessColor: getReadinessColor(),
    recoveryTime: calculateRecoveryTime(),
    recoveryProjection,
    recommendedActions: getRecommendedActions(),
    shortTermForecast: analyzeShortTermForecast(),
    longTermForecast: analyzeLongTermForecast(),
    
    // Actions
    handleSleepChange,
    handleIntensityChange,
    handleAddToCalendar,
    updateCognitiveSimulation
  };
};

export default useDigitalTwin;