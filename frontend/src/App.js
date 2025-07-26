import React, { useState } from "react";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import TrendDashboard from "./components/TrendDashboard";
import ScriptGenerator from "./components/ScriptGenerator";

function App() {
  const [selectedTrend, setSelectedTrend] = useState(null);
  const [currentView, setCurrentView] = useState('dashboard');

  const handleTrendSelect = (trend) => {
    setSelectedTrend(trend);
    setCurrentView('generator');
  };

  const handleBack = () => {
    setCurrentView('dashboard');
    setSelectedTrend(null);
  };

  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={
            currentView === 'dashboard' ? (
              <TrendDashboard onTrendSelect={handleTrendSelect} />
            ) : (
              <ScriptGenerator 
                trend={selectedTrend} 
                onBack={handleBack}
              />
            )
          } />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;