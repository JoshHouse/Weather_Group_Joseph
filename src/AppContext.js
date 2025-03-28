import React, { createContext, useState, useEffect } from "react";
import axios from "axios";

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [theme, setTheme] = useState("light");
  const [units, setUnits] = useState("imperial");
  const [defaultCity, setDefaultCity] = useState("London");

  useEffect(() => {
    axios.get("http://127.0.0.1:5000/api/settings")
      .then(res => {
        setTheme(res.data.theme || "light");
        setUnits(res.data.units || "imperial");
        setDefaultCity(res.data.defaultCity || "London");
        document.body.className = res.data.theme === "dark" ? "dark-theme" : "light-theme";
      })
      .catch(err => console.error("Error fetching settings", err));
  }, []);

  return (
    <AppContext.Provider value={{ theme, setTheme, units, setUnits, defaultCity, setDefaultCity }}>
      {children}
    </AppContext.Provider>
  );
};
