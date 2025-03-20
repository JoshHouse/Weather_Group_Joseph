import React, { useEffect, useState } from "react";
import axios from "axios";
import "./WeeklyForecast.css";
import { 
  formatLocationQuery, 
  getWeatherBackground, 
  formatDate,
  API_BASE_URL,
  API_ENDPOINTS
} from "../utils/weatherUtils";

function WeeklyForecast({ city = "London", embedded = true }) {
  const [forecast, setForecast] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchForecast = async () => {
      setLoading(true);
      setError(null);

      try {
        const formattedCity = formatLocationQuery(city);
        const response = await axios.get(`${API_BASE_URL}${API_ENDPOINTS.FORECAST}?city=${formattedCity}`);
        setForecast(response.data);
      } catch (err) {
        console.error("Error fetching forecast:", err);
        setError("Failed to load forecast data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchForecast();
  }, [city]);

  if (loading) {
    return <div className="loading-message">Loading forecast data...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  if (!forecast || forecast.length === 0) {
    return <div className="no-data-message">No forecast data available</div>;
  }

  return (
    <div className="weekly-forecast-container">
      {!embedded && <h2 className="forecast-title">Weekly Forecast for {city}</h2>}
      
      <div className="forecast-scroll">
        {forecast.slice(0, 5).map((day, index) => (
          <div key={index} className="forecast-card">
            <p className="forecast-date">{formatDate(day.date)}</p>
            <img src={getWeatherBackground(day.weather)} alt={day.weather} className="forecast-gif" />
            <p className="forecast-weather">{day.weather}</p>
            <p className="forecast-temp">{Math.round(day.temperature.day)}°F</p>
            <p className="forecast-min-max">
              Min: {Math.round(day.temperature.min)}°F / Max: {Math.round(day.temperature.max)}°F
            </p>
            <p className="forecast-humidity">Humidity: {day.humidity}%</p>
            <p className="forecast-wind">Wind: {day.wind_speed} mph</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default WeeklyForecast;
