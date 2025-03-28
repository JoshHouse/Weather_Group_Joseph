import React, { createContext, useState, useEffect } from "react";
import axios from "axios";

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [theme, setTheme] = useState("light");
  const [units, setUnits] = useState("imperial");
  const [defaultCity, setDefaultCity] = useState("London");

  useEffect(() => {
    axios.get("http://127.0.0.1:5000/api/settings")
      .then((res) => {
        const data = res.data;
        setTheme(data.theme || "light");
        setUnits(data.units || "imperial");
        setDefaultCity(data.defaultCity || "London");

        // Apply theme on load
        document.body.className = data.theme === "dark" ? "dark-theme" : "light-theme";
      })
      .catch((err) => console.error("Failed to load settings", err));
  }, []);

  return (
    <AppContext.Provider value={{
      theme,
      setTheme,
      units,
      setUnits,
      defaultCity,
      setDefaultCity
    }}>
      {children}
    </AppContext.Provider>
  );
};
