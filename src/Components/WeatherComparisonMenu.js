// Components/WeatherComparisonMenu.js
import React, { useState } from 'react';
import axios from 'axios';
import './WeatherComparisonMenu.css';

const WeatherComparisonMenu = () => {
  const [locations, setLocations] = useState(['', '']);
  const [weatherData, setWeatherData] = useState([null, null]);
  const [comparisonResult, setComparisonResult] = useState(null);

  const apiKey = '24106620cbdbd0abf71e61d0ebf6ed83';

  const fetchWeatherData = async (location, index) => {
    try {
      const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${apiKey}&units=imperial`
      );

      const weatherInfo = {
        city: response.data.name,
        state: response.data.sys.country, // Assuming country as state for simplicity
        temp: `${response.data.main.temp}°F`,
        feelsLike: `${response.data.main.feels_like}°F`,
        condition: response.data.weather[0].description,
        windDirection: 'N/A', // OpenWeather API does not provide wind direction directly
        windSpeed: `${response.data.wind.speed} mph`,
        sunset: new Date(response.data.sys.sunset * 1000).toLocaleTimeString(),
        uvIndex: 'N/A', // UV Index is available in a different API endpoint
        airQuality: 'N/A' // Air Quality is available in a different API endpoint
      };

      const newWeatherData = [...weatherData];
      newWeatherData[index] = weatherInfo;
      setWeatherData(newWeatherData);
    } catch (error) {
      console.error('Error fetching weather data:', error);
      alert('Error fetching weather data. Please try again.');
    }
  };

  const handleAddLocation = (index) => {
    const location = locations[index];
    if (location) {
      fetchWeatherData(location, index);
    }
  };

  const handleCompareStatistics = () => {
    const [data1, data2] = weatherData;
    if (data1 && data2) {
      const result = {
        tempDifference: `${data1.temp} vs ${data2.temp}`,
        feelsLikeDifference: `${data1.feelsLike} vs ${data2.feelsLike}`,
        conditionComparison: `${data1.condition} vs ${data2.condition}`,
        windSpeedComparison: `${data1.windSpeed} vs ${data2.windSpeed}`,
        uvIndexComparison: `${data1.uvIndex} vs ${data2.uvIndex}`,
        airQualityComparison: `${data1.airQuality} vs ${data2.airQuality}`
      };
      setComparisonResult(result);
    } else {
      alert('Please add two locations to compare.');
    }
  };

  return (
    <div className="comparison-menu">
      {weatherData.map((data, index) => (
        <div key={index} className="weather-container">
          <div className="location-input">
            <input
              type="text"
              placeholder={`Enter Location ${index + 1}`}
              value={locations[index]}
              onChange={(e) => {
                const newLocations = [...locations];
                newLocations[index] = e.target.value;
                setLocations(newLocations);
              }}
            />
            <button onClick={() => handleAddLocation(index)}>
              Add Location {index + 1}
            </button>
          </div>
          {data && (
            <div className="weather-details">
              <p>Temperature: {data.temp}</p>
              <p>Feels Like: {data.feelsLike}</p>
              <p>Condition: {data.condition}</p>
              <p>Wind Speed: {data.windSpeed}</p>
              <p>UV Index: {data.uvIndex}</p>
              <p>Air Quality: {data.airQuality}</p>
            </div>
          )}
        </div>
      ))}
      <button onClick={handleCompareStatistics} className="compare-button">
        Compare Statistics
      </button>
      {comparisonResult && (
        <div className="comparison-result">
          <h3>Comparison Result</h3>
          <p>Temperature: {comparisonResult.tempDifference}</p>
          <p>Feels Like: {comparisonResult.feelsLikeDifference}</p>
          <p>Condition: {comparisonResult.conditionComparison}</p>
          <p>Wind Speed: {comparisonResult.windSpeedComparison}</p>
          <p>UV Index: {comparisonResult.uvIndexComparison}</p>
          <p>Air Quality: {comparisonResult.airQualityComparison}</p>
        </div>
      )}
    </div>
  );
};

export default WeatherComparisonMenu;
