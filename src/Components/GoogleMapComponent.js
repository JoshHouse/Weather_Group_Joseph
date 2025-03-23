import React, { useState, useCallback, useEffect } from 'react';
import { GoogleMap, useJsApiLoader, Marker, InfoWindow } from '@react-google-maps/api';
import './GoogleMapComponent.css';

// Default map container style - now full height
const containerStyle = {
  width: '100%',
  height: '100%',
  minHeight: '500px'
};

// Default center (will be overridden if coordinates are provided)
const defaultCenter = {
  lat: 51.5074, // London coordinates as default
  lng: -0.1278
};

// Google Maps API key - Using direct value to avoid process.env issues in browser
// In a production environment, this should be properly configured with webpack
const API_KEY = 'AIzaSyBDaeWicvigtP9xPv919E-RNoxfvC-Hqik';

// Check if we have a valid API key
const hasValidApiKey = API_KEY && API_KEY !== '' && !API_KEY.includes('YOUR_');

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