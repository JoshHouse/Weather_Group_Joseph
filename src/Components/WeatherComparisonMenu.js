// Components/WeatherComparisonMenu.js
import React, { useState } from 'react';
import axios from 'axios';
import './WeatherComparisonMenu.css';

const WeatherComparisonMenu = () => {
  const [locations, setLocations] = useState(['', '']);
  const [weatherData, setWeatherData] = useState([null, null]);
  const [comparisonResult, setComparisonResult] = useState(null);
  const [loading, setLoading] = useState([false, false]);
  const [error, setError] = useState(null);

  const fetchWeatherData = async (location, index) => {
    if (!location.trim()) {
      return;
    }
    
    // Update loading state for this index
    const newLoading = [...loading];
    newLoading[index] = true;
    setLoading(newLoading);
    
    setError(null);
    
    try {
      // Call our backend API
      const response = await axios.get(`http://127.0.0.1:5000/api/weather?city=${location}`);
      
      // Format the data for display
      const formattedData = {
        city: response.data.name,
        temp: `${Math.round(response.data.temperature)}°F`,
        feelsLike: `${Math.round(response.data.feels_like)}°F`,
        condition: response.data.weather,
        windDirection: `${response.data.wind_direction}°`,
        windSpeed: `${response.data.wind_speed} mph`,
        sunset: new Date(response.data.sunset * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        uvIndex: '3', // Placeholder - would need a separate API call
        airQuality: 'Good' // Placeholder - would need a separate API call
      };
      
      // Update weather data for this index
      const newWeatherData = [...weatherData];
      newWeatherData[index] = formattedData;
      setWeatherData(newWeatherData);
    } catch (err) {
      console.error(`Error fetching weather for ${location}:`, err);
      setError(`Failed to fetch data for ${location}. Please check the city name and try again.`);
    } finally {
      // Update loading state
      const newLoading = [...loading];
      newLoading[index] = false;
      setLoading(newLoading);
    }
  };

  const handleAddLocation = (index) => {
    const location = locations[index];
    if (location) {
      fetchWeatherData(location, index);
    } else {
      setError("Please enter a location name.");
    }
  };

  const handleCompareStatistics = () => {
    const [data1, data2] = weatherData;
    if (data1 && data2) {
      // Calculate temperature difference
      const temp1 = parseFloat(data1.temp);
      const temp2 = parseFloat(data2.temp);
      const tempDiff = Math.abs(temp1 - temp2).toFixed(1);
      
      const result = {
        tempDifference: `${data1.temp} vs ${data2.temp} (${tempDiff}°F difference)`,
        feelsLikeDifference: `${data1.feelsLike} vs ${data2.feelsLike}`,
        conditionComparison: `${data1.condition} vs ${data2.condition}`,
        windSpeedComparison: `${data1.windSpeed} vs ${data2.windSpeed}`,
        uvIndexComparison: `${data1.uvIndex} vs ${data2.uvIndex}`,
        airQualityComparison: `${data1.airQuality} vs ${data2.airQuality}`
      };
      setComparisonResult(result);
    } else {
      setError('Please add two locations to compare.');
    }
  };

  // Clear a location
  const handleClearLocation = (index) => {
    const newLocations = [...locations];
    newLocations[index] = '';
    setLocations(newLocations);
    
    const newWeatherData = [...weatherData];
    newWeatherData[index] = null;
    setWeatherData(newWeatherData);
    
    // Clear comparison result if either location is cleared
    setComparisonResult(null);
  };

  // Compare both locations using the backend API
  const handleCompareWithAPI = async () => {
    if (!locations[0] || !locations[1]) {
      setError('Please enter both locations to compare.');
      return;
    }
    
    setLoading([true, true]);
    setError(null);
    
    try {
      const response = await axios.get(
        `http://127.0.0.1:5000/api/compare?city1=${locations[0]}&city2=${locations[1]}`
      );
      
      // Update both weather data entries
      setWeatherData(response.data);
      
      // Generate comparison result
      if (response.data.length === 2) {
        const [data1, data2] = response.data;
        
        // Extract temperature values for difference calculation
        const temp1 = parseFloat(data1.temp);
        const temp2 = parseFloat(data2.temp);
        const tempDiff = Math.abs(temp1 - temp2).toFixed(1);
        
        const result = {
          tempDifference: `${data1.temp} vs ${data2.temp} (${tempDiff}°F difference)`,
          feelsLikeDifference: `${data1.feelsLike} vs ${data2.feelsLike}`,
          conditionComparison: `${data1.condition} vs ${data2.condition}`,
          windSpeedComparison: `${data1.windSpeed} vs ${data2.windSpeed}`,
          uvIndexComparison: `${data1.uvIndex} vs ${data2.uvIndex}`,
          airQualityComparison: `${data1.airQuality} vs ${data2.airQuality}`
        };
        setComparisonResult(result);
      }
    } catch (err) {
      console.error('Error comparing locations:', err);
      setError('Failed to compare locations. Please check city names and try again.');
    } finally {
      setLoading([false, false]);
    }
  };

  return (
    <div className="comparison-menu">
      <h2>Compare Weather Between Cities</h2>
      
      {error && <div className="error-message">{error}</div>}
      
      <div className="locations-container">
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
              <div className="input-buttons">
                <button 
                  onClick={() => handleAddLocation(index)}
                  disabled={loading[index] || !locations[index].trim()}
                >
                  {loading[index] ? "Loading..." : `Add Location ${index + 1}`}
                </button>
                {data && (
                  <button 
                    onClick={() => handleClearLocation(index)}
                    className="clear-button"
                  >
                    Clear
                  </button>
                )}
              </div>
            </div>
            {data && (
              <div className="weather-details">
                <h3>{data.city}</h3>
                <div className="details-grid">
                  <p><strong>Temperature:</strong> {data.temp}</p>
                  <p><strong>Feels Like:</strong> {data.feelsLike}</p>
                  <p><strong>Condition:</strong> {data.condition}</p>
                  <p><strong>Wind Speed:</strong> {data.windSpeed}</p>
                  <p><strong>Wind Direction:</strong> {data.windDirection}</p>
                  <p><strong>Sunset:</strong> {data.sunset}</p>
                  <p><strong>UV Index:</strong> {data.uvIndex}</p>
                  <p><strong>Air Quality:</strong> {data.airQuality}</p>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
      
      <div className="comparison-actions">
        <button 
          onClick={handleCompareWithAPI} 
          className="compare-button"
          disabled={loading.some(isLoading => isLoading)}
        >
          Compare Cities
        </button>
        
        <button 
          onClick={handleCompareStatistics} 
          className="compare-button"
          disabled={!weatherData[0] || !weatherData[1]}
        >
          Compare Statistics
        </button>
      </div>
      
      {comparisonResult && (
        <div className="comparison-result">
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
