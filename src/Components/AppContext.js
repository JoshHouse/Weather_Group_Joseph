import React, { createContext, useState, useEffect } from "react";
import axios from "axios";

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [units, setUnits] = useState("imperial");
  const [defaultCity, setDefaultCity] = useState("London");

  useEffect(() => {
    axios.get("http://127.0.0.1:5000/api/settings")
      .then((res) => {
        setUnits(res.data.units || "imperial");
        setDefaultCity(res.data.defaultCity || "London");
      })
      .catch((err) => console.error("Failed to load settings", err));
  }, []);

  return (
    <AppContext.Provider value={{ units, setUnits, defaultCity, setDefaultCity }}>
      {children}
    </AppContext.Provider>
  );
};
