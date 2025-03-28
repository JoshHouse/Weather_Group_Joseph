import React, { useState, useEffect, useContext } from "react";
import WeatherConditionsPage from "./Components/WeatherConditionsPage";
import WeatherComparisonMenu from "./Components/WeatherComparisonMenu";
import WeeklyForecast from "./Components/WeeklyForecast";
import Sidebar from "./Components/Sidebar";
import Header from "./Components/Header";
import ExitButton from "./Components/ExitButton"; 
import HomePage from "./Components/HomePage";
import SettingsPage from "./Components/SettingsPage";
import { AppContext } from "./AppContext";
import "./App.css";

function App() {
  const { theme } = useContext(AppContext); 
  const [activePage, setActivePage] = useState("home");
  const [city, setCity] = useState("London");

  
  useEffect(() => {
    document.body.className = theme === "dark" ? "dark-theme" : "light-theme";
  }, [theme]);

  const renderPage = () => {
    switch (activePage) {
      case "searched":
        return <WeatherConditionsPage city={city} />;
      case "compare":
        return <WeatherComparisonMenu />;
      case "settings":
        return <SettingsPage />;
      case "forecast":
        return <WeeklyForecast />;
      case "home":
      default:
        return <HomePage />;
    }
  };

  const handleSearch = (searchedCity) => {
    setCity(searchedCity);
    setActivePage("searched");
  };

  return (
    <div id="app-container">
      <div id="top-bar">
        <div id="exit-button">
          <ExitButton onExit={() => setActivePage("home")} />
        </div>
        <div id="header-bar">
          <Header onSearch={handleSearch} />
        </div>
      </div>
      <div id="bottom-content-and-sidebar">
        <div id="side-bar">
          <Sidebar setActivePage={setActivePage} />
        </div>
        <div id="content-page">{renderPage()}</div>
      </div>
    </div>
  );
}

export default App;
