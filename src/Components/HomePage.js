import React, { useEffect, useState } from "react";
import axios from "axios";
import "./HomePage.css";
import GoogleMapComponent from "./GoogleMapComponent";
import { BACKEND_BASE_URLS, BACKEND_ENDPOINTS, formatLocationQuery } from "../utils/frontEndUtils.js";

function HomePage({ searchedCity, units }) {
  const [weatherData, setWeatherData] = useState(null);
  const [weatherLoading, setWeatherLoading] = useState(false);
  const [error, setError] = useState(null);
  const [coordinates, setCoordinates] = useState(null);

  if (units === 'metric') {
    var tempSymbol = '°C';
    var speedSymbol = 'km/h';
  } else {
    var tempSymbol = '°F';
    var speedSymbol = 'mph';
  }

  // Get user's location on component mount
  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const userCoords = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
          setCoordinates(userCoords);
          handleLocationSelect(userCoords);
        },
        (error) => {
          console.error("Error getting location:", error);
          setError("Could not get your location. Using default location.");
        }
      );
    } else {
      setError("Geolocation is not supported by your browser.");
    }
  }, []);

  useEffect(() => {
    if (searchedCity) {
      const fetchWeatherData = async () => {
        setWeatherLoading(true);
        setError(null);

        try {
          const encodedCity = encodeURIComponent(searchedCity);
          const response = await axios.get(`${BACKEND_BASE_URLS.SAVED_SEARCHES}${BACKEND_ENDPOINTS.SAVED_SEARCHES}?city=${encodedCity}&units=${units}`);
          
          setWeatherData(response.data);
          
          // If the API response includes coordinates, update the state
          if (response.data.lat && response.data.lon) {
            setCoordinates({
              lat: response.data.lat,
              lng: response.data.lon
            });
          } else {
            // Reset coordinates if not available
            setCoordinates(null);
          }
        } catch (err) {
          console.error("Error fetching weather:", err);
          setError("Failed to load weather data. Please try again later.");
          setCoordinates(null);
        } finally {
          setWeatherLoading(false);
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
      setWeatherLoading(true);
      setError(null);

      try {
        const response = await axios.get(`${BACKEND_BASE_URLS.SAVED_SEARCHES_LAT_LON}${BACKEND_ENDPOINTS.SAVED_SEARCHES_LAT_LON}?lat=${newCoordinates.lat}&lon=${newCoordinates.lng}&units=${units}`);
        
        setWeatherData(response.data);
      } catch (err) {
        console.error("Error fetching weather for coordinates:", err);
        setError("Failed to load weather data for the selected location.");
      } finally {
        setWeatherLoading(false);
      }



    };

    fetchWeatherForCoordinates();
  };

  function cleanCityName(rawName) {
    // Only keep the first word or strip extra descriptors
    return rawName.split(",")[0].split(" - ")[0].trim();
  }

  return (
    <div id='Home-Page-Container'>
      <div className="home-header">
        <h1>Weather Map</h1>
      </div>

      {error ? (
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
              <p className="temp-value">{Math.round(weatherData.main.temp)}{tempSymbol}</p>
              <p className="condition">{weatherData.weather[0].description}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default HomePage;
