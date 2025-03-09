import requests
import json
import os
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

# Base URL for the API
BASE_URL = "http://localhost:5000/api"

def print_response(endpoint, response):
    """Print the response from an API endpoint"""
    print(f"\n=== {endpoint} ===")
    print(f"Status Code: {response.status_code}")
    if response.status_code == 200:
        print(json.dumps(response.json(), indent=2))
    else:
        print(f"Error: {response.text}")

def test_weather_api():
    """Test the weather API endpoints"""
    # Test current weather by city
    response = requests.get(f"{BASE_URL}/weather", params={"city": "London"})
    print_response("Current Weather (London)", response)
    
    # Test current weather by coordinates
    response = requests.get(f"{BASE_URL}/weather/by-coordinates", params={"lat": "51.5074", "lon": "0.1278"})
    print_response("Current Weather (Coordinates: 51.5074, 0.1278)", response)

def test_uv_index_api():
    """Test the UV index API endpoints"""
    # Test UV index by city
    response = requests.get(f"{BASE_URL}/uv-index", params={"city": "Miami"})
    print_response("UV Index (Miami)", response)
    
    # Test UV index by coordinates
    response = requests.get(f"{BASE_URL}/uv-index/by-coordinates", params={"lat": "25.7617", "lon": "-80.1918"})
    print_response("UV Index (Coordinates: 25.7617, -80.1918)", response)

def test_forecast_api():
    """Test the forecast API endpoints"""
    # Test forecast by city
    response = requests.get(f"{BASE_URL}/forecast", params={"city": "Tokyo", "days": "3"})
    print_response("Forecast (Tokyo, 3 days)", response)
    
    # Test forecast by coordinates
    response = requests.get(f"{BASE_URL}/forecast/by-coordinates", params={"lat": "35.6762", "lon": "139.6503", "days": "2"})
    print_response("Forecast (Coordinates: 35.6762, 139.6503, 2 days)", response)

def test_air_quality_api():
    """Test the air quality API endpoints"""
    # Test air quality by city
    response = requests.get(f"{BASE_URL}/air-quality", params={"city": "Beijing"})
    print_response("Air Quality (Beijing)", response)
    
    # Test air quality by coordinates
    response = requests.get(f"{BASE_URL}/air-quality/by-coordinates", params={"lat": "39.9042", "lon": "116.4074"})
    print_response("Air Quality (Coordinates: 39.9042, 116.4074)", response)

def test_sun_times_api():
    """Test the sun times API endpoints"""
    # Test sun times by city
    response = requests.get(f"{BASE_URL}/sun-times", params={"city": "Sydney"})
    print_response("Sun Times (Sydney)", response)
    
    # Test sun times by coordinates
    response = requests.get(f"{BASE_URL}/sun-times/by-coordinates", params={"lat": "-33.8688", "lon": "151.2093"})
    print_response("Sun Times (Coordinates: -33.8688, 151.2093)", response)

if __name__ == "__main__":
    print("Testing Weather API endpoints...")
    print("Make sure the Flask server is running on http://localhost:5000")
    
    # Test all API endpoints
    test_weather_api()
    test_uv_index_api()
    test_forecast_api()
    test_air_quality_api()
    test_sun_times_api()
    
    print("\nAPI testing complete!")
