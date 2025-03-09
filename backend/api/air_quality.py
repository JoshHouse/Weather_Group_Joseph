from flask import Blueprint, request, jsonify # type: ignore
import os
from .utils import make_api_request, error_response, get_coordinates

# Get API key from environment variables
API_KEY = os.environ.get('OPENWEATHER_API_KEY')

# Create blueprint
air_quality_bp = Blueprint('air_quality', __name__)

@air_quality_bp.route('/', methods=['GET'])
def get_air_quality():
    """
    Get air quality for a city
    Query parameters:
    - city: Name of the city (required)
    """
    city = request.args.get('city')
    
    if not city:
        return error_response('City parameter is required')
    
    # First, get coordinates for the city
    coords = get_coordinates(city)
    
    if 'error' in coords:
        return error_response(coords['error'], coords.get('status_code', 400))
    
    # Now get air quality using coordinates
    lat = coords['lat']
    lon = coords['lon']
    
    url = f"http://api.openweathermap.org/data/2.5/air_pollution?lat={lat}&lon={lon}&appid={API_KEY}"
    data = make_api_request(url)
    
    if 'error' in data:
        return error_response(data['error'], data['status_code'])
    
    # Extract air quality data from the response
    try:
        air_quality = data['list'][0]
        
        # Format the response
        formatted_data = {
            'city': coords['city_name'],
            'coordinates': {
                'lat': lat,
                'lon': lon
            },
            'air_quality_index': air_quality['main']['aqi'],
            'air_quality_level': get_aqi_level(air_quality['main']['aqi']),
            'components': {
                'co': air_quality['components']['co'],
                'no': air_quality['components']['no'],
                'no2': air_quality['components']['no2'],
                'o3': air_quality['components']['o3'],
                'so2': air_quality['components']['so2'],
                'pm2_5': air_quality['components']['pm2_5'],
                'pm10': air_quality['components']['pm10'],
                'nh3': air_quality['components']['nh3']
            }
        }
        
        return jsonify(formatted_data)
    except (KeyError, IndexError):
        return error_response('Air quality data not available', 404)

@air_quality_bp.route('/by-coordinates', methods=['GET'])
def get_air_quality_by_coordinates():
    """
    Get air quality by latitude and longitude
    Query parameters:
    - lat: Latitude (required)
    - lon: Longitude (required)
    """
    lat = request.args.get('lat')
    lon = request.args.get('lon')
    
    if not lat or not lon:
        return error_response('Latitude and longitude parameters are required')
    
    # Get air quality using coordinates
    url = f"http://api.openweathermap.org/data/2.5/air_pollution?lat={lat}&lon={lon}&appid={API_KEY}"
    data = make_api_request(url)
    
    if 'error' in data:
        return error_response(data['error'], data['status_code'])
    
    # Get city name from reverse geocoding
    city_url = f"https://api.openweathermap.org/geo/1.0/reverse?lat={lat}&lon={lon}&limit=1&appid={API_KEY}"
    city_data = make_api_request(city_url)
    
    city_name = "Unknown"
    if not 'error' in city_data and len(city_data) > 0:
        city_name = city_data[0].get('name', "Unknown")
    
    # Extract air quality data from the response
    try:
        air_quality = data['list'][0]
        
        # Format the response
        formatted_data = {
            'city': city_name,
            'coordinates': {
                'lat': float(lat),
                'lon': float(lon)
            },
            'air_quality_index': air_quality['main']['aqi'],
            'air_quality_level': get_aqi_level(air_quality['main']['aqi']),
            'components': {
                'co': air_quality['components']['co'],
                'no': air_quality['components']['no'],
                'no2': air_quality['components']['no2'],
                'o3': air_quality['components']['o3'],
                'so2': air_quality['components']['so2'],
                'pm2_5': air_quality['components']['pm2_5'],
                'pm10': air_quality['components']['pm10'],
                'nh3': air_quality['components']['nh3']
            }
        }
        
        return jsonify(formatted_data)
    except (KeyError, IndexError):
        return error_response('Air quality data not available', 404)

def get_aqi_level(aqi):
    """
    Get the air quality level based on the AQI value
    AQI values from OpenWeatherMap:
    1 = Good
    2 = Fair
    3 = Moderate
    4 = Poor
    5 = Very Poor
    """
    levels = {
        1: "Good",
        2: "Fair",
        3: "Moderate",
        4: "Poor",
        5: "Very Poor"
    }
    return levels.get(aqi, "Unknown")
