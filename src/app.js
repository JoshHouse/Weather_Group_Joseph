import React, { useState, useEffect, createContext } from "react";
import WeatherConditionsPage from "./Components/WeatherConditionsPage";
import WeatherComparisonMenu from "./Components/WeatherComparisonMenu";
import WeeklyForecast from "./Components/WeeklyForecast";
import Sidebar from "./Components/Sidebar";
import Header from "./Components/Header";
import ExitButton from "./Components/ExitButton"; 
import HomePage from "./Components/HomePage";
import SettingsPage from "./Components/SettingsPage";
import "./App.css";

export const ThemeContext = createContext();

// App function
function App() {
  // State to hold active pages to switch between them
  const [activePage, setActivePage] = useState("home");
  // State to hold the city for searching purposes
  const [city, setCity] = useState("London"); 

  // Render page function to switch active page to different components based on type of call
  const renderPage = () => {
    switch (activePage) {
      case "searched": // Called by handleSearch function called in Header.js
        return <WeatherConditionsPage city={city}/>;
      case "compare": // Called when Compare button is pressed on the sidebar
        return <WeatherComparisonMenu />;
      case "settings": // Called when settings button is pressed on the sidebar
        return <SettingsPage setTheme={setTheme} theme={theme} />; // Settings page passes theme to app.js
      case "home":  // Called when home or exit are pressed
        return <HomePage />
      default: // Called by default
        return <HomePage />;
    }
  };

  // Updates city to the searched city from the header component
  const handleSearch = (searchedCity) => {
    setCity(searchedCity);
    setActivePage("searched"); // Change to the weather conditions page after search
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      <div id="app-container"> {/* App wrapper div */}
        
        <div id="top-bar"> {/* header bar and exit button wrapper div */}
          
          <div id="exit-button">  {/* exit button wrapper div */}
            {/* Pass setActivePage as a prop */}
            <ExitButton onExit={() => setActivePage("home")} />
          </div>

          <div id="header-bar"> {/* header bar wrapper div */}
            {/* pass handleSearch so header can access it */}
            <Header onSearch={handleSearch} />
          </div>
        
        </div>


        <div id="bottom-content-and-sidebar"> {/* Sidebar and content page wrapper div */}
          
          <div id="side-bar"> {/* sidebar wrapper div */}
            {/* Pass setActivePage function to Sidebar */}
            <Sidebar setActivePage={setActivePage} />
          </div>
        
          <div id="content-page">{renderPage()}</div> {/* content-page wrapper div calling renderPage function */}
        
        </div>
      
      </div>
    </ThemeContext.Provider>
  );
}


export default App;

