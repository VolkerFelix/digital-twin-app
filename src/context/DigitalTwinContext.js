import React, { createContext, useReducer, useContext, useEffect } from 'react';

// Initial state
const initialState = {
  readinessScore: 56,
  fatigueLevel: 68,
  confidenceScore: 78,
  hrvReading: 62,
  sleepData: {
    duration: 5.2,
    quality: 'Poor',
    trend: 'down'
  },
  bodyPartStatus: [
    {
        id: 'right-shoulder',
        name: 'Shoulder',
        position: { x: 34, y: 30 },
        status: 'optimal',
        readiness: 90,
        tooltipPosition: 'left'
    },
    {
        id: 'left-knee',
        name: 'Knee',
        position: { x: 60, y: 75 },
        status: 'recovering',
        readiness: 50,
        tooltipPosition: 'right'
    },
    {
        id: 'heart',
        name: 'Heart',
        position: { x: 50, y: 37 },
        status: 'optimal',
        readiness: 80,
        tooltipPosition: 'right'
    },
    {
        id: 'mind',
        name: 'Mind',
        position: { x: 35, y: 10 },
        status: 'injured',
        readiness: 19,
        tooltipPosition: 'left'
      }
  ],
  simulationData: {
    sleepHours: 7,
    workoutIntensity: 70,
    recoveryDays: 3,
    projectedReadiness: []
  },
  recommendations: {
    training: [
      {
        id: 'rec-1',
        title: 'High Intensity Intervals',
        impact: 'High Impact',
        description: 'Your body is ready for a challenging workout today.',
        timing: 'Today',
        isHighlighted: true
      },
      {
        id: 'rec-2',
        title: 'Strength Training',
        impact: 'Medium Impact',
        description: 'Focus on upper body to allow lower body continued recovery.',
        timing: 'Tomorrow',
        isHighlighted: false
      }
    ],
    recovery: [
      {
        id: 'rec-3',
        title: 'Optimize Sleep',
        description: 'Aim for 7-8 hours tonight.',
        tips: [
          'Avoid screens 1 hour before bed',
          'Keep room temperature at 65-68°F'
        ]
      },
      {
        id: 'rec-4',
        title: 'Nutrition Focus',
        description: 'Increase protein intake by 15% to support muscle recovery.',
        tips: []
      }
    ]
  },
  isLoading: false,
  error: null,
  cognitiveData: [
    { time: '06:00', label: '6 AM', cognitive: 45, focus: 40, memory: 50 },
    { time: '09:00', label: '9 AM', cognitive: 75, focus: 80, memory: 70 },
    { time: '12:00', label: '12 PM', cognitive: 65, focus: 60, memory: 70 },
    { time: '15:00', label: '3 PM', cognitive: 55, focus: 50, memory: 60 },
    { time: '18:00', label: '6 PM', cognitive: 70, focus: 75, memory: 65 },
    { time: '21:00', label: '9 PM', cognitive: 50, focus: 45, memory: 55 }
  ],
  cognitiveForecast: [
    { 
      day: 0, 
      date: '2025-04-27', 
      label: 'Today', 
      predicted: 65, 
      confidenceLower: 60, 
      confidenceUpper: 70,
      sleepImpact: 8.5,
      recoveryImpact: 12.0,
      nutritionImpact: 6.5
    },
    { 
      day: 1, 
      date: '2025-04-28', 
      label: 'Tomorrow', 
      predicted: 62, 
      confidenceLower: 62, 
      confidenceUpper: 74,
      sleepImpact: 9.0,
      recoveryImpact: 10.5,
      nutritionImpact: 7.0
    },
    { 
      day: 2, 
      date: '2025-04-29', 
      label: 'Tue, Apr 29', 
      predicted: 60, 
      confidenceLower: 65, 
      confidenceUpper: 79,
      sleepImpact: 9.5,
      recoveryImpact: 11.0,
      nutritionImpact: 7.5
    },
    { 
      day: 3, 
      date: '2025-04-30', 
      label: 'Weg, Apr 30', 
      predicted: 57, 
      confidenceLower: 67, 
      confidenceUpper: 83,
      sleepImpact: 10.0,
      recoveryImpact: 12.5,
      nutritionImpact: 8.0
    },
    { 
      day: 4, 
      date: '2025-05-01', 
      label: 'Thu, May 1', 
      predicted: 62, 
      confidenceLower: 70, 
      confidenceUpper: 88,
      sleepImpact: 10.5,
      recoveryImpact: 13.0,
      nutritionImpact: 8.5
    },
    { 
      day: 5, 
      date: '2025-05-02', 
      label: 'Fri, May 2', 
      predicted: 70, 
      confidenceLower: 72, 
      confidenceUpper: 92,
      sleepImpact: 11.0,
      recoveryImpact: 13.5,
      nutritionImpact: 9.0
    },
    { 
      day: 6, 
      date: '2025-05-03', 
      label: 'Sat, May 3', 
      predicted: 73, 
      confidenceLower: 74, 
      confidenceUpper: 96,
      sleepImpact: 11.5,
      recoveryImpact: 14.0,
      nutritionImpact: 9.5
    }
  ],
  
  // Replace monthly trend with simulation parameters
  cognitiveSimulation: {
    sleepQuality: 7,
    workoutIntensity: 70,
    nutritionQuality: 75,
    recoveryActivities: true,
    mentalExercises: false
  },
};

