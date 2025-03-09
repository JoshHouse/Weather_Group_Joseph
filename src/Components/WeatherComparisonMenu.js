// Components/WeatherComparisonMenu.js
import React, { useState } from 'react';
import './WeatherComparisonMenu.css';

const WeatherComparisonMenu = () => {
  const [locations, setLocations] = useState(['', '']);
  const [weatherData, setWeatherData] = useState([null, null]);
  const [comparisonResult, setComparisonResult] = useState(null);

  const fetchWeatherData = async (location, index) => {
    // Replace with actual API call
    const mockData = {
      city: 'Sample City',
      state: 'Sample State',
      temp: '72°F',
      feelsLike: '70°F',
      condition: 'Clear',
      windDirection: 'NW',
      windSpeed: '5 mph',
      sunset: '6:30 PM',
      uvIndex: '3',
      airQuality: 'Good'
    };

    const newWeatherData = [...weatherData];
    newWeatherData[index] = mockData;
    setWeatherData(newWeatherData);
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
