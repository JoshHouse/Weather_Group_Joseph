import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Search } from "lucide-react";

const Header = () => {
  const [location, setLocation] = useState("New York");
  const [weather, setWeather] = useState(null);
  const API_KEY = "6fd23365cb0cff93a229f133b710d825";

  useEffect(() => {
    fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${location}&units=metric&appid=${API_KEY}`
    )
      .then((response) => response.json())
      .then((data) => setWeather(data));
  }, [location]);

  return (
    <header className="bg-blue-600 p-4 flex items-center justify-between text-white shadow-lg">
      {/* Logo Placeholder */}
      <div className="text-xl font-bold">Logo</div>
      
      {/* Search Bar & Dropdown */}
      <div className="flex items-center space-x-2">
        <Select onValueChange={(value) => setLocation(value)}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select a city" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="New York">New York</SelectItem>
            <SelectItem value="London">London</SelectItem>
            <SelectItem value="Tokyo">Tokyo</SelectItem>
            <SelectItem value="Paris">Paris</SelectItem>
          </SelectContent>
        </Select>
        <Input type="text" placeholder="Search city..." className="px-4 py-2" />
        <Search className="text-white" />
      </div>
      
      {/* Current Weather */}
      {weather && (
        <div className="text-right">
          <p className="text-lg font-semibold">{weather.name}</p>
          <p>{weather.main.temp}°C | {weather.weather[0].description}</p>
        </div>
      )}
    </header>
  );
};

export default Header;
