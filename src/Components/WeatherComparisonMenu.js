import React, { useState } from 'react';
import './WeatherComparisonMenu.css';
// Import weather background GIFs
import cloudyGif from "../Assets/images/Cloudy.gif";
import rainGif from "../Assets/images/Rain.gif";
import snowGif from "../Assets/images/Snow.gif";
import sunnyGif from "../Assets/images/Sunny.gif";
import thunderstormsGif from "../Assets/images/Thunderstroms.gif";
import { BACKEND_BASE_URLS, BACKEND_ENDPOINTS } from "../utils/frontEndUtils";

// Function to get the appropriate weather background GIF based on the weather condition
function getWeatherBackground(weatherCondition) {
  if (!weatherCondition) return sunnyGif;
  
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

const WeatherComparisonMenu = () => {
  const [locationOne, setLocationOne] = useState(null);
  const [locationTwo, setLocationTwo] = useState(null);
  const [locationOneData, setLocationOneData] = useState(null);
  const [locationTwoData, setLocationTwoData] = useState(null);
  const [comparisonResult, setComparisonResult] = useState(null);

  const fetchWeatherData = async (locationName, locationNum) => {
    try {
      // Call our backend API using fetch
      const response = await fetch(`${BACKEND_BASE_URLS.SAVED_SEARCHES}${BACKEND_ENDPOINTS.SAVED_SEARCHES}?city=${locationName}`);
      
      // Check if the response is OK (status code 200-299)
      if (!response.ok) {
        throw new Error(`Error fetching weather for ${locationName}`);
      }
      
      // Parse the JSON data
      const data = await response.json();
      
      // Format the data for display
      const formattedData = {
        city: data.name,
        temp: data.main.temp,
        feelsLike: data.main.feels_like,
        condition: data.weather[0].description, // Assuming the condition is an array, access the first object
        windDirection: data.wind.deg,
        windSpeed: data.wind.speed,
        sunset: new Date(data.sys.sunset * 1000).toLocaleTimeString(),
        uvIndex: '3', // Placeholder - would need a separate API call
        airQuality: 'Good' // Placeholder - would need a separate API call
      };
      
      if (locationNum == 1) {
        setLocationOneData(formattedData);
      } else {
        setLocationTwoData(formattedData);
      }
    } catch (err) {
      console.error(`Error fetching weather for ${locationName}:`, err);
    }
  };
  

  const handleCompareStatistics = () => {
    if (locationOneData && locationTwoData) {
      
      const result = {
        tempDifference: `${locationOneData.temp} vs ${locationTwoData.temp} (${locationOneData.temp - locationTwoData.temp}°F difference)`,
        feelsLikeDifference: `${locationOneData.feelsLike} vs ${locationTwoData.feelsLike}`,
        conditionComparison: `${locationOneData.condition} vs ${locationTwoData.condition}`,
        windSpeedComparison: `${locationOneData.windSpeed} vs ${locationTwoData.windSpeed}`,
        uvIndexComparison: `${locationOneData.uvIndex} vs ${locationTwoData.uvIndex}`,
        airQualityComparison: `${locationOneData.airQuality} vs ${locationTwoData.airQuality}`
      };
      setComparisonResult(result);
    } else {
      console.error('Please select 2 cities to compare');
    }
  };


  return (
    <div className="comparison-menu">
      <h2>Compare Weather Between Cities</h2>
      
      <div className="location-one-container">
            <div className="location-input">
              <input
                type="text"
                placeholder={`Enter Location 1`}
                onChange={(e) => {
                  setLocationOne(e.target.value);
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    setLocationOneData(fetchWeatherData(locationOne, 1));
                  }}}
              />
            </div>

            {locationOneData && (
              <div className="weather-details">
                <h3>{locationOneData.city}</h3>
                <div className="details-grid">
                  <p><strong>Temperature:</strong> {locationOneData.temp}</p>
                  <p><strong>Feels Like:</strong> {locationOneData.feelsLike}</p>
                  <p><strong>Condition:</strong> {locationOneData.condition}</p>
                  <p><strong>Wind Speed:</strong> {locationOneData.windSpeed}</p>
                  <p><strong>Wind Direction:</strong> {locationOneData.windDirection}</p>
                  <p><strong>Sunset:</strong> {locationOneData.sunset}</p>
                  <p><strong>UV Index:</strong> {locationOneData.uvIndex}</p>
                  <p><strong>Air Quality:</strong> {locationOneData.airQuality}</p>
                </div>
              </div>
            )}
      </div>

      <div className="location-two-container">
            <div className="location-input">
              <input
                type="text"
                placeholder={`Enter Location 1`}
                onChange={(e) => {
                  setLocationTwo(e.target.value);
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    setLocationTwoData(fetchWeatherData(locationTwo, 2));
                  }}}
              />
            </div>
            
            {locationTwoData && (
              <div className="weather-details">
                <h3>{locationTwoData.city}</h3>
                <div className="details-grid">
                  <p><strong>Temperature:</strong> {locationTwoData.temp}</p>
                  <p><strong>Feels Like:</strong> {locationTwoData.feelsLike}</p>
                  <p><strong>Condition:</strong> {locationTwoData.condition}</p>
                  <p><strong>Wind Speed:</strong> {locationTwoData.windSpeed}</p>
                  <p><strong>Wind Direction:</strong> {locationTwoData.windDirection}</p>
                  <p><strong>Sunset:</strong> {locationTwoData.sunset}</p>
                  <p><strong>UV Index:</strong> {locationTwoData.uvIndex}</p>
                  <p><strong>Air Quality:</strong> {locationTwoData.airQuality}</p>
                </div>
              </div>
            )}
      </div>
      
      <div className="comparison-actions">
        <button 
          onClick={handleCompareStatistics} 
          className="compare-button"
        >
          Compare Cities
        </button>
      </div>
      
      {comparisonResult && (
        <div className="comparison-result" style={{ 
          backgroundImage: `linear-gradient(to right, rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(${getWeatherBackground(weatherData[0]?.condition)}), url(${getWeatherBackground(weatherData[1]?.condition)})`,
          backgroundSize: '50% 100%, 50% 100%',
          backgroundPosition: 'left top, right top',
          backgroundRepeat: 'no-repeat',
        }}>
          <h3>Comparison Result</h3>
          <div className="result-grid">
            <p><strong>Temperature:</strong> {comparisonResult.tempDifference}</p>
            <p><strong>Feels Like:</strong> {comparisonResult.feelsLikeDifference}</p>
            <p><strong>Condition:</strong> {comparisonResult.conditionComparison}</p>
            <p><strong>Wind Speed:</strong> {comparisonResult.windSpeedComparison}</p>
            <p><strong>UV Index:</strong> {comparisonResult.uvIndexComparison}</p>
            <p><strong>Air Quality:</strong> {comparisonResult.airQualityComparison}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default WeatherComparisonMenu;
