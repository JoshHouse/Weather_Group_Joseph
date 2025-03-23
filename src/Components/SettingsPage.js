import React, { useState, useEffect } from "react";
import axios from "axios";
import "./SettingsPage.css";

function SettingsPage({ theme, setTheme }) {
  const [settings, setSettings] = useState({
    units: "imperial",
    defaultCity: "London"
  });
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState("");

  // Fetch current settings from backend
  useEffect(() => {
    axios.get("http://127.0.0.1:5000/api/settings")
      .then(response => {
        setSettings(response.data);
      })
      .catch(error => {
        console.error("Error fetching settings:", error);
      });
  }, []);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "theme") {
      setTheme(value);
    } else {
      setSettings(prevSettings => ({
        ...prevSettings,
        [name]: value
      }));
    }
  };

  // Save settings to backend
  const handleSave = () => {
    setIsSaving(true);
    setSaveMessage("");

    const settingsToSave = {
      ...settings,
      theme: theme
    };

    axios.post("http://127.0.0.1:5000/api/settings", settingsToSave)
      .then(response => {
        setSaveMessage("Settings saved successfully!");
        // Apply theme change
        document.body.className = theme === "dark" ? "dark-theme" : "light-theme";
      })
      .catch(error => {
        console.error("Error saving settings:", error);
        setSaveMessage("Failed to save settings. Please try again.");
      })
      .finally(() => {
        setIsSaving(false);
        // Clear message after 3 seconds
        setTimeout(() => setSaveMessage(""), 3000);
      });
  };

  return (
    <div className="settings-container">
      <h2>Settings</h2>
      
      <div className="settings-section">
        <h3>Display Settings</h3>
        
        <div className="setting-item">
          <label htmlFor="theme">Theme:</label>
          <select 
            id="theme" 
            name="theme" 
            value={theme}
            onChange={handleChange}
          >
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
            onChange={handleChange}
          >
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
        <button 
          onClick={handleSave} 
          disabled={isSaving}
          className="save-button"
        >
          {isSaving ? "Saving..." : "Save Settings"}
        </button>
        
        {saveMessage && (
          <div className="save-message">
            {saveMessage}
          </div>
        )}
      </div>
    </div>
  );
}

export default SettingsPage;