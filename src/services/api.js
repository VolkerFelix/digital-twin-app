/**
 * API service for fetching data from the server
 * 
 * This is a mock implementation that returns static data
 * In a real application, this would make actual API calls
 */

// Mock API response delay
const MOCK_DELAY = 500;

// Mock athlete data
const mockAthleteData = {
  readinessScore: 76,
  fatigueLevel: 38,
  confidenceScore: 87,
  hrvReading: 62,
  sleepData: {
    duration: 7.2,
    quality: 'Normal',
    trend: 'stable'
  },
  bodyPartStatus: [
    {
      id: 'right-shoulder',
      name: 'Shoulder',
      position: { x: 85, y: 50 },
      status: 'injured',
      severity: 68,
      tooltipPosition: 'right'
    },
    {
      id: 'left-knee',
      name: 'Knee',
      position: { x: 45, y: 160 },
      status: 'recovering',
      severity: 43,
      tooltipPosition: 'left'
    }
  ]
};

// Mock historical data
const mockHistoricalData = {
  readiness: [
    { date: '2023-04-17', value: 65 },
    { date: '2023-04-18', value: 68 },
    { date: '2023-04-19', value: 72 },
    { date: '2023-04-20', value: 74 },
    { date: '2023-04-21', value: 71 },
    { date: '2023-04-22', value: 73 },
    { date: '2023-04-23', value: 76 }
  ],
  hrv: [
    { date: '2023-04-17', value: 56 },
    { date: '2023-04-18', value: 58 },
    { date: '2023-04-19', value: 57 },
    { date: '2023-04-20', value: 59 },
    { date: '2023-04-21', value: 60 },
    { date: '2023-04-22', value: 61 },
    { date: '2023-04-23', value: 62 }
  ],
  sleep: [
    { date: '2023-04-17', duration: 6.5, quality: 'Poor' },
    { date: '2023-04-18', duration: 7.0, quality: 'Normal' },
    { date: '2023-04-19', duration: 7.5, quality: 'Good' },
    { date: '2023-04-20', duration: 7.8, quality: 'Good' },
    { date: '2023-04-21', duration: 6.8, quality: 'Normal' },
    { date: '2023-04-22', duration: 7.3, quality: 'Normal' },
    { date: '2023-04-23', duration: 7.2, quality: 'Normal' }
  ]
};

/**
 * Fetch current athlete data
 * @returns {Promise<Object>} Promise that resolves to athlete data
 */
export const fetchAthleteData = async () => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, MOCK_DELAY));
  
  // In a real app, this would be a fetch call:
  // const response = await fetch('/api/athlete/data');
  // const data = await response.json();
  
  return { ...mockAthleteData };
};

/**
 * Fetch historical athlete data
 * @returns {Promise<Object>} Promise that resolves to historical data
 */
export const fetchHistoricalData = async () => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, MOCK_DELAY));
  
  // In a real app, this would be a fetch call:
  // const response = await fetch('/api/athlete/history');
  // const data = await response.json();
  
  return { ...mockHistoricalData };
};

/**
 * Update athlete training calendar
 * @param {Object} trainingData Training session data to add to calendar
 * @returns {Promise<Object>} Promise that resolves to updated calendar
 */
export const updateTrainingCalendar = async (trainingData) => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, MOCK_DELAY));
  
  // In a real app, this would be a POST request:
  // const response = await fetch('/api/athlete/calendar', {
  //   method: 'POST',
  //   headers: {
  //     'Content-Type': 'application/json',
  //   },
  //   body: JSON.stringify(trainingData),
  // });
  // const data = await response.json();
  
  // Mock response
  return {
    success: true,
    message: 'Calendar updated successfully',
    data: {
      id: 'calendar-entry-123',
      ...trainingData
    }
  };
};

/**
 * Submit athlete feedback on recommendations
 * @param {Object} feedbackData Feedback data
 * @returns {Promise<Object>} Promise that resolves to feedback submission result
 */
export const submitFeedback = async (feedbackData) => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, MOCK_DELAY));
  
  // In a real app, this would be a POST request:
  // const response = await fetch('/api/athlete/feedback', {
  //   method: 'POST',
  //   headers: {
  //     'Content-Type': 'application/json',
  //   },
  //   body: JSON.stringify(feedbackData),
  // });
  // const data = await response.json();
  
  // Mock response
  return {
    success: true,
    message: 'Feedback submitted successfully'
  };
};

export default {
  fetchAthleteData,
  fetchHistoricalData,
  updateTrainingCalendar,
  submitFeedback
};