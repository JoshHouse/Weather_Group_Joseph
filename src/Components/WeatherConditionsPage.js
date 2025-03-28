import React, { useContext } from "react";
import { AppContext } from "../AppContext";
import "./WeatherConditionsPage.css";

function getWeatherBackground(weatherCondition) {
  const condition = weatherCondition.toLowerCase();
  if (condition.includes('cloud') || condition.includes('overcast') || condition.includes('fog') || condition.includes('mist')) {
    return 'cloudyGif';
  } else if (condition.includes('rain') || condition.includes('drizzle') || condition.includes('shower')) {
    return 'rainGif';
  } else if (condition.includes('snow') || condition.includes('sleet') || condition.includes('hail') || condition.includes('ice')) {
    return 'snowGif';
  } else if (condition.includes('thunder') || condition.includes('storm') || condition.includes('lightning')) {
    return 'thunderstormsGif';
  } else if (condition.includes('clear') || condition.includes('sun') || condition.includes('fair')) {
    return 'sunnyGif';
  } else {
    return 'sunnyGif';
  }
}

function WeatherConditionsPage({ weatherData }) {
  const { units } = useContext(AppContext);
  const tempSymbol = units === "metric" ? "°C" : "°F";
  const speedUnit = units === "metric" ? "m/s" : "mph";

  if (!weatherData) return <p>Error: Weather Data Not Found</p>;

  return (
    <div className={`weather-conditions-container ${getWeatherBackground(weatherData.weather)}`}>
      <div className="top-section">
        <h2 className="location">{weatherData.name}</h2>
      </div>

      <div className="columns-container">
        <div className="left-column">
          <p className="sunrise"><strong>Sunrise:</strong> {new Date(weatherData.sunrise * 1000).toLocaleTimeString()}</p>
          <p className="sunset"><strong>Sunset:</strong> {new Date(weatherData.sunset * 1000).toLocaleTimeString()}</p>
          <p><strong>UV Index:</strong> 5</p>
          <p><strong>Air Quality:</strong> Good</p>
        </div>

        <div className="middle-column">
          <div className="condition-container">
            <p className="condition"><strong>Condition: </strong>{weatherData.weather}</p>
            <p className="description"><strong>Description: </strong>{weatherData.description}</p>
          </div>

          <div className="wind-container">
            <p className="wind-speed"><strong>Wind Speed: </strong>{weatherData.wind_speed} {speedUnit}</p>
            <p className="wind-direction"><strong>Wind Direction: </strong>{weatherData.wind_direction}°</p>
            <p className="wind-gust"><strong>Wind Gust: </strong>{weatherData.wind_gust} {speedUnit}</p>
          </div>
        </div>

        <div className="right-column">
          <p className="temperature"><strong>Current Temperature:</strong> {weatherData.temperature}{tempSymbol}</p>
          <p><strong>Feels Like:</strong> {weatherData.feels_like}{tempSymbol}</p>
          <p><strong>Today's High:</strong> {weatherData.temp_max}{tempSymbol}</p>
          <p><strong>Today's Low:</strong> {weatherData.temp_min}{tempSymbol}</p>
        </div>
      </div>
    </div>
  );
}

export default WeatherConditionsPage;
