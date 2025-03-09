from flask import Blueprint, request, jsonify
import os
from .utils import make_api_request, error_response, get_coordinates

# Get API key from environment variables
API_KEY = os.environ.get('OPENWEATHER_API_KEY')

# Create blueprint
weather_bp = Blueprint('weather', __name__)

@weather_bp.route('/', methods=['GET'])
def get_current_weather():
    """
    Get current weather conditions for a city
    Query parameters:
    - city: Name of the city (required)
    - units: Units of measurement (optional, default: imperial)
    """
    city = request.args.get('city')
    units = request.args.get('units', 'imperial')  # Default to imperial units (Fahrenheit)
    
    if not city:
        return error_response('City parameter is required')
    
    # Validate units parameter
    if units not in ['standard', 'metric', 'imperial']:
        return error_response('Units must be one of: standard, metric, imperial')
    
    url = f"https://api.openweathermap.org/data/2.5/weather?q={city}&appid={API_KEY}&units={units}"
    data = make_api_request(url)
    
    if 'error' in data:
        return error_response(data['error'], data['status_code'])
    
    # Format the response to match the Java implementation
    formatted_data = {
        'city': data['name'],
        'coordinates': {
            'lon': data['coord']['lon'],
            'lat': data['coord']['lat']
        },
        'weather': [{
            'main': condition['main'],
            'description': condition['description'],
            'icon': condition['icon']
        } for condition in data['weather']],
        'temperature': {
            'current': data['main']['temp'],
            'feels_like': data['main']['feels_like'],
            'min': data['main']['temp_min'],
            'max': data['main']['temp_max']
        },
        'wind': {
            'speed': data['wind']['speed'],
            'deg': data['wind'].get('deg', 0)
        },
        'humidity': data['main']['humidity'],
        'pressure': data['main']['pressure']
    }
    
    return jsonify(formatted_data)

@weather_bp.route('/by-coordinates', methods=['GET'])
def get_weather_by_coordinates():
    """
    Get current weather conditions by latitude and longitude
    Query parameters:
    - lat: Latitude (required)
    - lon: Longitude (required)
    - units: Units of measurement (optional, default: imperial)
    """
    lat = request.args.get('lat')
    lon = request.args.get('lon')
    units = request.args.get('units', 'imperial')
    
    if not lat or not lon:
        return error_response('Latitude and longitude parameters are required')
    
    # Validate units parameter
    if units not in ['standard', 'metric', 'imperial']:
        return error_response('Units must be one of: standard, metric, imperial')
    
    url = f"https://api.openweathermap.org/data/2.5/weather?lat={lat}&lon={lon}&appid={API_KEY}&units={units}"
    data = make_api_request(url)
    
    if 'error' in data:
        return error_response(data['error'], data['status_code'])
    
    # Format the response to match the Java implementation
    formatted_data = {
        'city': data['name'],
        'coordinates': {
            'lon': data['coord']['lon'],
            'lat': data['coord']['lat']
        },
        'weather': [{
            'main': condition['main'],
            'description': condition['description'],
            'icon': condition['icon']
        } for condition in data['weather']],
        'temperature': {
            'current': data['main']['temp'],
            'feels_like': data['main']['feels_like'],
            'min': data['main']['temp_min'],
            'max': data['main']['temp_max']
        },
        'wind': {
            'speed': data['wind']['speed'],
            'deg': data['wind'].get('deg', 0)
        },
        'humidity': data['main']['humidity'],
        'pressure': data['main']['pressure']
    }
    
    return jsonify(formatted_data)
