import React, { useState, useEffect } from "react";
import { Search } from "lucide-react";
import './Header.css';
import { BACKEND_BASE_URLS, BACKEND_ENDPOINTS } from "../utils/frontEndUtils"; // Import Backend constants

const Header = ({ setWeatherData, setActivePage }) => {
    const [locationData, setLocationData] = useState({
        name: "Allow location access...",
        weather: "N/A",
        temperature: "N/A",
    });
    const [isLoading, setIsLoading] = useState(true);
    const [locationError, setLocationError] = useState(null);
    const [city, setCity] = useState("");

    // Fetch weather data based on user location
    const fetchUserLocationWeather = async (latitude, longitude) => {
        try {
            const response = await fetch(`${ BACKEND_BASE_URLS.USER_CONDITIONS }${ BACKEND_ENDPOINTS.USER_CONDITIONS}?lat=${latitude}&lon=${longitude}`);
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            const data = await response.json();
            setLocationData({
                name: data.name || "Unknown Location",
                weather: data.weather[0].description || "N/A",
                temperature: data.main.temp || "N/A",
            });
        } catch (error) {
            console.error("Error fetching location-based weather:", error);
            setLocationError("Failed to load location-based weather.");
        } finally {
            setIsLoading(false);
        }
    };
    

    // Get user's geolocation on page load
    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    fetchUserLocationWeather(latitude, longitude);
                },
                (error) => {
                    console.error("Geolocation error:", error);
                    setLocationError("Location access denied. Enable location to view weather.");
                    setIsLoading(false);
                }
            );
        } else {
            setLocationError("Geolocation not supported.");
            setIsLoading(false);
        }
    }, []);

    const fetchWeather = async () => {
        if (!city) return;
    
        try {
            const response = await fetch(`${ BACKEND_BASE_URLS.SAVED_SEARCHES }${ BACKEND_ENDPOINTS.SAVED_SEARCHES}?city=${city}`);
            if (!response.ok) {
                throw new Error("Failed to fetch weather data");
            }
            const data = await response.json();

            // Format the data before setting state
            const formattedWeatherData = {
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
            };

            setWeatherData(formattedWeatherData);
            setActivePage("searched");
        } catch (error) {
            console.error("Error fetching weather data", error);
        }
    };

    return (
        <header className="header-container">
            <div className="search-container">
                <input
                    type="text"
                    placeholder="Search for any city..."
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        fetchWeather(); // Call the function properly
                      }
                    }}
                    className="search-input"
                />
                <Search className="search-icon" onClick={
                    fetchWeather} />
            </div>

            <div className="weather-info">
                {locationError ? (
                    <p className="error-message">{locationError}</p>
                ) : (
                    <>
                        <p className="weather-location"><strong>Location: </strong>{locationData.name}</p>
                        <p className="weather-description"><strong>Weather Conditions: </strong>{locationData.weather}</p>
                        <p className="weather-temperature"><strong>Temperature: </strong>{locationData.temperature}°F</p>
                    </>
                )}
            </div>

        </header>
    );
};

export default Header;
