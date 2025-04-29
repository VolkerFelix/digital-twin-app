import React from 'react';
import DigitalTwinDashboard from './components/dashboard/DigitalTwinDashboard';
import './styles/global.css';

function App() {
  return (
    <div className="min-h-screen bg-gray-200 p-4">
      <div className="max-w-7xl mx-auto">
        <header className="py-4 mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Digital Twin Dashboard</h1>
        </header>
        
        <main>
          <DigitalTwinDashboard />
        </main>
        
        <footer className="mt-8 py-4 text-center text-gray-500 text-sm">
          <p>Digital Twin Technology &copy; {new Date().getFullYear()}</p>
        </footer>
      </div>
    </div>
  );
}

export default App;