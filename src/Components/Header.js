import React, { useState, useEffect } from "react";
import { Search } from "lucide-react";
import './Header.css';

// onSearch function passed from app.js to set app.js's searched city for current weather conditions page
const Header = ({ onSearch }) => {
    // State hooks to store weather data and the city name
    
    // State stores the city name to pass to weather conditions page (default to "London")
    const [city, setCity] = useState("London"); 
    // State stores current location city name (setCurrCity will be used when we have location tracking)
    const [currCity, setCurrCity] = useState("London"); 
    // State stores weather data for current location city
    const [locationData, setLocationData] = useState(null);
    

    // My API key for OpenWeather *DO NOT USE*
    const apiKey = "a7ecb5d8aaa97f57473de04085971f14"; 


    // Tracks when user presses enter to search.
    const handleSearch = (event) => {
        if (event.key === "Enter") {
          // Call the onSearch prop to pass the searched location to the parent (app.js)
          onSearch(city); 
        }
    };
    
    // useEffect hook to run the weather data fetching function when the component mounts or when the currCity changes
    useEffect(() => {
        // Function to fetch weather data from OpenWeatherMap API
        const fetchWeatherData = () => {
            // Constructing the URL to make the API call
            const url = `https://api.openweathermap.org/data/2.5/weather?q=${currCity}&appid=${apiKey}&units=imperial`;

            // Fetching the weather data from the API using constructed URL
            fetch(url).then(response => {
                // If the response is not OK, throw an error with the response code
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                // Parse the JSON response
                return response.json();
                })
            .then(data => {
                    // Set the state with the current Location data
                    setLocationData({
                        name: data.name, // City name
                        weather: data.weather[0].main, // General weather condition (e.g. Rain)
                        temperature: data.main.temp, // Current temperature in Fahrenheit (due to 'units=imperial' in the URL)
                    });
                })
            .catch(error => console.error("Error fetching weather:", error)); // Log any errors encountered
        };

        fetchWeatherData(); // Call the function to fetch weather data

    }, [currCity]); // Re-run this effect whenever the 'currCity' state changes
    

    // If weather data is not yet available, show a loading message
    if (!locationData) {
        return <div>Loading weather data...</div>;
    }

    return (
        <header className="header-container"> {/* Header Wrapper Div */}
            
            <div className="search-container"> {/* Search Wrapper Div */}
                {/* Search input element */}
                <input
                    type="text"
                    placeholder="Enter city..."
                    onChange={(e) => setCity(e.target.value)} // set City to value as user makes changes
                    onKeyDown={handleSearch} // Check if the value inputted is enter in the handleSearch function
                    className="search-input"
                />
                {/* Magnifying Glass Icon */}
                <Search className="search-icon" />
            </div>

            {/* Weather Info */}
            <div className="weather-info"> {/* Weather Info Wrapper Div */}
                <p className="weather-location"><strong>Location: </strong>{locationData.name}</p>
                <p className="weather-description"><strong>Weather Conditions: </strong>{locationData.weather}</p>
                <p className="weather-temperature"><strong>Temperature: </strong>{locationData.temperature}°F</p>
            </div>

        </header>
    );
};

export default Header;