import React, { useState, useEffect } from "react";
import axios from "axios";
import { Search } from "lucide-react";
import './Header.css';

import WGJLogo from "../assets/images/WGJLogo.png"; // Import Logo

import { API_BASE_URL, API_ENDPOINTS } from "../utils/weatherUtils"; // Import API constants
import axios from "axios"; // Make sure axios is imported


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

    // Check for saved location or ask user to use current location
    const checkLocation = () => {
        const savedLocation = localStorage.getItem("defaultLocation");
        if (savedLocation) {
            const location = JSON.parse(savedLocation);
            fetchUserLocationWeather(location.lat, location.lon);
        } else {
            // Prompt the user if no location is saved
            const useCurrentLocation = window.confirm("Would you like to use your current location?");
            if (useCurrentLocation) {
                getUserLocation();
            }
        }
    };

    // Get user's geolocation on page load
    const getUserLocation = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    // Save the user's location
                    localStorage.setItem("defaultLocation", JSON.stringify({ lat: latitude, lon: longitude }));
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
    };


    // Handle search input
    const handleSearch = (event) => {
        if (event.key === "Enter" && city.trim() !== "") {
            onSearch(city.trim()); // Send search input to homepage
        }
    };

    // Fetch weather data based on city name
    const fetchWeather = async () => {
        if (!city) return;

        try {
            const response = await fetch(`http://127.0.0.1:5000/get_weather?city=${city}`);
            if (!response.ok) {
                throw new Error("Failed to fetch weather data");
            }
            const data = await response.json();


    const handleSearchClick = () => {
        if (city.trim() !== "") {
            onSearch(city.trim()); // Send search input to homepage
        }
    };

    useEffect(() => {
        checkLocation();
    }, []);

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
