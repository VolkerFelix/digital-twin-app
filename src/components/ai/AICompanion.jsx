import React, { useState, useRef, useEffect, useContext } from 'react';
import { Send, Bot, User, ThumbsUp, ThumbsDown, MoreHorizontal, Mic, Sparkles, Calendar } from 'lucide-react';
import DigitalTwinContext from '../../context/DigitalTwinContext';

// Helper function to format message text with markdown-like styling
const formatMessageText = (text) => {
    // Process bold text
    let formattedText = text.replace(/\*\*(.*?)\*\*/g, '<span class="font-bold text-indigo-800">$1</span>');
    
    // Process bullet points
    formattedText = formattedText.replace(/^\* (.*?)$/gm, '<div class="flex mb-1"><span class="mr-2 text-indigo-600">•</span><span>$1</span></div>');
    
    // Process numbered lists with proper indentation
    formattedText = formattedText.replace(/^(\d+)\. (.*?)$/gm, '<div class="flex mb-2"><span class="mr-2 font-medium text-indigo-700">$1.</span><span>$2</span></div>');
    
    // Process nested bullet points and numbered items (for indentation)
    formattedText = formattedText.replace(/^   \* (.*?)$/gm, '<div class="flex mb-1 pl-4"><span class="mr-2 text-indigo-500">•</span><span>$1</span></div>');
    
    // Create sections with better visual separation
    formattedText = formattedText.replace(/(<span class="font-bold.*?>.*?<\/span>)/g, '<div class="mb-2 pb-1 border-b border-indigo-100">$1</div>');
    
    // Split into paragraphs
    formattedText = formattedText.split('\n\n').map(para => 
      `<div class="mb-3">${para}</div>`
    ).join('');
    
    // Replace single newlines with breaks (within paragraphs)
    formattedText = formattedText.replace(/\n(?!<\/div>)/g, '<br />');
    
    return formattedText;
  };

const initialText = `Sarah, your cognitive performance is projected at 62% for Thursday's board presentation. 
    Two targeted interventions can increase this to 85-91% with an estimated 78% confidence level.\n
    64% of high-performing executives utilize similar protocols before critical presentations. Your historical data indicates these specific interventions align with your peak cognitive performance patterns from Q4 presentations.\nAdditional details available on request. Would you like the detailed protocol for Wednesday's pre-sleep optimization?`;

const AICompanion = () => {
  const digitalTwinContext = useContext(DigitalTwinContext);
  const { readinessScore, fatigueLevel, hrvReading, sleepData } = digitalTwinContext;
  const [messages, setMessages] = useState([
    {
      id: '1',
      sender: 'bot',
      text: initialText,
      timestamp: new Date()
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [suggestedQuestions, setSuggestedQuestions] = useState([
    "Tell me about the Wednesday pre-sleep protocol",
    "How can I maximize my HRV recovery?",
    "What's the science behind the strategic nap?",
    "Will these interventions affect my physical training?"
  ]);
  const [showCalendarIntegration, setShowCalendarIntegration] = useState(false);
  const [calendarEvents, setCalendarEvents] = useState([]);
  const messagesEndRef = useRef(null);

  // Simulate bot response
  const simulateBotResponse = (userMessage) => {
    setIsTyping(true);
    
    // Simulate typing delay
    setTimeout(() => {
      let response = '';
      
      // Check for calendar-related requests
      if (userMessage.toLowerCase().includes('add to calendar') || 
          userMessage.toLowerCase().includes('schedule nap') ||
          userMessage.toLowerCase().includes('light exposure') ||
          userMessage.toLowerCase().includes('interventions')) {
        setShowCalendarIntegration(true);
        response = "I've prepared the recommended interventions for you to add to your calendar. You can add them individually using the buttons below:";
      }
      // Simple pattern matching for demo purposes
      else if (userMessage.toLowerCase().includes('training today') || 
          userMessage.toLowerCase().includes('workout') ||
          userMessage.toLowerCase().includes('exercise')) {
        if (readinessScore < 40) {
          response = `Based on your current readiness score of ${readinessScore}%, I'd recommend focusing on recovery today. Your HRV reading of ${hrvReading}ms is below your baseline, suggesting that your body needs rest.`;
        } else if (readinessScore < 70) {
          response = `Your readiness score is ${readinessScore}%, which means moderate intensity training is appropriate. Consider a technical session rather than high intensity work. Focus on form and skill development.`;
        } else {
          response = `With a readiness score of ${readinessScore}%, your body is primed for a quality training session! Your HRV is looking good at ${hrvReading}ms, so you can push the intensity today.`;
        }
      } else if (userMessage.toLowerCase().includes('recovery') || 
                userMessage.toLowerCase().includes('rest')) {
        response = `For optimal recovery, I recommend:\n\n1. Prioritize sleep quality (aim for 8+ hours)\n2. Stay hydrated and focus on anti-inflammatory foods\n3. Consider contrast therapy (alternating hot/cold)\n4. Gentle mobility work\n\nYour current fatigue level is ${fatigueLevel}%, so active recovery would be beneficial.`;
      } else if (userMessage.toLowerCase().includes('high intensity') || 
                userMessage.toLowerCase().includes('hard workout')) {
        const daysToReady = Math.max(1, Math.round((100 - readinessScore) / 15));
        response = `Based on your current metrics, I estimate you'll be ready for high intensity training in approximately ${daysToReady} day(s). Your body is currently at ${readinessScore}% readiness.`;
      } else if (userMessage.toLowerCase().includes('sleep')) {
        if (sleepData.quality === 'Poor') {
          response = `Your sleep quality has been ${sleepData.quality.toLowerCase()} recently at ${sleepData.duration}h per night. This is likely impacting your recovery and performance. I'd recommend focusing on sleep hygiene: consistent bedtime, limiting screen time before bed, and keeping your room cool and dark.`;
        } else {
          response = `You're averaging ${sleepData.duration}h of sleep with ${sleepData.quality.toLowerCase()} quality. To optimize recovery, aim for 7-9 hours of quality sleep. Even a 5% improvement in sleep quality can significantly boost performance and recovery.`;
        }
      } else {
        response = "I'm here to help you optimize your training and recovery. Could you clarify what specific aspect you'd like guidance on? I can analyze your readiness, recommend recovery strategies, or help with training adjustments.";
      }
      
      // Add bot message
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        sender: 'bot',
        text: response,
        timestamp: new Date()
      }]);
      
      setIsTyping(false);
      
      // Update suggested questions based on the conversation
      updateSuggestedQuestions(userMessage);
    }, 1500);
  };

  // Update suggested questions based on conversation context
  const updateSuggestedQuestions = (lastMessage) => {
    if (lastMessage.toLowerCase().includes('calendar') || lastMessage.toLowerCase().includes('interventions')) {
      setSuggestedQuestions([
        "Tell me more about the strategic nap",
        "Why is light exposure important?",
        "Can I customize these times?",
        "Add these to my calendar"
      ]);
    }
    else if (lastMessage.toLowerCase().includes('training') || lastMessage.toLowerCase().includes('workout')) {
      setSuggestedQuestions([
        "Should I focus on strength or cardio?",
        "How do I adjust intensity based on fatigue?",
        "What's the optimal training duration today?",
        "When will I be ready for high intensity?"
      ]);
    } else if (lastMessage.toLowerCase().includes('recovery')) {
      setSuggestedQuestions([
        "What foods help with recovery?",
        "How can I improve my sleep quality?",
        "Should I try cold therapy?",
        "Can you recommend recovery exercises?"
      ]);
    } else if (lastMessage.toLowerCase().includes('sleep')) {
      setSuggestedQuestions([
        "How does sleep affect performance?",
        "What's the ideal sleep duration for me?",
        "Tips for better sleep quality?",
        "Should I track my sleep cycles?"
      ]);
    } else {
      setSuggestedQuestions([
        "How should I adjust my training today?",
        "What recovery methods do you recommend?",
        "How can I improve my HRV score?",
        "Is my sleep quality affecting my performance?"
      ]);
    }
  };

  // Handle sending a message
  const handleSendMessage = () => {
    if (inputText.trim() === '') return;
    
    // Add user message
    const userMessage = {
      id: Date.now().toString(),
      sender: 'user',
      text: inputText,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    
    // Generate bot response
    simulateBotResponse(inputText);
  };

  // Handle suggested question click
  const handleSuggestedQuestion = (question) => {
    const userMessage = {
      id: Date.now().toString(),
      sender: 'user',
      text: question,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    
    // Generate bot response
    simulateBotResponse(question);
  };

  // Handle key press (Enter to send)
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="w-full h-full flex flex-col" style={{ height: '900px' }}>
      <div className="px-1 py-2 border-b flex justify-between items-center">
        <div className="flex items-center">
          <Bot size={18} className="text-indigo-600 mr-2" />
          <h2 className="text-lg font-semibold">AI Companion</h2>
        </div>
      </div>
      
      {/* Messages container */}
      <div className="flex-grow overflow-y-auto p-3 space-y-3 bg-gray-50 rounded-md mx-1">
        {messages.map(message => (
          <div 
            key={message.id} 
            className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div 
              className={`max-w-[85%] p-3 rounded-lg ${
                message.sender === 'user' 
                  ? 'bg-indigo-600 text-white rounded-tr-none' 
                  : 'bg-white text-gray-800 rounded-tl-none border border-gray-200 shadow-sm'
              }`}
            >
              <div 
                className="text-sm" 
                dangerouslySetInnerHTML={{ __html: formatMessageText(message.text) }}
              />
              
              {/* Message footer with timestamp and feedback */}
              <div className={`flex justify-between items-center mt-2 text-xs ${
                message.sender === 'user' ? 'text-indigo-200' : 'text-gray-500'
              }`}>
                <span>
                  {message.timestamp.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                </span>
                
                {message.sender === 'bot' && (
                  <div className="flex items-center space-x-2">
                    <button className="hover:text-indigo-600 transition-colors">
                      <ThumbsUp size={12} />
                    </button>
                    <button className="hover:text-indigo-600 transition-colors">
                      <ThumbsDown size={12} />
                    </button>
                    <button className="hover:text-indigo-600 transition-colors">
                      <MoreHorizontal size={12} />
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
        
        {/* Typing indicator */}
        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-gray-100 px-4 py-2 rounded-lg rounded-tl-none border border-gray-200">
              <div className="flex space-x-1">
                <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" 
                  style={{ animationDelay: '0ms' }}></div>
                <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" 
                  style={{ animationDelay: '150ms' }}></div>
                <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" 
                  style={{ animationDelay: '300ms' }}></div>
              </div>
            </div>
          </div>
        )}
        
        {/* Auto-scroll reference */}
        <div ref={messagesEndRef} />
      </div>
      
      {/* Suggested questions */}
      <div className="px-3 py-2 border-t border-gray-100">
        <p className="text-xs text-gray-500 mb-2">Suggested questions:</p>
        <div className="flex flex-wrap gap-2">
          {suggestedQuestions.map((question, index) => (
            <button 
              key={index}
              className="text-xs px-2 py-1 bg-indigo-50 text-indigo-700 rounded-full border border-indigo-100 hover:bg-indigo-100 transition-colors"
              onClick={() => handleSuggestedQuestion(question)}
            >
              {question}
            </button>
          ))}
        </div>
      </div>
      
      {/* Input box */}
      <div className="p-3 border-t flex items-end gap-2">
        <div className="flex-grow relative">
          <textarea
            className="w-full p-2 pr-10 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-500 resize-none"
            placeholder="Ask something about your training or recovery..."
            rows={2}
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={handleKeyPress}
          />
          <button 
            className="absolute right-3 bottom-2 text-gray-400 hover:text-indigo-600"
            onClick={() => {}}
          >
            <Mic size={18} />
          </button>
        </div>
        <button 
          className={`p-2 rounded-full ${
            inputText.trim() ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-500'
          }`}
          onClick={handleSendMessage}
          disabled={!inputText.trim()}
        >
          <Send size={18} />
        </button>
      </div>
    </div>
  );
};

export default AICompanion;