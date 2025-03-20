import React, { useEffect, useState } from "react";
import axios from "axios";
import "./HomePage.css";
import WGJLogo from "../Assets/images/WGJLogo.png";
import WeeklyForecast from "./WeeklyForecast";
import { API_BASE_URL, API_ENDPOINTS } from "../utils/weatherUtils";

function HomePage({ searchedCity }) {
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (searchedCity) {
      const fetchWeatherData = async () => {
        setLoading(true);
        setError(null);

        try {
          const response = await axios.get(`${API_BASE_URL}${API_ENDPOINTS.WEATHER}?city=${searchedCity}`);
          setWeatherData(response.data);
        } catch (err) {
          console.error("Error fetching weather:", err);
          setError("Failed to load weather data. Please try again later.");
        } finally {
          setLoading(false);
        }
      };

      fetchWeatherData();
    }
  }, [searchedCity]);

  return (
    <div id='Home-Page-Container'>
      <div className="home-header">
        <img id='logo' src={WGJLogo} alt="Weather Group Joseph Logo" />
        <h1>Weather Group Joseph</h1>
      </div>

      {loading ? (
        <div className="loading-message">Loading weather data...</div>
      ) : error ? (
        <div className="error-message">{error}</div>
      ) : weatherData ? (
        <div className="weather-results">
          <div className="current-weather">
            <h2>{weatherData.name}</h2>
            <div className="weather-info">
              <div className="temperature">
                <p className="temp-value">{Math.round(weatherData.temperature)}°F</p>
                <p className="condition">{weatherData.weather}</p>
                <p>{weatherData.description}</p>
              </div>
              <div className="details">
                <p><strong>Feels Like:</strong> {Math.round(weatherData.feels_like)}°F</p>
                <p><strong>High:</strong> {Math.round(weatherData.temp_max)}°F</p>
                <p><strong>Low:</strong> {Math.round(weatherData.temp_min)}°F</p>
                <p><strong>Wind:</strong> {weatherData.wind_speed} mph</p>
                <p><strong>Humidity:</strong> {weatherData.humidity}%</p>
              </div>
            </div>
          </div>

          <div className="forecast-section">
            <WeeklyForecast city={weatherData.name} embedded={true} />
          </div>
        </div>
      ) : (
        <div className="no-data-message">No weather data available</div>
      )}
    </div>
  );
}

export default HomePage;
