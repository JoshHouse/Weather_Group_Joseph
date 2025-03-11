// Import necessary libraries
import React, { useState, useEffect } from "react"; // React hooks: useState for managing state, useEffect for handling side effects
import axios from "axios"; // For making HTTP requests
import "./WeatherConditionsPage.css"; // Import Component CSS styling
import rainImage from "../assets/images/rain.png"; // Import rain placeholder image

function WeatherConditionsPage({ city = "London" }) {
  // State hook to store weather data
  const [weatherData, setWeatherData] = useState(null); // State stores weather data (null initially)
  const [loading, setLoading] = useState(true); // State to track loading status
  const [error, setError] = useState(null); // State to track any errors

  // useEffect hook to run the weather data fetching function when the component mounts or when the city changes
  useEffect(() => {
    // Function to fetch weather data from our backend API
    const fetchWeatherData = async () => {
      setLoading(true);
      setError(null);
      
      try {
        // Make request to our Flask backend
        const response = await axios.get(`http://127.0.0.1:5000/api/weather?city=${city}`);
        setWeatherData(response.data);
      } catch (err) {
        console.error("Error fetching weather:", err);
        setError("Failed to load weather data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchWeatherData(); // Call the function to fetch weather data

  }, [city]); // Re-run this effect whenever the city prop changes

  // If loading, show a loading message
  if (loading) {
    return <div className="loading-message">Loading weather data...</div>;
  }

  // If there was an error, show error message
  if (error) {
    return <div className="error-message">{error}</div>;
  }

  // If weather data is not yet available, show a loading message
  if (!weatherData) {
    return <div className="loading-message">No weather data available</div>;
  }

  return (
    
    <div className="weather-container"> {/* Container to hold weather Conditions page */}
      
      <div className="top-section"> {/* Container to hold Location name and forcast above columns */}
        
        <h2 className="location">{weatherData.name}</h2> {/* Display the city name */}
        <div className="forecast-gap"> {/* Placeholder for weekly forecast */}
          [ Weekly Forecast Goes Here ]
          </div> {/* Forecast-gap end */} 
      
      </div> {/* Top-Section end */}

      <div className="columns-container"> {/* Container to hold the bottom 3 columns */}
        
        <div className="left-column"> {/* Left Column Container - Displays sunrise, sunset, UV index, and air quality */}
          
          {/* Convert sunrise Unix timestamp to human-readable time using .toLocalTimeString() */}
          <p className="sunrise"><strong>Sunrise:</strong> {new Date(weatherData.sunrise * 1000).toLocaleTimeString()}</p> 
          
          {/* Convert sunset Unix timestamp to human-readable time using .toLocalTimeString()*/}
          <p className="sunset"><strong>Sunset:</strong> {new Date(weatherData.sunset * 1000).toLocaleTimeString()}</p> 
          
          <p><strong>UV Index:</strong> 5</p> {/* Placeholder value for UV Index */}
          <p><strong>Air Quality:</strong> Good</p> {/* Placeholder value for Air Quality */}
        
        </div> {/* Left-Column end */}

        <div className="middle-column"> {/* Middle Column Container - Displays general weather condition, description, and wind data */}
          
          <div className="condition-container"> {/* Conditions container to combine Weather condition and description */}
            
            <p className="condition"><strong>Condition: </strong>{weatherData.weather}</p> {/* General weather condition (e.g., Clear, Rain) */}
            <p className="description"><strong>Description: </strong>{weatherData.description}</p> {/* Detailed weather description */}
          
          </div> {/* Condition-Container end */}

          <div className="image-gap"> {/* Container to hold the weather image */}
            
            <img src={rainImage} alt="Weather Icon" /> {/* Image representing the weather condition (rain image as placeholder) */}
          
          </div>{/* image-gap end */}

          <div className="wind-container"> {/* Wind container to combine wind speed, direction, and gust */}
            
            {/* Wind statistics display in MPH and Degrees (due to 'units=imperial' in the URL) */}
            <p className="wind-speed"><strong>Wind Speed: </strong>{weatherData.wind_speed} mph</p> {/* Wind speed in mph */}
            <p className="wind-direction"><strong>Wind Direction: </strong>{weatherData.wind_direction}°</p> {/* Wind direction in degrees */}
            <p className="wind-gust"><strong>Wind Gust: </strong>{weatherData.wind_gust} mph</p> {/* Wind gust speed in mph */}
          
          </div> {/* Wind-Container end */}
        
        </div> {/* Middle-Column end */}

        <div className="right-column">{/* Right Column Container - Displays temperature-related data */}
          
          {/* Temperature Stats display in Fahrenheit (due to 'units=imperial' in the URL) */}
          <p className="temperature"><strong>Current Temperature:</strong> {weatherData.temperature}°F</p> {/* Displays Current temperature */}
          <p><strong>Feels Like:</strong> {weatherData.feels_like}°F</p> {/* Displays Feels like temperature */}
          <p><strong>Today's High:</strong> {weatherData.temp_max}°F</p> {/* Displays Today's maximum temperature */}
          <p><strong>Today's Low:</strong> {weatherData.temp_min}°F</p> {/* Displays Today's minimum temperature */}
        
        </div> {/* Right-Column end */}
      
      </div> {/* Columns-Container end */}
    
    {/* Weather-Container end */}
    </div>
  );
}

// Export the function for app.js use
export default WeatherConditionsPage;