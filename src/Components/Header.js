import React, { useState, useEffect } from "react";
import axios from "axios";
import { Search } from "lucide-react";
import './Header.css';
import WGJLogo from "../Assets/images/WGJLogo.png"; // Import Logo
import { API_BASE_URL, API_ENDPOINTS } from "../utils/weatherUtils"; // Import API constants

const Header = ({ onSearch }) => {
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
            const response = await axios.get(`${API_BASE_URL}${API_ENDPOINTS.WEATHER}?lat=${latitude}&lon=${longitude}`);
            if (response.data) {
                setLocationData({
                    name: response.data.name || "Unknown Location",
                    weather: response.data.weather || "N/A",
                    temperature: response.data.temperature || "N/A",
                });
            }
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

    // Handle search input
    const handleSearch = (event) => {
        if (event.key === "Enter" && city.trim() !== "") {
            onSearch(city.trim()); // Send search input to homepage
        }
    };

    const handleSearchClick = () => {
        if (city.trim() !== "") {
            onSearch(city.trim()); // Send search input to homepage
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
                    onKeyDown={handleSearch}
                    className="search-input"
                />
                <Search className="search-icon" onClick={handleSearchClick} />
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

            <div className="logo-container"> {/* Logo Wrapper Div */}
                <img src={WGJLogo} alt="Logo" className="logo" />
            </div>

        </header>
    );
};

export default Header;
