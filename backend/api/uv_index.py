from flask import Blueprint, request, jsonify
import os
from .utils import make_api_request, error_response, get_coordinates

# Get API key from environment variables
API_KEY = os.environ.get('OPENWEATHER_API_KEY')

# Create blueprint
uv_index_bp = Blueprint('uv_index', __name__)

@uv_index_bp.route('/', methods=['GET'])
def get_uv_index():
    """
    Get UV index for a city
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
    
    # Now get UV index using coordinates
    lat = coords['lat']
    lon = coords['lon']
    
    # Note: The UV Index endpoint in the original Java code is deprecated
    # Using the One Call API instead which includes UV index data
    url = f"https://api.openweathermap.org/data/3.0/onecall?lat={lat}&lon={lon}&exclude=minutely,hourly,daily,alerts&appid={API_KEY}"
    data = make_api_request(url)
    
    if 'error' in data:
        return error_response(data['error'], data['status_code'])
    
    # Extract UV index from the response
    try:
        uv_index = data['current']['uvi']
        
        # Format the response
        formatted_data = {
            'city': coords['city_name'],
            'coordinates': {
                'lat': lat,
                'lon': lon
            },
            'uv_index': uv_index,
            'risk_level': get_uv_risk_level(uv_index)
        }
        
        return jsonify(formatted_data)
    except KeyError:
        return error_response('UV index data not available', 404)

@uv_index_bp.route('/by-coordinates', methods=['GET'])
def get_uv_index_by_coordinates():
    """
    Get UV index by latitude and longitude
    Query parameters:
    - lat: Latitude (required)
    - lon: Longitude (required)
    """
    lat = request.args.get('lat')
    lon = request.args.get('lon')
    
    if not lat or not lon:
        return error_response('Latitude and longitude parameters are required')
    
    # Get UV index using coordinates
    url = f"https://api.openweathermap.org/data/3.0/onecall?lat={lat}&lon={lon}&exclude=minutely,hourly,daily,alerts&appid={API_KEY}"
    data = make_api_request(url)
    
    if 'error' in data:
        return error_response(data['error'], data['status_code'])
    
    # Extract UV index from the response
    try:
        uv_index = data['current']['uvi']
        
        # Get city name from reverse geocoding
        city_url = f"https://api.openweathermap.org/geo/1.0/reverse?lat={lat}&lon={lon}&limit=1&appid={API_KEY}"
        city_data = make_api_request(city_url)
        
        city_name = "Unknown"
        if not 'error' in city_data and len(city_data) > 0:
            city_name = city_data[0].get('name', "Unknown")
        
        # Format the response
        formatted_data = {
            'city': city_name,
            'coordinates': {
                'lat': float(lat),
                'lon': float(lon)
            },
            'uv_index': uv_index,
            'risk_level': get_uv_risk_level(uv_index)
        }
        
        return jsonify(formatted_data)
    except KeyError:
        return error_response('UV index data not available', 404)

def get_uv_risk_level(uv_index):
    """
    Get the risk level based on the UV index value
    """
    if uv_index < 3:
        return "Low"
    elif uv_index < 6:
        return "Moderate"
    elif uv_index < 8:
        return "High"
    elif uv_index < 11:
        return "Very High"
    else:
        return "Extreme"
