import React, { useContext, useState } from "react";
import axios from "axios";
import { AppContext } from "../AppContext";
import "./SettingsPage.css";

function SettingsPage() {
  const { units, setUnits, defaultCity, setDefaultCity } = useContext(AppContext);
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "units") setUnits(value);
    else if (name === "defaultCity") setDefaultCity(value);
  };

  const handleSave = () => {
    setIsSaving(true);
    setSaveMessage("");

    axios.post("http://127.0.0.1:5000/api/settings", {
      units,
      defaultCity,
    })
      .then(() => setSaveMessage("Settings saved successfully!"))
      .catch(() => setSaveMessage("Failed to save settings."))
      .finally(() => {
        setIsSaving(false);
        setTimeout(() => setSaveMessage(""), 3000);
      });
  };

  return (
    <div className="settings-container">
      <h2>Settings</h2>

      <div className="settings-section">
        <h3>Weather Settings</h3>
        <div className="setting-item">
          <label htmlFor="units">Temperature Units:</label>
          <select id="units" name="units" value={units} onChange={handleChange}>
            <option value="imperial">Fahrenheit (°F)</option>
            <option value="metric">Celsius (°C)</option>
          </select>
        </div>
        <div className="setting-item">
          <label htmlFor="defaultCity">Default City:</label>
          <input id="defaultCity" name="defaultCity" value={defaultCity} onChange={handleChange} />
        </div>
      </div>

      <div className="settings-actions">
        <button onClick={handleSave} disabled={isSaving} className="save-button">
          {isSaving ? "Saving..." : "Save Settings"}
        </button>
        {saveMessage && <div className="save-message">{saveMessage}</div>}
      </div>
    </div>
  );
}

export default SettingsPage;
