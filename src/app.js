import React, { useEffect, useState } from "react";
import axios from "axios";
import WeatherConditionsPage from "./Components/WeatherConditionsPage";
import WeatherComparisonMenu from "./Components/WeatherComparisonMenu";
import WeeklyForecast from "./Components/WeeklyForecast";
import SettingsPage from "./Components/SettingsPage";
import "./App.css";

function App() {
    const [activePage, setActivePage] = useState("home");
    const [weather, setWeather] = useState(null);
    const [settings, setSettings] = useState({
        units: "imperial",
        defaultCity: "London",
        theme: "light"
    });

    // Fetch settings on initial load
    useEffect(() => {
        axios.get("http://127.0.0.1:5000/api/settings")
            .then(response => {
                setSettings(response.data);
                // Apply theme
                document.body.className = response.data.theme === "dark" ? "dark-theme" : "light-theme";
            })
            .catch(error => console.error("Error fetching settings:", error));
    }, []);

    // Fetch weather data for the current city
    useEffect(() => {
        if (settings.defaultCity) {
            axios.get(`http://127.0.0.1:5000/api/weather?city=${settings.defaultCity}`)
                .then(response => setWeather(response.data))
                .catch(error => console.error("Error fetching weather data:", error));
        }
    }, [settings.defaultCity]);

    const renderPage = () => {
        switch (activePage) {
            case "compare":
                return <WeatherComparisonMenu />;
            case "forecast":
                return <WeeklyForecast city={settings.defaultCity} />;
            case "settings":
                return <SettingsPage />;
            case "home":
            default:
                return (
                    <div>
                        <WeatherConditionsPage city={settings.defaultCity} />
                        {weather ? (
                            <div className="weather-info">
                                <h2>{weather.name}</h2>
                                <p>Temperature: {weather.temperature}°{settings.units === "imperial" ? "F" : "C"}</p>
                                <p>Condition: {weather.weather}</p>
                            </div>
                        ) : (
                            <p>Loading weather data...</p>
                        )}
                    </div>
                );
        }
    };

    return (
        <div className={`app-container ${settings.theme === "dark" ? "dark-theme" : "light-theme"}`}>
            <div className="sidebar">
                <h2>Weather App</h2>
                <button onClick={() => setActivePage("home")}>Home</button>
                <button onClick={() => setActivePage("settings")}>Settings</button>
                <button onClick={() => setActivePage("forecast")}>Weekly Forecast</button>
                <button onClick={() => setActivePage("compare")}>Compare Statistics</button>
            </div>
            <div className="content">{renderPage()}</div>
        </div>
    );
}

export default App;
