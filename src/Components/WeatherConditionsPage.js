// Import necessary libraries
import React, { useState, useEffect } from "react"; // React hooks: useState for managing state, useEffect for handling side effects
import "./WeatherConditionsPage.css"; // Import Component CSS styling
import rainImage from "../assets/images/rain.png"; // Import rain placeholder image

function WeatherConditionsPage() {
  // State hooks to store weather data and the city name
  const [weatherData, setWeatherData] = useState(null); // State stores weather data (null initially)
  const [city, setCity] = useState("London"); // State stores the city name (default to "London")
  
  // My API key for OpenWeather *DO NOT USE*
  const apiKey = "a7ecb5d8aaa97f57473de04085971f14"; 

  // useEffect hook to run the weather data fetching function when the component mounts or when the city changes
  useEffect(() => {
    // Function to fetch weather data from OpenWeatherMap API
    const fetchWeatherData = () => {
      // Constructing the URL to make the API call
      const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=imperial`;

      // Fetching the weather data from the API
      fetch(url)
        .then(response => {
          // If the response is not OK, throw an error
          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }
          // Parse the JSON response
          return response.json();
        })
        .then(data => {
          // Set the state with the weather data
          setWeatherData({
            name: data.name, // City name
            weather: data.weather[0].main, // General weather condition (e.g. Rain)
            description: data.weather[0].description, // Detailed description of the weather condition (e.g. light rain)
            temperature: data.main.temp, // Current temperature in Fahrenheit (due to 'units=imperial' in the URL)
            feels_like: data.main.feels_like, // Feels like temperature in Fahrenheit (due to 'units=imperial' in the URL)
            temp_max: data.main.temp_max, // Maximum temperature for the day in Fahrenheit (due to 'units=imperial' in the URL)
            temp_min: data.main.temp_min, // Minimum temperature for the day in Fahrenheit (due to 'units=imperial' in the URL)
            wind_speed: data.wind.speed, // Wind speed in miles per hour (due to 'units=imperial' in the URL)
            wind_direction: data.wind.deg, // Wind direction in degrees (0-360, where 0 = North)
            wind_gust: data.wind.gust || 0, // Wind gust speed in miles per hour (default to 0 if not available)
            sunrise: data.sys.sunrise, // Sunrise time in Unix timestamp
            sunset: data.sys.sunset, // Sunset time in Unix timestamp
          });
        })
        .catch(error => console.error("Error fetching weather:", error)); // Log any errors encountered
    };

    fetchWeatherData(); // Call the function to fetch weather data

  }, [city]); // Re-run this effect whenever the 'city' state changes

  // If weather data is not yet available, show a loading message
  if (!weatherData) {
    return <div>Loading weather data...</div>;
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