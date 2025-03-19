import React, { useState, useEffect } from "react";
import axios from "axios";
import "./WeeklyForecast.css";

// Import weather background GIFs
import cloudyGif from "../Assets/images/Cloudy.gif";
import rainGif from "../Assets/images/Rain.gif";
import snowGif from "../Assets/images/Snow.gif";
import sunnyGif from "../Assets/images/Sunny.gif";
import thunderstormsGif from "../Assets/images/Thunderstroms.gif";

// Function to determine the background GIF based on weather condition
function getWeatherBackground(weatherCondition) {
  if (!weatherCondition) return sunnyGif;
  
  const condition = weatherCondition.toLowerCase();
  
  if (condition.includes("cloud") || condition.includes("overcast") || condition.includes("fog") || condition.includes("mist")) {
    return cloudyGif;
  } else if (condition.includes("rain") || condition.includes("drizzle") || condition.includes("shower")) {
    return rainGif;
  } else if (condition.includes("snow") || condition.includes("sleet") || condition.includes("hail") || condition.includes("ice")) {
    return snowGif;
  } else if (condition.includes("thunder") || condition.includes("storm") || condition.includes("lightning")) {
    return thunderstormsGif;
  } else {
    return sunnyGif;
  }
}

function WeeklyForecast({ city = "London", embedded = true }) {
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
    const options = { weekday: "short", month: "short", day: "numeric" };
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

  // Limit displayed days when embedded
  const displayForecast = embedded ? forecast.slice(0, 5) : forecast;
  const containerClass = embedded ? "forecast-gap" : "weather-details-container";

  return (
    <div className={containerClass}>
      {!embedded && <h2 className="location">Weekly Forecast for {city}</h2>}

      {embedded && <h3>5-Day Forecast</h3>}

      <button className="expand-button" onClick={() => setDetailedView(!detailedView)}>
        {detailedView ? "Hide Details" : "View Detailed Forecast"}
      </button>

      <div className={detailedView ? "detailed-view" : "compact-view"}>
        {displayForecast.map((day, index) => (
          <div
            key={index}
            className="forecast-day"
            style={{
              backgroundImage: `url(${getWeatherBackground(day.weather)})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
              color: "#ffffff",
              textShadow: "1px 1px 3px rgba(0, 0, 0, 0.8)",
              width: embedded ? "100px" : "150px",
              padding: "12px",
              boxShadow: "0 2px 5px rgba(0, 0, 0, 0.2)",
              borderRadius: "8px",
            }}
          >
            <p style={{ fontWeight: "bold", fontSize: "1rem", marginBottom: "8px" }}>{formatDate(day.date)}</p>
            <p style={{ fontWeight: "bold", fontSize: "1.1rem" }}>{day.weather}</p>
            <p style={{ fontSize: "1.2rem", fontWeight: "bold" }}>{Math.round(day.temperature.day)}°F</p>
            
            {detailedView && (
              <div
                className="detailed-info"
                style={{
                  backgroundColor: "rgba(0, 0, 0, 0.5)",
                  borderRadius: "5px",
                  padding: "8px",
                  marginTop: "10px",
                }}
              >
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
