import React, { useState, useEffect } from "react";
import "./WeeklyForecast.css";
import { BACKEND_BASE_URLS, BACKEND_ENDPOINTS } from "../utils/frontEndUtils";

function getWeatherBackground(weatherCondition) {
  if (!weatherCondition) return "sunnyGif";
  const condition = weatherCondition.toLowerCase();
  if (condition.includes("cloud") || condition.includes("fog") || condition.includes("mist")) return "cloudyGif";
  if (condition.includes("rain") || condition.includes("drizzle") || condition.includes("shower")) return "rainGif";
  if (condition.includes("snow") || condition.includes("sleet") || condition.includes("hail")) return "snowGif";
  if (condition.includes("thunder") || condition.includes("storm") || condition.includes("lightning")) return "thunderstormsGif";
  if (condition.includes("clear") || condition.includes("sun") || condition.includes("fair")) return "sunnyGif";
  return "sunnyGif";
}

function WeeklyForecast({ defaultLocation, units, embedded }) {
  const [forecast, setForecast] = useState([]);
  const [detailedView, setDetailedView] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  if (units === 'metric') {
    var tempSymbol = '°C';
    var speedSymbol = 'km/h';
  } else {
    var tempSymbol = '°F';
    var speedSymbol = 'mph';
  }

  const fetchUserLocationForecast = async (days) => {
    try {
      const response = await fetch(`${BACKEND_BASE_URLS.WEATHER_FORECAST}${BACKEND_ENDPOINTS.WEATHER_FORECAST}?city=${defaultLocation}&units=${units}`);
      console.log(`Backend Forecast URL: ${BACKEND_BASE_URLS.WEATHER_FORECAST}${BACKEND_ENDPOINTS.WEATHER_FORECAST}?city=${defaultLocation}&units=${units}`)
      if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
      
      const data = await response.json();

      setForecast(prepareForecastData(data, days))
      setLoading(false);
    } catch (error) {
      console.error("Error fetching location-based forecast:", error);
      setError("Failed to fetch forecast data.");
      setLoading(false);
    }
  };

  function prepareForecastData(apiResponse, count) {
    if (!apiResponse || !apiResponse.daily) {
      return [];
    }
  
    // Limit to the requested number of days
    return apiResponse.daily.slice(0, count).map((day) => {
      return {
        date: new Date(day.dt * 1000).toLocaleDateString(), // Convert timestamp to readable date
        temperature: {
          high: day.temp.max.toFixed(1),
          low: day.temp.min.toFixed(1),
        },
        weather: {
          main: day.weather[0].main,
          description: day.weather[0].description,
          icon: `https://openweathermap.org/img/wn/${day.weather[0].icon}.png`, // Weather icon URL
        },
      };
    });
  }

  if (embedded && loading) {
    fetchUserLocationForecast(5);
  } else if (loading) {
    fetchUserLocationForecast(7);
  }

  if (loading) return <div className="loading-message">Loading forecast data...</div>;
  if (error) return <div className="error-message">{error}</div>;
  if (!forecast.length) return <div className="no-data-message">No forecast data available</div>;

  const containerClass = embedded ? "forecast-gap" : "weather-details-container";

  return (
    <div className={containerClass}>
      {!embedded && (
        <div className="header-forecast-container">
          <div className="header-forecast-background">
            <h2>Seven Day Forecast for {defaultLocation}</h2>
          </div>
          
        </div>
      )}
      {embedded && <h3>7-Day Forecast</h3>}

      <div className={detailedView ? "forecast-detailed-view" : "forecast-compact-view"}>
        {forecast.map((day, index) => (
          <div key={index} className={`forecast-day ${getWeatherBackground(day.weather.main)}`}>
            <div className = "text-background">
              <p>{day.date}</p>
              <img src={day.weather.icon} alt="Weather Icon"></img>
              <p>{day.weather.main}</p>
              <p>{day.weather.description}</p>
              <p>{Math.round(day.temperature.high)}{tempSymbol}</p>
            </div>
          </div>
        ))}
      </div>

      {!embedded && (
        <button className="expand-button" onClick={() => setDetailedView(!detailedView)}>
          {detailedView ? "Hide Details" : "View Detailed Forecast"}
        </button>
      )}


    </div>
  );
}

export default WeeklyForecast;
