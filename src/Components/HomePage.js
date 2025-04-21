import React, { useEffect, useState } from "react";
import axios from "axios";
import "./HomePage.css";
import GoogleMapComponent from "./GoogleMapComponent";
import { BACKEND_BASE_URLS, BACKEND_ENDPOINTS, formatLocationQuery } from "../utils/frontEndUtils.js";

function HomePage({ searchedCity, units }) {
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [coordinates, setCoordinates] = useState(null);

  useEffect(() => {
    if (searchedCity) {
      const fetchWeatherData = async () => {
        setLoading(true);
        setError(null);
  
        try {
<<<<<<< Updated upstream
          const response = await axios.get(`${BACKEND_BASE_URLS.USER_CONDITIONS}${BACKEND_ENDPOINTS.USER_CONDITIONS}?city=${searchedCity}`);
          setWeatherData(response.data);
          
=======
          const response = await fetch(`${BACKEND_BASE_URLS.SAVED_SEARCHES}${BACKEND_ENDPOINTS.SAVED_SEARCHES}?city=${searchedCity}&units=${units}`);
  
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
  
          const data = await response.json();
          setWeatherData(data);
  
>>>>>>> Stashed changes
          // If the API response includes coordinates, update the state
          if (data.lat && data.lon) {
            setCoordinates({
              lat: data.lat,
              lng: data.lon
            });
          } else {
            setCoordinates(null);
          }
        } catch (err) {
          console.error("Error fetching weather:", err);
          setError("Failed to load weather data. Please try again later.");
          setCoordinates(null);
        } finally {
          setLoading(false);
        }
      };
  
      fetchWeatherData();
    }
  }, [searchedCity]);
  
  // Handle location selection from the map
  const handleLocationSelect = (newCoordinates) => {
    setCoordinates(newCoordinates);
  
    // Fetch weather data for the selected location
    const fetchWeatherForCoordinates = async () => {
      setLoading(true);
      setError(null);
  
      try {
        const locationQuery = formatLocationQuery(`${newCoordinates.lat},${newCoordinates.lng}`);
<<<<<<< Updated upstream
        const response = await axios.get(`${BACKEND_BASE_URL}${BACKEND_ENDPOINTS.SAVED_SEARCHES}?city=${locationQuery}`);
        setWeatherData(response.data);
=======
        const response = await fetch(`${BACKEND_BASE_URLS.SAVED_SEARCHES}${BACKEND_ENDPOINTS.SAVED_SEARCHES}?city=${locationQuery}`);
  
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
  
        const data = await response.json();
        setWeatherData(data);
>>>>>>> Stashed changes
      } catch (err) {
        console.error("Error fetching weather for coordinates:", err);
        setError("Failed to load weather data for the selected location.");
      } finally {
        setLoading(false);
      }
    };
  
    fetchWeatherForCoordinates();
  };
  

  return (
    <div id='Home-Page-Container'>
      <div className="home-header">
        <h1>Weather Map</h1>
      </div>

      {loading ? (
        <div className="loading-message">Loading map data...</div>
      ) : error ? (
        <div className="error-message">{error}</div>
      ) : (
        <div className="map-container">
          <GoogleMapComponent 
            city={weatherData?.name || searchedCity || "Default Location"}
            coordinates={coordinates}
            onLocationSelect={handleLocationSelect}
          />
          <p className="map-instruction">Click on the map to check weather at a different location</p>
          
          {weatherData && (
            <div className="weather-info-minimal">
              <h2>{weatherData.name}</h2>
              <p className="temp-value">{Math.round(weatherData.temperature)}°F</p>
              <p className="condition">{weatherData.weather[0].description}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default HomePage;
