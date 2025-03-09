// App.js
import React, { useState } from 'react';
import WeatherConditionsPage from './Components/WeatherConditionsPage';
import WeatherComparisonMenu from './Components/WeatherComparisonMenu';
import WeeklyForecast from './Components/WeeklyForecast';
import Sidebar from './Components/Sidebar';
import Header from './Components/Header';
import './App.css';

function App() {
  // const [activePage, setActivePage] = useState('home');

  // const renderPage = () => {
  //   switch (activePage) {
  //     case 'compare':
  //       return <WeatherComparisonMenu />;
  //     case 'forecast':
  //       return <WeeklyForecast city = "London" />;
  //     case 'home':
  //     default:
  //       return <WeatherConditionsPage />;
  //   }
  // };

  return (
    <div id="app-container">
      
      <div id="top-bar">
        
        <div id="exit-button">

        </div>

        <div id="header-bar">
          <Header />;
        </div>

      </div>

      <div id="bottom-content-and-sidebar">
        
        <div id="side-bar">
          <Sidebar />
        </div>

        <div id="content-page">
          <WeatherConditionsPage />
        </div>

      </div>
    </div>
  );
}

export default App;
