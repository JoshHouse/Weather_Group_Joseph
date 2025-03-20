import React, { useState } from "react";
import axios from "axios";
import "./WeatherComparisonMenu.css";
import { 
  formatLocationQuery, 
  getWeatherBackground,
  getWindDirection,
  API_BASE_URL,
  API_ENDPOINTS
} from "../utils/weatherUtils";

const WeatherComparisonMenu = () => {
  const [locations, setLocations] = useState(["", ""]);
  const [weatherData, setWeatherData] = useState([null, null]);
  const [comparisonResult, setComparisonResult] = useState(null);
  const [loading, setLoading] = useState([false, false]);
  const [error, setError] = useState(null);
  const [showTemperatureComparison, setShowTemperatureComparison] = useState(false);

  const fetchWeatherData = async (location, index) => {
    if (!location.trim()) return;

    const newLoading = [...loading];
    newLoading[index] = true;
    setLoading(newLoading);
    setError(null);

    try {
      // Format the location query to ensure proper API handling
      const formattedLocation = formatLocationQuery(location);
      
      // Fetch basic weather data
      const weatherResponse = await axios.get(`${API_BASE_URL}${API_ENDPOINTS.WEATHER}?city=${formattedLocation}`);
      const weatherResponseData = weatherResponse.data;
      
      if (!weatherResponseData || !weatherResponseData.lat || !weatherResponseData.lon) {
        throw new Error(`No valid coordinates found for ${formattedLocation}`);
      }
      
      // Fetch UV Index data
      const uvResponse = await axios.get(`${API_BASE_URL}${API_ENDPOINTS.UV_INDEX}?lat=${weatherResponseData.lat}&lon=${weatherResponseData.lon}`);
      
      // Fetch Air Quality data
      const airResponse = await axios.get(`${API_BASE_URL}${API_ENDPOINTS.AIR_QUALITY}?lat=${weatherResponseData.lat}&lon=${weatherResponseData.lon}`);
      
      const formattedData = {
        city: weatherResponseData.name,
        temp: `${Math.round(weatherResponseData.temperature)}°F`,
        feelsLike: `${Math.round(weatherResponseData.feels_like)}°F`,
        condition: weatherResponseData.weather,
        windSpeed: `${weatherResponseData.wind_speed} mph`,
        windDirection: getWindDirection(weatherResponseData.wind_direction),
        sunset: new Date(weatherResponseData.sunset * 1000).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        uvIndex: uvResponse.data.uvIndex,
        airQuality: airResponse.data.description,
        lat: weatherResponseData.lat,
        lon: weatherResponseData.lon
      };

      const newWeatherData = [...weatherData];
      newWeatherData[index] = formattedData;
      setWeatherData(newWeatherData);
    } catch (err) {
      console.error(`Error fetching weather for ${location}:`, err);
      setError(`Failed to fetch data for ${location}. Please check the city name and try again.`);
    } finally {
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

  // Helper text for location input
  const locationInputHelp = "Enter city name, city and state (e.g., 'New York, NY'), or city and country (e.g., 'Paris, FR')";

  const handleCompareStatistics = () => {
    const [data1, data2] = weatherData;
    if (data1 && data2) {
      const temp1 = parseFloat(data1.temp);
      const temp2 = parseFloat(data2.temp);
      const tempDiff = Math.abs(temp1 - temp2).toFixed(1);
      const warmerCity = temp1 > temp2 ? data1.city : data2.city;
      const coolerCity = temp1 > temp2 ? data2.city : data1.city;
      const tempDiffPercent = ((Math.max(temp1, temp2) - Math.min(temp1, temp2)) / Math.min(temp1, temp2) * 100).toFixed(1);

      // Compare UV Index
      const uvIndex1 = parseFloat(data1.uvIndex) || 0;
      const uvIndex2 = parseFloat(data2.uvIndex) || 0;
      const uvDiff = Math.abs(uvIndex1 - uvIndex2).toFixed(1);
      const higherUVCity = uvIndex1 > uvIndex2 ? data1.city : data2.city;
      
      // Compare Air Quality
      const airQualityRanking = {
        "Good": 1,
        "Fair": 2,
        "Moderate": 3,
        "Poor": 4,
        "Very Poor": 5
      };
      
      const airQuality1 = airQualityRanking[data1.airQuality] || 0;
      const airQuality2 = airQualityRanking[data2.airQuality] || 0;
      const betterAirCity = airQuality1 < airQuality2 ? data1.city : data2.city;

      setComparisonResult({
        tempDifference: `${data1.temp} vs ${data2.temp} (${tempDiff}°F difference)`,
        tempComparison: `${warmerCity} is ${tempDiff}°F (${tempDiffPercent}%) warmer than ${coolerCity}`,
        feelsLikeDifference: `${data1.feelsLike} vs ${data2.feelsLike}`,
        conditionComparison: `${data1.condition} vs ${data2.condition}`,
        windSpeedComparison: `${data1.windSpeed} vs ${data2.windSpeed}`,
        uvIndexComparison: `${data1.uvIndex} vs ${data2.uvIndex} (${higherUVCity} has higher UV exposure)`,
        airQualityComparison: `${data1.airQuality} vs ${data2.airQuality} (${betterAirCity} has better air quality)`,
      });
      
      setShowTemperatureComparison(true);
    } else {
      setError("Please add two locations to compare.");
    }
  };

  const handleClearLocation = (index) => {
    const newLocations = [...locations];
    newLocations[index] = "";
    setLocations(newLocations);

    const newWeatherData = [...weatherData];
    newWeatherData[index] = null;
    setWeatherData(newWeatherData);

    setComparisonResult(null);
  };

  return (
    <div className="comparison-menu">
      <h2>Compare Weather Between Cities</h2>

      {error && <div className="error-message">{error}</div>}

      <div className="locations-container">
        {weatherData.map((data, index) => (
          <div
            key={index}
            className="weather-container"
            style={data ? {
              backgroundImage: `url(${getWeatherBackground(data.condition)})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
              color: "#ffffff",
              textShadow: "1px 1px 3px rgba(0, 0, 0, 0.8)",
            } : {}}
          >
            <div className="location-input">
              <input
                type="text"
                placeholder={`Enter Location ${index + 1}`}
                title={locationInputHelp}
                value={locations[index]}
                onChange={(e) => {
                  const newLocations = [...locations];
                  newLocations[index] = e.target.value;
                  setLocations(newLocations);
                }}
              />
              <div className="location-input-help">
                <small>Examples: "Chicago", "Miami, FL", "London, UK"</small>
              </div>
              <div className="input-buttons">
                <button onClick={() => handleAddLocation(index)} disabled={loading[index]}>
                  {loading[index] ? "Loading..." : `Add Location ${index + 1}`}
                </button>
                {data && (
                  <button onClick={() => handleClearLocation(index)} className="clear-button">
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
        <button onClick={handleCompareStatistics} className="compare-button" disabled={!weatherData[0] || !weatherData[1]}>
          Compare Temperatures
        </button>
      </div>

      {showTemperatureComparison && comparisonResult && (
        <div className="comparison-result">
          <h3>Temperature Comparison</h3>
          <div className="temperature-comparison">
            <p className="temp-diff-highlight">{comparisonResult.tempComparison}</p>
            <p><strong>Temperature:</strong> {comparisonResult.tempDifference}</p>
            <p><strong>Feels Like:</strong> {comparisonResult.feelsLikeDifference}</p>
          </div>
          
          <h4>Other Weather Factors</h4>
          <div className="result-grid">
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
