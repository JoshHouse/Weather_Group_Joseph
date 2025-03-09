import React, { useState, useEffect } from "react";
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

function WeeklyForecast({ city }) {
  const [forecast, setForecast] = useState([
    {
      date: "2025-03-01",
      temperature: { day: 72, min: 60, max: 75, night: 65, eve: 68, morn: 62 },
      weather: "Clear",
      description: "Sunny day with no clouds",
      humidity: 50,
      wind_speed: 5,
    },
    {
      date: "2025-03-02",
      temperature: { day: 70, min: 58, max: 73, night: 63, eve: 67, morn: 60 },
      weather: "Clouds",
      description: "Partly cloudy with mild winds",
      humidity: 55,
      wind_speed: 7,
    }
  ]);
  const [detailedView, setDetailedView] = useState(false);

  return (
    <div className="weather-details-container">
      <div className="top-section">
        <h2 className="location">Weekly Forecast for {city}</h2>
        <div className="forecast-gap">[ Weekly Forecast Goes Here ]</div>
      </div>

      <button className="expand-button" onClick={() => setDetailedView(!detailedView)}>
        {detailedView ? "Hide Details" : "View Detailed Forecast"}
      </button>

      <div className={detailedView ? "detailed-view" : "compact-view"}>
        {forecast.map((day, index) => (
          <div key={index} className="forecast-day">
            <p>{day.date}</p>
            <img src={weatherIcons[day.weather] || cloudyIcon} alt={day.weather} />
            <p><strong>{day.weather}</strong></p>
            <p>{day.temperature.day}°F</p>
            {detailedView && (
              <div className="detailed-info">
                <p>Min: {day.temperature.min}°F</p>
                <p>Max: {day.temperature.max}°F</p>
                <p>Night: {day.temperature.night}°F</p>
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