// Action types
const ActionTypes = {
  FETCH_DATA_START: 'FETCH_DATA_START',
  FETCH_DATA_SUCCESS: 'FETCH_DATA_SUCCESS',
  FETCH_DATA_ERROR: 'FETCH_DATA_ERROR',
  UPDATE_SIMULATION: 'UPDATE_SIMULATION',
  ADD_TO_CALENDAR: 'ADD_TO_CALENDAR',
  UPDATE_COGNITIVE_SIMULATION: 'UPDATE_COGNITIVE_SIMULATION'
};

// Reducer
const digitalTwinReducer = (state, action) => {
  switch (action.type) {
    case ActionTypes.FETCH_DATA_START:
      return {
        ...state,
        isLoading: true,
        error: null
      };
    case ActionTypes.FETCH_DATA_SUCCESS:
      return {
        ...state,
        ...action.payload,
        isLoading: false
      };
    case ActionTypes.FETCH_DATA_ERROR:
      return {
        ...state,
        isLoading: false,
        error: action.payload
      };
    case ActionTypes.UPDATE_SIMULATION:
      // Calculate projected readiness based on simulation parameters
      const projectedReadiness = calculateProjectedReadiness(
        state.readinessScore,
        action.payload.sleepHours,
        action.payload.workoutIntensity
      );
      
      return {
        ...state,
        simulationData: {
          ...state.simulationData,
          ...action.payload,
          projectedReadiness
        }
      };
    case ActionTypes.ADD_TO_CALENDAR:
      // Here you would add logic to update some calendar state
      // This is a placeholder
      return {
        ...state,
        recommendations: {
          ...state.recommendations,
          training: state.recommendations.training.map(rec => 
            rec.id === action.payload.id 
              ? { ...rec, addedToCalendar: true }
              : rec
          )
        }
      };
    case ActionTypes.UPDATE_COGNITIVE_SIMULATION:
        // Calculate current average cognitive score
        const baselineScore = state.cognitiveData.reduce(
          (sum, point) => sum + point.cognitive, 0
        ) / state.cognitiveData.length;
        
        // Generate new forecast based on updated parameters
        const newForecast = generateCognitiveForecast(
          baselineScore, 
          action.payload,
          30 // Generate 30 days
        );
        
        return {
          ...state,
          cognitiveSimulation: action.payload,
          cognitiveForecast: newForecast
        };
    default:
      return state;
  }
};

