import React, { useState, useEffect } from "react";
import axios from "axios";
import "./WeeklyForecast.css";
import cloudyIcon from "../assets/images/cloudy.png";
import rainIcon from "../assets/images/rain.png";
import snowIcon from "../assets/images/snow.png";
import sunnyIcon from "../assets/images/sunny.png";
import thunderIcon from "../assets/images/thunderStorms.png";

const weatherIcons = {
  Clear: sunnyIcon,
  Clouds: cloudyIcon,
  Rain: rainIcon,
  Snow: snowIcon,
  Thunderstorm: thunderIcon
};

function WeeklyForecast({ city = "London" }) {
  const [forecast, setForecast] = useState([]);
  const [detailedView, setDetailedView] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchForecast = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const response = await axios.get(`http://127.0.0.1:5000/api/forecast?city=${city}`);
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

  // Format date to be more readable
  const formatDate = (dateString) => {
    const options = { weekday: 'short', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

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
    <div className="weather-details-container">
      <div className="top-section">
        <h2 className="location">Weekly Forecast for {city}</h2>
      </div>

      <button className="expand-button" onClick={() => setDetailedView(!detailedView)}>
        {detailedView ? "Hide Details" : "View Detailed Forecast"}
      </button>

      <div className={detailedView ? "detailed-view" : "compact-view"}>
        {forecast.map((day, index) => (
          <div key={index} className="forecast-day">
            <p>{formatDate(day.date)}</p>
            <img src={weatherIcons[day.weather] || cloudyIcon} alt={day.weather} />
            <p><strong>{day.weather}</strong></p>
            <p>{Math.round(day.temperature.day)}°F</p>
            {detailedView && (
              <div className="detailed-info">
                <p>Min: {Math.round(day.temperature.min)}°F</p>
                <p>Max: {Math.round(day.temperature.max)}°F</p>
                <p>Night: {Math.round(day.temperature.night)}°F</p>
                <p>Humidity: {day.humidity}%</p>
                <p>Wind Speed: {day.wind_speed} mph</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default WeeklyForecast;
