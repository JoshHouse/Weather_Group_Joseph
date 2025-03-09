import React, { useState, useEffect } from "react";
//import { Input } from "../Components/ui/input";
import { Search } from "lucide-react";

const Header = () => {
    const [location, setLocation] = useState(""); // Start empty
    const [weather, setWeather] = useState(null);
    
    const fetchWeather = async (city) => {
        if (!city) return; // Prevent empty requests
    
        try {
            const response = await fetch(`http://127.0.0.1:5000/weather/${city}`);
            const data = await response.json();
    
            if (data.error) {
                setWeather(null);
            } else {
                setWeather(data);
            }
        } catch (error) {
            console.error("Error fetching weather:", error);
        }
    };

    useEffect(() => { 
        fetchWeather(location); // Fetch when location changes
    }, [location]);

    return (
        <header className="bg-blue-600 p-4 flex items-center justify-between text-white shadow-lg">
        <div className="text-xl font-bold">Weather Dashboard</div>
        {/* Search Input */}
        <div className="flex items-center space-x-2">
            {/* <Input 
            type="text"
            placeholder="Enter city/state..."
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="px-4 py-2"/>
            <Search className="text-white cursor-pointer" onClick={() => fetchWeather(location)} /> */}
       </div>
       {/* Weather Info */}
       {weather && (
         <div className="text-right">
           <p className="text-lg font-semibold">{weather.name}</p>
           <p>{weather.main.temp}°C | {weather.weather[0].description}</p>
         </div>
        )};
     </header>
    );
};

export default Header;