# Weather App Flask Backend

This is a Flask backend for the Weather App that provides various weather-related APIs.

## Setup

1. Make sure you have Python 3.8+ installed
2. Install the required packages:

```bash
pip install -r requirements.txt
```

3. Create a `.env` file in the backend directory with your OpenWeatherMap API key:

```
OPENWEATHER_API_KEY=your_api_key_here
```

## Running the Server

To run the development server:

```bash
python app.py
```

The server will start on http://localhost:5000

## API Endpoints

### Current Weather

- `GET /api/weather?city={city}&units={units}`
  - Get current weather conditions for a city
  - Query parameters:
    - `city`: Name of the city (required)
    - `units`: Units of measurement (optional, default: imperial)

- `GET /api/weather/by-coordinates?lat={lat}&lon={lon}&units={units}`
  - Get current weather conditions by latitude and longitude
  - Query parameters:
    - `lat`: Latitude (required)
    - `lon`: Longitude (required)
    - `units`: Units of measurement (optional, default: imperial)

### UV Index

- `GET /api/uv-index?city={city}`
  - Get UV index for a city
  - Query parameters:
    - `city`: Name of the city (required)

- `GET /api/uv-index/by-coordinates?lat={lat}&lon={lon}`
  - Get UV index by latitude and longitude
  - Query parameters:
    - `lat`: Latitude (required)
    - `lon`: Longitude (required)

### Weather Forecast

- `GET /api/forecast?city={city}&days={days}&units={units}`
  - Get weather forecast for a city
  - Query parameters:
    - `city`: Name of the city (required)
    - `days`: Number of days (optional, default: 5)
    - `units`: Units of measurement (optional, default: imperial)

- `GET /api/forecast/by-coordinates?lat={lat}&lon={lon}&days={days}&units={units}`
  - Get weather forecast by latitude and longitude
  - Query parameters:
    - `lat`: Latitude (required)
    - `lon`: Longitude (required)
    - `days`: Number of days (optional, default: 5)
    - `units`: Units of measurement (optional, default: imperial)

### Air Quality

- `GET /api/air-quality?city={city}`
  - Get air quality for a city
  - Query parameters:
    - `city`: Name of the city (required)

- `GET /api/air-quality/by-coordinates?lat={lat}&lon={lon}`
  - Get air quality by latitude and longitude
  - Query parameters:
    - `lat`: Latitude (required)
    - `lon`: Longitude (required)

### Sun Times

- `GET /api/sun-times?city={city}`
  - Get sunrise and sunset times for a city
  - Query parameters:
    - `city`: Name of the city (required)

- `GET /api/sun-times/by-coordinates?lat={lat}&lon={lon}`
  - Get sunrise and sunset times by latitude and longitude
  - Query parameters:
    - `lat`: Latitude (required)
    - `lon`: Longitude (required)
