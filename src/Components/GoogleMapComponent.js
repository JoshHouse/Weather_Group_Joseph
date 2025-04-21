<<<<<<< Updated upstream
import React, { useState, useCallback, useEffect } from 'react';
import { GoogleMap, useJsApiLoader, Marker, InfoWindow } from '@react-google-maps/api';
import './GoogleMapComponent.css';
=======
import React, { useState, useEffect, useRef } from "react";
import "./GoogleMapComponent.css";
import { BACKEND_BASE_URLS, BACKEND_ENDPOINTS } from "../utils/frontEndUtils";
>>>>>>> Stashed changes

// Default map container style - now full height
const containerStyle = {
  width: '100%',
  height: '100%',
  minHeight: '500px'
};

<<<<<<< Updated upstream
// Default center (will be overridden if coordinates are provided)
const defaultCenter = {
  lat: 51.5074, // London coordinates as default
  lng: -0.1278
};
=======

  // Fetch Google Maps API key from backend
  useEffect(() => {
    const fetchApiKey = async () => {
      try {
        const response = await fetch(
          `${BACKEND_BASE_URLS.GOOGLE_MAPS}${BACKEND_ENDPOINTS.GOOGLE_MAPS_KEY}`
        );
        if (!response.ok) throw new Error("Network response was not ok");
        const data = await response.json();
        setApiKey(data.apiKey);
      } catch (err) {
        console.error("Error fetching Google Maps API key:", err);
        setError("Failed to load Google Maps API key. Please try again later.");
        setLoading(false);
      }
    };
>>>>>>> Stashed changes

// Google Maps API key - Using direct value to avoid process.env issues in browser
// In a production environment, this should be properly configured with webpack
const API_KEY = 'AIzaSyBDaeWicvigtP9xPv919E-RNoxfvC-Hqik';

// Check if we have a valid API key
const hasValidApiKey = API_KEY && API_KEY !== '' && !API_KEY.includes('YOUR_');

<<<<<<< Updated upstream
// Placeholder Map Component when API key is not available
const PlaceholderMap = ({ city, coordinates }) => {
  const location = city || 'Selected Location';
  const lat = coordinates?.lat || defaultCenter.lat;
  const lng = coordinates?.lng || defaultCenter.lng;
  
  return (
    <div className="placeholder-map">
      <div className="placeholder-map-content">
        <h4>Map Preview Unavailable</h4>
        <p>A valid Google Maps API key is required to display the map.</p>
        <div className="placeholder-map-info">
          <p><strong>Location:</strong> {location}</p>
          <p><strong>Coordinates:</strong> {lat.toFixed(4)}, {lng.toFixed(4)}</p>
        </div>
        <div className="placeholder-map-instructions">
          <p>To enable maps:</p>
          <ol>
            <li>Obtain a Google Maps API key from the <a href="https://console.cloud.google.com/" target="_blank" rel="noopener noreferrer">Google Cloud Console</a></li>
            <li>Add the API key to your environment variables as REACT_APP_GOOGLE_MAPS_API_KEY</li>
          </ol>
=======
    // Check if API is already loaded
    if (window.google && window.google.maps) {
      setMapLoaded(true);
      return;
    }

    const loadGoogleMapsAPI = () => {
      const script = document.createElement("script");
      script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
      script.async = true;
      script.defer = true;

      window.initMap = () => {
        setMapLoaded(true);
      };
      script.onload = window.initMap;

      script.onerror = () => {
        setError("Failed to load Google Maps. Please check your internet connection.");
        setLoading(false);
      };

      document.head.appendChild(script);
    };

    loadGoogleMapsAPI();

    return () => {
      if (window.initMap) {
        delete window.initMap;
      }
    };
  }, [apiKey]);

  // Initialize map when API is loaded and either coordinates are provided or city changes
  useEffect(() => {
    if (!mapLoaded || !mapRef.current) return;


    const initializeMap = async () => {
      setLoading(true);
      try {
        let mapCenter;

        if (coordinates && coordinates.lat && coordinates.lng) {
          mapCenter = {
            lat: parseFloat(coordinates.lat),
            lng: parseFloat(coordinates.lng)
          };
        } else if (city && city !== "Default Location") {
          const response = await fetch(`${BACKEND_BASE_URLS.SAVED_SEARCHES}${BACKEND_ENDPOINTS.SAVED_SEARCHES}?city=${searchedCity}&units=${units}`);

          if (!response.ok) throw new Error("Failed to fetch geocode");

          const data = await response.json();

          if (data.results && data.results.length > 0) {
            const location = data.results[0].geometry.location;
            mapCenter = {
              lat: location.lat,
              lng: location.lng
            };
          } else {
            mapCenter = { lat: 39.8283, lng: -98.5795 };
          }
        } else {
          mapCenter = { lat: 39.8283, lng: -98.5795 };
        }

        const newMap = new window.google.maps.Map(mapRef.current, {
          center: mapCenter,
          zoom: 10,
          mapTypeControl: true,
          streetViewControl: false,
          fullscreenControl: false,
          mapTypeId: window.google.maps.MapTypeId.ROADMAP
        });

        const newMarker = new window.google.maps.Marker({
          position: mapCenter,
          map: newMap,
          animation: window.google.maps.Animation.DROP,
          title: city || "Selected Location"
        });

        newMap.addListener("click", (event) => {
          const clickedLocation = {
            lat: event.latLng.lat(),
            lng: event.latLng.lng()
          };

          newMarker.setPosition(clickedLocation);

          if (onLocationSelect) {
            onLocationSelect(clickedLocation);
          }
        });

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
>>>>>>> Stashed changes
        </div>
      </div>
    </div>
  );
};

function GoogleMapComponent({ city, coordinates, onLocationSelect }) {
  // Only attempt to load the API if we have a valid key
  const { isLoaded, loadError } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: API_KEY
  });

  // State for the map instance
  const [map, setMap] = useState(null);
  // State for the selected location marker
  const [marker, setMarker] = useState(null);
  // State for the info window
  const [infoWindow, setInfoWindow] = useState(null);
  // State for map center
  const [center, setCenter] = useState(defaultCenter);

  // Update center when coordinates change
  useEffect(() => {
    if (coordinates && coordinates.lat && coordinates.lng) {
      setCenter({
        lat: parseFloat(coordinates.lat),
        lng: parseFloat(coordinates.lng)
      });
      
      // Set marker at the new center
      setMarker({
        position: {
          lat: parseFloat(coordinates.lat),
          lng: parseFloat(coordinates.lng)
        },
        title: city || 'Selected Location'
      });
    } else if (city) {
      // If we have a city name but no coordinates, we could geocode here
      // For now, we'll just use the default center
      console.log(`No coordinates available for ${city}, using default center`);
    }
  }, [coordinates, city]);

  // Callback when the map is loaded
  const onLoad = useCallback(function callback(map) {
    setMap(map);
  }, []);

  // Callback when the map is unmounted
  const onUnmount = useCallback(function callback(map) {
    setMap(null);
  }, []);

  // Handle map click to set a marker and get coordinates
  const handleMapClick = (event) => {
    const clickedLat = event.latLng.lat();
    const clickedLng = event.latLng.lng();
    
    // Set marker at clicked position
    setMarker({
      position: {
        lat: clickedLat,
        lng: clickedLng
      },
      title: 'Selected Location'
    });
    
    // Call the callback with the selected coordinates
    if (onLocationSelect) {
      onLocationSelect({
        lat: clickedLat,
        lng: clickedLng
      });
    }
    
    // Close any open info window
    setInfoWindow(null);
  };

  // Handle marker click to show info window
  const handleMarkerClick = () => {
    if (marker) {
      setInfoWindow({
        position: marker.position,
        content: marker.title
      });
    }
  };

  // Handle info window close
  const handleInfoWindowClose = () => {
    setInfoWindow(null);
  };

  // Show loading error if the API fails to load
  if (loadError) {
    return <div className="map-error">Error loading Google Maps API: {loadError.message}</div>;
  }

  // Show loading indicator while the API is loading
  if (!isLoaded) {
    return <div className="map-loading">Loading Google Maps...</div>;
  }

  return (
    <div className="google-map-container">
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={center}
        zoom={10}
        onLoad={onLoad}
        onUnmount={onUnmount}
        onClick={handleMapClick}
        options={{
          fullscreenControl: true,
          streetViewControl: true,
          mapTypeControl: true,
          zoomControl: true
        }}
      >
        {/* Render marker if we have one */}
        {marker && (
          <Marker
            position={marker.position}
            title={marker.title}
            onClick={handleMarkerClick}
          />
        )}
        
        {/* Render info window if it's open */}
        {infoWindow && (
          <InfoWindow
            position={infoWindow.position}
            onCloseClick={handleInfoWindowClose}
          >
            <div>{infoWindow.content}</div>
          </InfoWindow>
        )}
      </GoogleMap>
    </div>
  );
}

export default React.memo(GoogleMapComponent);