// Helper function to calculate projected readiness
const calculateProjectedReadiness = (currentReadiness, sleepHours, workoutIntensity) => {
  // This is a simplified algorithm - in a real app this would be more complex
  const daysToProject = 4;
  const projectedReadiness = [];
  
  let readiness = currentReadiness;
  
  for (let day = 0; day < daysToProject; day++) {
    // Sleep impact (more sleep = better recovery)
    const sleepImpact = (sleepHours - 7) * 5;
    
    // Workout impact (higher intensity = slower recovery)
    const workoutImpact = -workoutIntensity / 10;
    
    // Natural recovery tendency (bodies naturally recover over time)
    const naturalRecovery = Math.max(0, (100 - readiness) * 0.15);
    
    // Combined impact for the day
    const dailyChange = sleepImpact + workoutImpact + naturalRecovery;
    
    // Update readiness for next day (capped at 0-100)
    readiness = Math.min(100, Math.max(0, readiness + dailyChange));
    
    projectedReadiness.push({
      day: day + 1,
      readiness: Math.round(readiness),
      // Add some variance for the confidence interval
      confidenceLower: Math.round(Math.max(0, readiness - (5 + day * 2))),
      confidenceUpper: Math.round(Math.min(100, readiness + (5 + day * 2)))
    });
  }
  
  return projectedReadiness;
};

// In DigitalTwinContext.js
const generateCognitiveForecast = (currentScore, params, days = 30) => {
    const forecast = [];
    const today = new Date();
    
    let score = currentScore;
    
    for (let i = 0; i < days; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      
      // Calculate daily impacts based on parameters
      const sleepImpact = (params.sleepQuality - 6) * 1.5;
      const workoutImpact = params.workoutIntensity > 80 
        ? -((params.workoutIntensity - 80) * 0.1) 
        : (params.workoutIntensity / 100) * 2;
      const nutritionImpact = (params.nutritionQuality / 100) * 8;
      const recoveryImpact = params.recoveryActivities ? 5 : 0;
      const mentalImpact = params.mentalExercises ? 7 : 0;
      
      // Natural improvement rate (diminishing returns)
      const naturalRate = Math.max(0, (90 - score) * 0.05);
      
      // Calculate total daily change
      const dailyChange = sleepImpact + workoutImpact + nutritionImpact + 
                        recoveryImpact + mentalImpact + naturalRate;
      
      // Update score with constraints
      score = Math.min(100, Math.max(0, score + dailyChange));
      
      // Uncertainty increases with time
      const uncertainty = 2 + (i * 1.5);
      
      forecast.push({
        day: i,
        date: date.toISOString().split('T')[0],
        label: i === 0 ? 'Today' : 
               i === 1 ? 'Tomorrow' : 
               date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }),
        predicted: Math.round(score),
        confidenceLower: Math.max(0, Math.round(score - uncertainty)),
        confidenceUpper: Math.min(100, Math.round(score + uncertainty)),
        sleepImpact,
        recoveryImpact: recoveryImpact + (workoutImpact < 0 ? workoutImpact : 0),
        nutritionImpact
      });
    }
    
    return forecast;
  };

// Create context
const DigitalTwinContext = createContext();

// Provider component
export const DigitalTwinProvider = ({ children }) => {
  const [state, dispatch] = useReducer(digitalTwinReducer, initialState);
  
  const updateSimulation = (simulationParams) => {
    dispatch({
      type: ActionTypes.UPDATE_SIMULATION,
      payload: simulationParams
    });
  };
  
  const addToCalendar = (recommendationId) => {
    dispatch({
      type: ActionTypes.ADD_TO_CALENDAR,
      payload: { id: recommendationId }
    });
  };

  const updateCognitiveSimulation = (simulationParams) => {
    dispatch({
      type: ActionTypes.UPDATE_COGNITIVE_SIMULATION,
      payload: simulationParams
    });
  };
  
  // Mock initial data fetch when component mounts
  useEffect(() => {
    // In a real app, this would call fetchData()
    // For this example, we'll use the initial state
  }, []);
  
  return (
    <DigitalTwinContext.Provider 
      value={{
        ...state,
        updateSimulation,
        addToCalendar,
        updateCognitiveSimulation
      }}
    >
      {children}
    </DigitalTwinContext.Provider>
  );
};

// Custom hook to use the DigitalTwin context
export const useDigitalTwinContext = () => {
  const context = useContext(DigitalTwinContext);
  if (context === undefined) {
    throw new Error('useDigitalTwinContext must be used within a DigitalTwinProvider');
  }
  return context;
};

export default DigitalTwinContext;