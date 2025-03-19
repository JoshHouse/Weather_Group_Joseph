import React, { useState, useEffect } from "react";
import axios from "axios";
import "./WeatherConditionsPage.css";
import WeeklyForecast from "./WeeklyForecast"; // Import Weekly Forecast component

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

function WeatherConditionsPage({ city = "London" }) {
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // OpenWeather API key
  const apiKey = "a7ecb5d8aaa97f57473de04085971f14";

  useEffect(() => {
    const fetchWeatherData = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await axios.get(
          `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=imperial`
        );

        const data = response.data;
        setWeatherData({
          name: data.name,
          weather: data.weather[0].main,
          description: data.weather[0].description,
          temperature: data.main.temp,
          feels_like: data.main.feels_like,
          temp_max: data.main.temp_max,
          temp_min: data.main.temp_min,
          wind_speed: data.wind.speed,
          wind_direction: data.wind.deg,
          wind_gust: data.wind.gust || 0,
          sunrise: data.sys.sunrise,
          sunset: data.sys.sunset,
        });
      } catch (err) {
        console.error("Error fetching weather:", err);
        setError("Failed to load weather data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchWeatherData();
  }, [city]);

  if (loading) {
    return <div className="loading-message">Loading weather data...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  if (!weatherData) {
    return <div className="no-data-message">No weather data available</div>;
  }

  return (
    <div
      className="weather-container"
      style={{
        backgroundImage: `url(${getWeatherBackground(weatherData.weather)})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        color: "#ffffff",
        textShadow: "1px 1px 3px rgba(0, 0, 0, 0.8)",
        padding: "30px",
        borderRadius: "10px",
      }}
    >
      {/* Top Section with City Name and Forecast */}
      <div className="top-section">
        <h2 className="location">{weatherData.name}</h2>
        <WeeklyForecast city={city} embedded={true} /> {/* Integrating Weekly Forecast */}
      </div>

      {/* Weather Data Display */}
      <div className="columns-container">
        {/* Left Column: Sunrise, Sunset, UV Index, Air Quality */}
        <div className="left-column">
          <p><strong>Sunrise:</strong> {new Date(weatherData.sunrise * 1000).toLocaleTimeString()}</p>
          <p><strong>Sunset:</strong> {new Date(weatherData.sunset * 1000).toLocaleTimeString()}</p>
          <p><strong>UV Index:</strong> 5</p> {/* Placeholder */}
          <p><strong>Air Quality:</strong> Good</p> {/* Placeholder */}
        </div>

        {/* Middle Column: Weather Condition, Description, Wind */}
        <div className="middle-column">
          <div className="condition-container">
            <p><strong>Condition:</strong> {weatherData.weather}</p>
            <p><strong>Description:</strong> {weatherData.description}</p>
          </div>
          <div className="wind-container">
            <p><strong>Wind Speed:</strong> {weatherData.wind_speed} mph</p>
            <p><strong>Wind Direction:</strong> {weatherData.wind_direction}°</p>
            <p><strong>Wind Gust:</strong> {weatherData.wind_gust} mph</p>
          </div>
        </div>

        {/* Right Column: Temperature Details */}
        <div className="right-column">
          <p><strong>Current Temperature:</strong> {Math.round(weatherData.temperature)}°F</p>
          <p><strong>Feels Like:</strong> {Math.round(weatherData.feels_like)}°F</p>
          <p><strong>Today's High:</strong> {Math.round(weatherData.temp_max)}°F</p>
          <p><strong>Today's Low:</strong> {Math.round(weatherData.temp_min)}°F</p>
        </div>
      </div>
    </div>
  );
}

export default WeatherConditionsPage;
