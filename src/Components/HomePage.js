import React, { useEffect, useState } from "react";
import axios from "axios";
import "./HomePage.css";
import GoogleMapComponent from "./GoogleMapComponent";
import { BACKEND_BASE_URLS, BACKEND_ENDPOINTS, formatLocationQuery } from "../utils/frontEndUtils.js";

function HomePage({ searchedCity }) {
  const [weatherData, setWeatherData] = useState(null);
  const [weatherLoading, setWeatherLoading] = useState(false);
  const [error, setError] = useState(null);
  const [coordinates, setCoordinates] = useState(null);

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
          const response = await axios.get(`${BACKEND_BASE_URLS.SAVED_SEARCHES}${BACKEND_ENDPOINTS.SAVED_SEARCHES}?city=${searchedCity}&units=imperial`);
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
      
      const cityUrl = `${BACKEND_BASE_URLS['NAME']}${BACKEND_ENDPOINTS['NAME']}?lat=${newCoordinates.lat}&lon=${newCoordinates.lng}&units=imperial`;

      let cityName;

      try {
        const cityNameResponse = await axios.get(cityUrl);
        cityName = cityNameResponse.data[0].name;

        try {
          const response = await axios.get(`${BACKEND_BASE_URLS.SAVED_SEARCHES}${BACKEND_ENDPOINTS.SAVED_SEARCHES}?city=${cityName}&units=imperial`);
          setWeatherData(response.data);
        } catch (err) {
          console.error("Error fetching weather for coordinates:", err);
          setError("Failed to load weather data for the selected location.");
        } finally {
          setWeatherLoading(false);
        }
      }
      catch(err) {
        console.error("Error fetching city name:", err);
        setError("Failed to load city name.");
        setWeatherLoading(false);
        return; 
      } 


    };

    fetchWeatherForCoordinates();
  };

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
              <p className="temp-value">{Math.round(weatherData.main.temp)}°F</p>
              <p className="condition">{weatherData.weather[0].description}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default HomePage;
