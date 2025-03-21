// Import necessary libraries
import React, { useState, useEffect } from "react"; // React hooks: useState for managing state, useEffect for handling side effects
import axios from "axios"; // For making HTTP requests
import "./WeatherConditionsPage.css"; // Import Component CSS styling
// Import weather background GIFs
import cloudyGif from "../Assets/images/Cloudy.gif";
import rainGif from "../Assets/images/Rain.gif";
import snowGif from "../Assets/images/Snow.gif";
import sunnyGif from "../Assets/images/Sunny.gif";
import thunderstormsGif from "../Assets/images/Thunderstroms.gif";

// Function to get the appropriate weather background GIF based on the weather condition
function getWeatherBackground(weatherCondition) {
  // Convert to lowercase for case-insensitive matching
  const condition = weatherCondition.toLowerCase();
  
  // Map weather conditions to their corresponding background GIFs
  if (condition.includes('cloud') || condition.includes('overcast') || condition.includes('fog') || condition.includes('mist')) {
    return cloudyGif;
  } else if (condition.includes('rain') || condition.includes('drizzle') || condition.includes('shower')) {
    return rainGif;
  } else if (condition.includes('snow') || condition.includes('sleet') || condition.includes('hail') || condition.includes('ice')) {
    return snowGif;
  } else if (condition.includes('thunder') || condition.includes('storm') || condition.includes('lightning')) {
    return thunderstormsGif;
  } else if (condition.includes('clear') || condition.includes('sun') || condition.includes('fair')) {
    return sunnyGif;
  } else {
    // Default to sunny if condition doesn't match any known patterns
    return sunnyGif;
  }
}

function WeatherConditionsPage({ city = "London", weatherData: propWeatherData = null }) {
  // State hook to store weather data
  const [weatherData, setWeatherData] = useState(propWeatherData); // Initialize with prop data if provided
  const [loading, setLoading] = useState(propWeatherData === null); // Only set loading to true if we need to fetch data
  const [error, setError] = useState(null); // State to track any errors

  // useEffect hook to run the weather data fetching function when the component mounts or when the city changes
  useEffect(() => {
    // If weather data was provided as a prop, no need to fetch
    if (propWeatherData) {
      setWeatherData(propWeatherData);
      setLoading(false);
      return;
    }

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

  }, [city, propWeatherData]); // Re-run this effect whenever the city or propWeatherData changes

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
    
    <div 
      className="weather-container"
      style={{ 
        backgroundImage: `url(${getWeatherBackground(weatherData.weather)})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        color: '#ffffff', // Bright text color for better visibility
        textShadow: '1px 1px 3px rgba(0, 0, 0, 0.8)', // Text shadow for better readability
        padding: '30px',
        borderRadius: '10px',
      }}
    > {/* Container to hold weather Conditions page with dynamic background */}
      
      <div className="top-section" style={{ color: '#ffffff' }}> {/* Container to hold Location name above columns */}
        
        <h2 className="location" style={{ color: '#ffffff', fontSize: '32px' }}>{weatherData.name}</h2> {/* Display the city name */}
      
      </div> {/* Top-Section end */}

      <div className="columns-container"> {/* Container to hold the bottom 3 columns */}
        
        <div className="left-column" style={{ 
          backgroundColor: 'rgba(0, 0, 0, 0.5)', 
          padding: '15px', 
          borderRadius: '8px',
          color: '#ffffff'
        }}> {/* Left Column Container - Displays sunrise, sunset, UV index, and air quality */}
          
          {/* Convert sunrise Unix timestamp to human-readable time using .toLocalTimeString() */}
          <p className="sunrise"><strong>Sunrise:</strong> {new Date(weatherData.sunrise * 1000).toLocaleTimeString()}</p> 
          
          {/* Convert sunset Unix timestamp to human-readable time using .toLocalTimeString()*/}
          <p className="sunset"><strong>Sunset:</strong> {new Date(weatherData.sunset * 1000).toLocaleTimeString()}</p> 
          
          <p><strong>UV Index:</strong> 5</p> {/* Placeholder value for UV Index */}
          <p><strong>Air Quality:</strong> Good</p> {/* Placeholder value for Air Quality */}
        
        </div> {/* Left-Column end */}

        <div className="middle-column" style={{ 
          backgroundColor: 'rgba(0, 0, 0, 0.5)', 
          padding: '15px', 
          borderRadius: '8px',
          color: '#ffffff'
        }}> {/* Middle Column Container - Displays general weather condition, description, and wind data */}
          
          <div className="condition-container"> {/* Conditions container to combine Weather condition and description */}
            
            <p className="condition"><strong>Condition: </strong>{weatherData.weather}</p> {/* General weather condition (e.g., Clear, Rain) */}
            <p className="description"><strong>Description: </strong>{weatherData.description}</p> {/* Detailed weather description */}
          
          </div> {/* Condition-Container end */}

          {/* Weather image section removed */}

          <div className="wind-container"> {/* Wind container to combine wind speed, direction, and gust */}
            
            {/* Wind statistics display in MPH and Degrees (due to 'units=imperial' in the URL) */}
            <p className="wind-speed"><strong>Wind Speed: </strong>{weatherData.wind_speed} mph</p> {/* Wind speed in mph */}
            <p className="wind-direction"><strong>Wind Direction: </strong>{weatherData.wind_direction}°</p> {/* Wind direction in degrees */}
            <p className="wind-gust"><strong>Wind Gust: </strong>{weatherData.wind_gust} mph</p> {/* Wind gust speed in mph */}
          
          </div> {/* Wind-Container end */}
        
        </div> {/* Middle-Column end */}

        <div className="right-column" style={{ 
          backgroundColor: 'rgba(0, 0, 0, 0.5)', 
          padding: '15px', 
          borderRadius: '8px',
          color: '#ffffff'
        }}>{/* Right Column Container - Displays temperature-related data */}
          
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