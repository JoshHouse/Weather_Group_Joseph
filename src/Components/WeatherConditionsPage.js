import React, { useState, useEffect } from "react";
import "./WeatherConditionsPage.css";
import rainImage from "../assets/images/rain.png"; // Import rain placeholder image

// Passes in city from app.js to implement search functionality
function WeatherConditionsPage({ city }) {
  // State to store weather data
  const [weatherData, setWeatherData] = useState('London');

  // My API key *DO NOT USE*
  const apiKey = "a7ecb5d8aaa97f57473de04085971f14";

  // Function called when component is mounted or when city is updated
  useEffect(() => {
    // fetchWeatherData based on city set on passed in city from app.js
    const fetchWeatherData = () => {
      // Constructs url
      const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=imperial`;

      // Makes a call to the api
      fetch(url)
        .then(response => {
          // Throws an error if response is !okay
          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }
          return response.json();
        })
        .then(data => {
          // Sets weather data to response from API
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
        })
        // Catch any errors encountered
        .catch(error => console.error("Error fetching weather:", error));
    };

    // Call the fetchWeatherData function
    fetchWeatherData();
  }, [city]); // Fetch data when the city changes

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