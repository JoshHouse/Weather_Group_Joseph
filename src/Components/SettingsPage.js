import React, { useContext, useState, useEffect } from "react";
import axios from "axios";
import { ThemeContext } from "../app";
import "./SettingsPage.css";

function SettingsPage() {
  const { theme, setTheme } = useContext(ThemeContext);
  const [settings, setSettings] = useState({
    units: "imperial",
    defaultCity: "London",
    theme: theme,
  });
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState("");

  // Fetch current settings from backend
  useEffect(() => {
    axios.get("http://127.0.0.1:5000/api/settings")
      .then(response => {setSettings(response.data);})
      .catch(error => {console.error("Error fetching settings:", error);});
  }, []);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setSettings(prevSettings => ({
      ...prevSettings,
      [name]: value
    }));
    if (name === "theme") setTheme(value);
  };

  // Save settings to backend
  const handleSave = () => {
    const handleSave = () => {
      axios.post("http://127.0.0.1:5000/api/settings", settings)
        .then(() => alert("Settings saved!"))
        .catch(() => alert("Failed to save settings."));
    };
  };

  return (
    <div className="settings-container">
      <h2>Settings</h2>
      
      <div className="settings-section">
        <h3>Display Settings</h3>
        
        <div className="setting-item">
          <label htmlFor="theme">Theme:</label>
          <select id="theme" name="theme" value={settings.theme} onChange={handleChange}>
            <option value="light">Light</option>
            <option value="dark">Dark</option>
          </select>
        </div>
      </div>

      <div className="settings-section">
        <h3>Weather Settings</h3>
        
        <div className="setting-item">
          <label htmlFor="units">Temperature Units:</label>
          <select 
            id="units" 
            name="units" 
            value={settings.units} 
            onChange={handleChange}>
            <option value="imperial">Fahrenheit (°F)</option>
            <option value="metric">Celsius (°C)</option>
          </select>
        </div>
        
        <div className="setting-item">
          <label htmlFor="defaultCity">Default City:</label>
          <input 
            type="text" 
            id="defaultCity" 
            name="defaultCity" 
            value={settings.defaultCity} 
            onChange={handleChange} 
            placeholder="Enter city name"
          />
        </div>
      </div>

      <div className="settings-actions">
        <button onClick={handleSave} className="save-button">Save Settings</button>
        
        {saveMessage && (<div className="save-message">{saveMessage}</div>)}
      </div>
    </div>
  );
}

export default SettingsPage;