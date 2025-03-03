// App.js
import React, { useState } from 'react';
import WeatherConditionsPage from './Components/WeatherConditionsPage';
import WeatherComparisonMenu from './Components/WeatherComparisonMenu';
import WeeklyForecast from './Components/WeeklyForecast';
import './App.css';

function App() {
  const [activePage, setActivePage] = useState('home');

  const renderPage = () => {
    switch (activePage) {
      case 'compare':
        return <WeatherComparisonMenu />;
      case 'forecast':
        return <WeeklyForecast city = "London" />;
      case 'home':
      default:
        return <WeatherConditionsPage />;
    }
  };

  return (
    <div className="app-container">
      <div className="sidebar">
        <h2>Weather App</h2>
        <button onClick={() => setActivePage('home')}>Home</button>
        <button onClick={() => setActivePage('settings')}>Settings</button>
        <button onClick={() => setActivePage('forecast')}>Weekly Forecast</button>
        <button onClick={() => setActivePage('compare')}>Compare Statistics</button>
      </div>
      <div className="content">
        {renderPage()}
      </div>
    </div>
  );
}

export default App;
