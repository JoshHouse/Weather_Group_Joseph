// Import weather background GIFs
import cloudyGif from "../Assets/images/Cloudy.gif";
import rainGif from "../Assets/images/Rain.gif";
import snowGif from "../Assets/images/Snow.gif";
import sunnyGif from "../Assets/images/Sunny.gif";
import thunderstormsGif from "../Assets/images/Thunderstroms.gif";

/**
 * Formats a location query string for API requests
 * @param {string} query - The location query to format
 * @returns {string} - The formatted query
 */
export const formatLocationQuery = (location) => {
  if (location.includes(",")) {
    const [latitude, longitude] = location.split(",");
    return `${latitude.trim()},${longitude.trim()}`;
  }
  return location.trim();
};

/**
 * Determines the appropriate background GIF based on weather condition
 * @param {string} weatherCondition - The weather condition
 * @returns {string} - The path to the appropriate background GIF
 */
export const getWeatherBackground = (weatherCondition) => {
  if (!weatherCondition) return sunnyGif;
  
  const condition = weatherCondition.toLowerCase();
  
  if (condition.includes("cloud") || condition.includes("overcast") || condition.includes("fog") || condition.includes("mist")) {
    return cloudyGif;
  } else if (condition.includes("rain") || condition.includes("drizzle") || condition.includes("shower")) {
    return rainGif;
  } else if (condition.includes("snow") || condition.includes("sleet") || condition.includes("hail") || condition.includes("ice")) {
    return snowGif;
  } else if (condition.includes("thunder") || condition.includes("storm") || condition.includes("lightning")) {
    return thunderstormsGif;
  } else {
    return sunnyGif;
  }
};

/**
 * Converts wind direction in degrees to cardinal direction
 * @param {number} degrees - The wind direction in degrees
 * @returns {string} - The cardinal direction
 */
export const getWindDirection = (degrees) => {
  const directions = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"];
  const index = Math.round(degrees / 45) % 8;
  return directions[index];
};

/**
 * Formats a date string to be more readable
 * @param {string} dateString - The date string to format
 * @returns {string} - The formatted date string
 */
export const formatDate = (dateString) => {
  const options = { weekday: "short", month: "short", day: "numeric" };
  return new Date(dateString).toLocaleDateString(undefined, options);
};

/**
 * API endpoints for the backend
 */
export const API_ENDPOINTS = {
  WEATHER: "/api/weather",
  FORECAST: "/api/forecast",
  UV_INDEX: "/api/uv-index",
  AIR_QUALITY: "/api/air-quality",
  COMPARE: "/api/compare",
  SETTINGS: "/api/settings"
};

/**
 * Base URL for the backend API
 */
export const API_BASE_URL = "http://127.0.0.1:5000";