import React from "react";
import "./WeatherConditionsPage.css";
import rainImage from "../assets/images/rain.png";

function WeatherConditionsPage() {
    const weatherConditions = {
        coord: {
          lon: 7.367,
          lat: 45.133
        },
        weather: [
          {
            id: 501,
            main: "Rain",
            description: "Moderate rain",
            icon: "10d"
          }
        ],
        base: "stations",
        main: {
          temp: 51.05, 
          feels_like: 47.29, 
          temp_min: 46.53, 
          temp_max: 54.28, 
          pressure: 1021, 
          humidity: 60,
          sea_level: 1021,
          grnd_level: 910
        },
        visibility: 10000, 
        wind: {
          speed: 9.14, 
          deg: 121,
          gust: 7.77 
        },
        rain: {
          "1h": 2.73 
        },
        clouds: {
          all: 83
        },
        dt: 1726660758, 
        sys: {
          type: 1,
          id: 6736,
          country: "IT",
          sunrise: 1726636384,
          sunset: 1726680975
        },
        timezone: 7200,
        id: 3165523,
        name: "Province of Turin",
        cod: 200
      };
      

  return (
    <div className="weather-container">
      {/* Top Section: Location and Weekly Forecast */}
      <div className="top-section">
        <h2 className="location">{weatherConditions.name}</h2>

        {/* Space for Weekly Forecast */}
        <div className="forecast-gap">[ Weekly Forecast Goes Here ]</div>
      </div>

      {/* Bottom Section: Left, Middle, and Right Columns */}
      <div className="columns-container">
        {/* Left Column */}
        <div className="left-column">
          <p className="sunrise"><strong>Sunrise:</strong> {new Date(weatherConditions.sys.sunrise * 1000).toLocaleTimeString()}</p>
          <p className="sunset"><strong>Sunset:</strong> {new Date(weatherConditions.sys.sunset * 1000).toLocaleTimeString()}</p>
          <p><strong>UV Index:</strong> 5</p> {/* Placeholder value */}
          <p><strong>Air Quality:</strong> Good</p> {/* Placeholder value */}
        </div>

        {/* Middle Column */}
        <div className="middle-column">
          {/* Condition and Description */}
          <div className="condition-container">
            <p className="condition"><strong>Condition: </strong>{weatherConditions.weather[0].main}</p>
            <p className="description"><strong>Description: </strong>{weatherConditions.weather[0].description}</p>
          </div>

          {/* Weather Image Gap */}
          <div className="image-gap">
          <img src={rainImage} alt="Weather Icon" />
          </div>

          {/* Wind Speed, Direction, and Gust */}
          <div className="wind-container">
            <p className="wind-speed"><strong>Wind Speed: </strong>{weatherConditions.wind.speed} mph</p>
            <p className="wind-direction"><strong>Wind Direction: </strong>{weatherConditions.wind.deg}°</p>
            <p className="wind-gust"><strong>Wind Gust: </strong>{weatherConditions.wind.gust} mph</p>
          </div>
        </div>

        {/* Right Column */}
        <div className="right-column">
          <p className="temperature"><strong>Current Temperature:</strong> {weatherConditions.main.temp} F</p>
          <p><strong>Feels Like:</strong> {weatherConditions.main.feels_like} F</p>
          <p><strong>Today's High:</strong> {weatherConditions.main.temp_max} F</p>
          <p><strong>Today's Low:</strong> {weatherConditions.main.temp_min} F</p>
        </div>
      </div>
    </div>
  );
}

export default WeatherConditionsPage;