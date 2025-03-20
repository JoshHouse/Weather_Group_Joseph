import React, { useState, useEffect } from "react";
import axios from "axios";
import "./WeatherConditionsPage.css";
import WeeklyForecast from "./WeeklyForecast"; // Import Weekly Forecast component
import { 
  formatLocationQuery, 
  getWeatherBackground,
  API_BASE_URL,
  API_ENDPOINTS
} from "../utils/weatherUtils";

function WeatherConditionsPage({ city }) {
  const [weatherData, setWeatherData] = useState(null);
  const [uvIndex, setUvIndex] = useState(null);
  const [airQuality, setAirQuality] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userLocation, setUserLocation] = useState(null);

  // Get user's current location on component mount
  useEffect(() => {
    if (navigator.geolocation) {
      setLoading(true);
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          
          try {
            // Use the backend API to get the city name from coordinates
            const response = await axios.get(`${API_BASE_URL}${API_ENDPOINTS.WEATHER}?lat=${latitude}&lon=${longitude}`);
            if (response.data && response.data.name) {
              setUserLocation(response.data.name);
            } else {
              setUserLocation("London"); // Default if geocoding fails
            }
          } catch (err) {
            console.error("Error getting location name:", err);
            setUserLocation("London"); // Default if geocoding fails
          } finally {
            setLoading(false);
          }
        },
        (err) => {
          console.error("Geolocation error:", err);
          setUserLocation("London"); // Default if geolocation fails
          setLoading(false);
        }
      );
    } else {
      setUserLocation("London"); // Default if geolocation not supported
      setLoading(false);
    }
  }, []);

  // Fetch weather data when city or user location changes
  useEffect(() => {
    const fetchWeatherData = async () => {
      // Don't fetch until we have a location (either from props or geolocation)
      if (!city && !userLocation) return;
      
      setLoading(true);
      setError(null);

      // Use provided city prop if available, otherwise use user's location
      const locationToUse = city || userLocation;
      
      // Format the location query to ensure proper API handling
      const formattedLocation = formatLocationQuery(locationToUse);

      try {
        const response = await axios.get(
          `${API_BASE_URL}${API_ENDPOINTS.WEATHER}?city=${formattedLocation}`
        );

        const data = response.data;
        setWeatherData({
          name: data.name,
          weather: data.weather,
          description: data.description,
          temperature: data.temperature,
          feels_like: data.feels_like,
          temp_max: data.temp_max,
          temp_min: data.temp_min,
          wind_speed: data.wind_speed,
          wind_direction: data.wind_direction,
          wind_gust: data.wind_gust || 0,
          sunrise: data.sunrise,
          sunset: data.sunset,
          lat: data.lat,
          lon: data.lon,
        });
      } catch (err) {
        console.error("Error fetching weather:", err);
        setError("Failed to load weather data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchWeatherData();
  }, [city, userLocation]);

  // Fetch UV Index and Air Quality data when weather data changes
  useEffect(() => {
    const fetchUVAndAirQuality = async () => {
      if (!weatherData) return;
      
      try {
        // Fetch UV Index data
        const uvResponse = await axios.get(
          `${API_BASE_URL}${API_ENDPOINTS.UV_INDEX}?lat=${weatherData.lat}&lon=${weatherData.lon}`
        );
        setUvIndex(uvResponse.data.uvIndex);
        
        // Fetch Air Quality data
        const airResponse = await axios.get(
          `${API_BASE_URL}${API_ENDPOINTS.AIR_QUALITY}?lat=${weatherData.lat}&lon=${weatherData.lon}`
        );
        setAirQuality(airResponse.data.description);
      } catch (err) {
        console.error("Error fetching UV Index or Air Quality:", err);
        // Don't set error state here to avoid blocking the main weather display
      }
    };

    fetchUVAndAirQuality();
  }, [weatherData]);

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
          <p><strong>UV Index:</strong> {uvIndex !== null ? uvIndex : "Loading..."}</p>
          <p><strong>Air Quality:</strong> {airQuality !== null ? airQuality : "Loading..."}</p>
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
