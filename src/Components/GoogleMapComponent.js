import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import "./GoogleMapComponent.css";
import { BACKEND_BASE_URLS, BACKEND_ENDPOINTS } from "../utils/frontEndUtils";

function GoogleMapComponent({ city, coordinates, onLocationSelect }) {
  const [apiKey, setApiKey] = useState(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [map, setMap] = useState(null);
  const [marker, setMarker] = useState(null);
  const mapRef = useRef(null);

  // Fetch Google Maps API key from backend
  useEffect(() => {
    const fetchApiKey = async () => {
      try {
        const response = await axios.get(
          `${BACKEND_BASE_URLS.GOOGLE_MAPS}${BACKEND_ENDPOINTS.GOOGLE_MAPS_KEY}`
        );
        setApiKey(response.data.apiKey);
      } catch (err) {
        console.error("Error fetching Google Maps API key:", err);
        setError("Failed to load Google Maps API key. Please try again later.");
        setLoading(false);
      }
    };

    fetchApiKey();
  }, []);

  // Load Google Maps JavaScript API
  useEffect(() => {
    if (!apiKey) return;

    // Check if API is already loaded
    if (window.google && window.google.maps) {
      setMapLoaded(true);
      return;
    }

    const loadGoogleMapsAPI = () => {
      // Create script element
      const script = document.createElement("script");
      script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
      script.async = true;
      script.defer = true;
      
      // Set up callback
      window.initMap = () => {
        setMapLoaded(true);
      };
      script.onload = window.initMap;
      
      // Handle script loading error
      script.onerror = () => {
        setError("Failed to load Google Maps. Please check your internet connection.");
        setLoading(false);
      };
      
      // Add script to document
      document.head.appendChild(script);
    };

    loadGoogleMapsAPI();

    // Cleanup function to remove script if component unmounts during loading
    return () => {
      if (window.initMap) {
        delete window.initMap;
      }
    };
  }, [apiKey]);

  // Initialize map when API is loaded and either coordinates are provided or city changes
  useEffect(() => {
    if (!mapLoaded) return;

    const initializeMap = async () => {
      setLoading(true);
      try {
        let mapCenter;
        
        // If coordinates are provided, use them
        if (coordinates && coordinates.lat && coordinates.lng) {
          mapCenter = {
            lat: parseFloat(coordinates.lat),
            lng: parseFloat(coordinates.lng)
          };
        } 
        // Otherwise, geocode the city name
        else if (city && city !== "Default Location") {
          // Use backend proxy for geocoding to hide API key
          const response = await axios.get(
            `${BACKEND_BASE_URLS.GOOGLE_MAPS}${BACKEND_ENDPOINTS.GEOCODE}?location=${encodeURIComponent(city)}`
          );
          
          if (response.data.results && response.data.results.length > 0) {
            const location = response.data.results[0].geometry.location;
            mapCenter = {
              lat: location.lat,
              lng: location.lng
            };
          } else {
            // Default to a central US location if geocoding fails
            mapCenter = { lat: 39.8283, lng: -98.5795 };
          }
        } else {
          // Default center (Central US)
          mapCenter = { lat: 39.8283, lng: -98.5795 };
        }

        // Initialize the map
        const newMap = new window.google.maps.Map(mapRef.current, {
          center: mapCenter,
          zoom: 10,
          mapTypeControl: true,
          streetViewControl: false,
          fullscreenControl: false,
          mapTypeId: window.google.maps.MapTypeId.ROADMAP
        });

        // Create a marker
        const newMarker = new window.google.maps.Marker({
          position: mapCenter,
          map: newMap,
          animation: window.google.maps.Animation.DROP,
          title: city || "Selected Location"
        });

        // Add click listener to map
        newMap.addListener("click", (event) => {
          const clickedLocation = {
            lat: event.latLng.lat(),
            lng: event.latLng.lng()
          };
          
          // Update marker position
          newMarker.setPosition(clickedLocation);
          
          // Call onLocationSelect callback with new coordinates
          if (onLocationSelect) {
            onLocationSelect(clickedLocation);
          }
        });

        // Save map and marker instances
        setMap(newMap);
        setMarker(newMarker);
        setLoading(false);
      } catch (err) {
        console.error("Error initializing Google Maps:", err);
        setError("Error initializing map. Please try again later.");
        setLoading(false);
      }
    };

    initializeMap();
  }, [mapLoaded, coordinates, city, onLocationSelect]);

  // Update marker position when coordinates change
  useEffect(() => {
    if (!map || !marker || !coordinates) return;

    const position = new window.google.maps.LatLng(
      parseFloat(coordinates.lat),
      parseFloat(coordinates.lng)
    );
    
    marker.setPosition(position);
    map.panTo(position);
  }, [map, marker, coordinates]);

  if (error) {
    return (
      <div className="map-error">
        <div>
          <p>{error}</p>
          <p>Please check your internet connection or try again later.</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return <div className="map-loading">Loading map data...</div>;
  }

  return <div ref={mapRef} className="google-map-container"></div>;
}

export default GoogleMapComponent;