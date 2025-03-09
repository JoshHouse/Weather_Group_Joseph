import os
import requests
from flask import jsonify # type: ignore

# Get API key from environment variables
API_KEY = os.environ.get('OPENWEATHER_API_KEY')

def make_api_request(url):
    """
    Make a request to the OpenWeatherMap API
    """
    try:
        response = requests.get(url)
        response.raise_for_status()  # Raise an exception for 4XX/5XX responses
        return response.json()
    except requests.exceptions.RequestException as e:
        return {
            'error': str(e),
            'status_code': getattr(e.response, 'status_code', 500)
        }

def get_coordinates(city):
    """
    Get latitude and longitude for a city
    """
    url = f"https://api.openweathermap.org/data/2.5/weather?q={city}&appid={API_KEY}"
    data = make_api_request(url)
    
    if 'error' in data:
        return data
    
    return {
        'lat': data['coord']['lat'],
        'lon': data['coord']['lon'],
        'city_name': data['name']
    }

def error_response(message, status_code=400):
    """
    Create a standardized error response
    """
    response = jsonify({'error': message})
    response.status_code = status_code
    return response
