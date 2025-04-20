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
        dayOfWeek: new Date(day.dt * 1000).toLocaleDateString('en-US', { weekday: 'short' }),
        temperature: {
          high: day.temp.max.toFixed(1),
          low: day.temp.min.toFixed(1),
          morning: day.temp.morn.toFixed(1),
          day: day.temp.day.toFixed(1),
          evening: day.temp.eve.toFixed(1),
          night: day.temp.night.toFixed(1),
        },
        feels_like: {
          day: day.feels_like.day.toFixed(1),
          night: day.feels_like.night.toFixed(1),
        },
        weather: {
          main: day.weather[0].main,
          description: day.weather[0].description,
          icon: `https://openweathermap.org/img/wn/${day.weather[0].icon}.png`, // Weather icon URL
        },
        // Additional data for detailed view
        humidity: day.humidity,
        wind_speed: day.wind_speed,
        wind_deg: day.wind_deg,
        pressure: day.pressure,
        uvi: day.uvi,
        pop: (day.pop * 100).toFixed(0), // Probability of precipitation as percentage
        rain: day.rain || 0,
        sunrise: new Date(day.sunrise * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        sunset: new Date(day.sunset * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
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
    <div id={containerClass}>
      {!embedded && (
        <div id="header-forecast-container">
          <div id="header-forecast-background">
            <h2>Seven Day Forecast for {defaultLocation}</h2>
          </div>
          
        </div>
      )}

      {/* Conditional rendering based on view mode */}
      {!detailedView ? (
        // Compact view
        <div id={`forecast-compact-view-${containerClass}`}>
          {forecast.map((day, index) => (
            <div key={index} id={`forecast-day-${containerClass}`}
              className={`${getWeatherBackground(day.weather.main)}`}>
              {!embedded ? (
                <div id={`text-background-${containerClass}`}>
                  <p id={`forecast-date-${containerClass}`}>{day.dayOfWeek}, {day.date}</p>
                  <img src={day.weather.icon} alt="Weather Icon" />
                  <p id={`forecast-condition-${containerClass}`}>{day.weather.main}</p>
                  <p id={`forecast-description-${containerClass}`}>{day.weather.description}</p>
                  <p id={`forecast-temp-high-${containerClass}`}>{Math.round(day.temperature.high)}{tempSymbol}</p>
                  <p id={`forecast-temp-low-${containerClass}`}>{Math.round(day.temperature.low)}{tempSymbol}</p>
                </div>) : (
                <div id={`text-background-${containerClass}`}>
                  <p id={`forecast-date-${containerClass}`}>{day.dayOfWeek}, {day.date}</p>
                  <div id="forecast-day-column-container">
                    <div id="left-day-column">
                      <img src={day.weather.icon} alt="Weather Icon" />
                    </div>
                    <div id="right-day-column">
                      <p id={`forecast-condition-${containerClass}`}>{day.weather.main}</p>
                      <p id={`forecast-description-${containerClass}`}>{day.weather.description}</p>
                    </div>
                  </div>
                  <div id="forecast-day-temp-container">
                    <p id={`forecast-temp-low-${containerClass}`}>{Math.round(day.temperature.low)}{tempSymbol}</p>
                    <p id={`forecast-temp-high-${containerClass}`}>{Math.round(day.temperature.high)}{tempSymbol}</p>
                  </div>

                  
                </div>
              )}
              
            </div>
          ))}
        </div>
      ) : (
        // Detailed view
        <div className="forecast-detailed-view">
          {forecast.map((day, index) => (
            <div key={index} className="forecast-day-detailed">
              <div className="forecast-day-header">
                <h3>{day.dayOfWeek}, {day.date}</h3>
                <div className="weather-summary">
                  <img src={day.weather.icon} alt="Weather Icon" className="weather-icon-large" />
                  <div>
                    <p className="forecast-condition">{day.weather.main}</p>
                    <p className="forecast-description">{day.weather.description}</p>
                  </div>
                </div>
              </div>
              
              <div className="forecast-day-content">
                <div className="temperature-section">
                  <h4>Temperature</h4>
                  <div className="temp-details">
                    <p><strong>High:</strong> {day.temperature.high}{tempSymbol}</p>
                    <p><strong>Low:</strong> {day.temperature.low}{tempSymbol}</p>
                    <p><strong>Morning:</strong> {day.temperature.morning}{tempSymbol}</p>
                    <p><strong>Day:</strong> {day.temperature.day}{tempSymbol}</p>
                    <p><strong>Evening:</strong> {day.temperature.evening}{tempSymbol}</p>
                    <p><strong>Night:</strong> {day.temperature.night}{tempSymbol}</p>
                    <p><strong>Feels Like (Day):</strong> {day.feels_like.day}{tempSymbol}</p>
                    <p><strong>Feels Like (Night):</strong> {day.feels_like.night}{tempSymbol}</p>
                  </div>
                </div>
                
                <div className="conditions-section">
                  <h4>Conditions</h4>
                  <p><strong>Humidity:</strong> {day.humidity}%</p>
                  <p><strong>Wind:</strong> {day.wind_speed} {speedSymbol}</p>
                  <p><strong>Pressure:</strong> {day.pressure} hPa</p>
                  <p><strong>UV Index:</strong> {day.uvi}</p>
                  <p><strong>Precipitation Chance:</strong> {day.pop}%</p>
                  {day.rain > 0 && <p><strong>Rain:</strong> {day.rain} mm</p>}
                </div>
                
                <div className="sun-section">
                  <h4>Sun</h4>
                  <p><strong>Sunrise:</strong> {day.sunrise}</p>
                  <p><strong>Sunset:</strong> {day.sunset}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {!embedded && (
        <button className="expand-button" onClick={() => setDetailedView(!detailedView)}>
          {detailedView ? "Hide Details" : "View Detailed Forecast"}
        </button>
      )}


    </div>
  );
}

export default WeeklyForecast;