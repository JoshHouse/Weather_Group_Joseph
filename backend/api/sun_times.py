from flask import Blueprint, request, jsonify
import os
from datetime import datetime
from .utils import make_api_request, error_response, get_coordinates

# Get API key from environment variables
API_KEY = os.environ.get('OPENWEATHER_API_KEY')

# Create blueprint
sun_times_bp = Blueprint('sun_times', __name__)

@sun_times_bp.route('/', methods=['GET'])
def get_sun_times():
    """
    Get sunrise and sunset times for a city
    Query parameters:
    - city: Name of the city (required)
    """
    city = request.args.get('city')
    
    if not city:
        return error_response('City parameter is required')
    
    # Get weather data for the city
    url = f"https://api.openweathermap.org/data/2.5/weather?q={city}&appid={API_KEY}"
    data = make_api_request(url)
    
    if 'error' in data:
        return error_response(data['error'], data['status_code'])
    
    # Extract sunrise and sunset times from the response
    try:
        sunrise_timestamp = data['sys']['sunrise']
        sunset_timestamp = data['sys']['sunset']
        
        # Convert timestamps to readable times
        sunrise_time = datetime.utcfromtimestamp(sunrise_timestamp).strftime('%H:%M:%S')
        sunset_time = datetime.utcfromtimestamp(sunset_timestamp).strftime('%H:%M:%S')
        
        # Format the response
        formatted_data = {
            'city': data['name'],
            'coordinates': {
                'lat': data['coord']['lat'],
                'lon': data['coord']['lon']
            },
            'sunrise': {
                'timestamp': sunrise_timestamp,
                'time_utc': sunrise_time
            },
            'sunset': {
                'timestamp': sunset_timestamp,
                'time_utc': sunset_time
            },
            'timezone': data['timezone']  # Timezone offset in seconds from UTC
        }
        
        return jsonify(formatted_data)
    except KeyError:
        return error_response('Sun times data not available', 404)

@sun_times_bp.route('/by-coordinates', methods=['GET'])
def get_sun_times_by_coordinates():
    """
    Get sunrise and sunset times by latitude and longitude
    Query parameters:
    - lat: Latitude (required)
    - lon: Longitude (required)
    """
    lat = request.args.get('lat')
    lon = request.args.get('lon')
    
    if not lat or not lon:
        return error_response('Latitude and longitude parameters are required')
    
    # Get weather data using coordinates
    url = f"https://api.openweathermap.org/data/2.5/weather?lat={lat}&lon={lon}&appid={API_KEY}"
    data = make_api_request(url)
    
    if 'error' in data:
        return error_response(data['error'], data['status_code'])
    
    # Extract sunrise and sunset times from the response
    try:
        sunrise_timestamp = data['sys']['sunrise']
        sunset_timestamp = data['sys']['sunset']
        
        # Convert timestamps to readable times
        sunrise_time = datetime.utcfromtimestamp(sunrise_timestamp).strftime('%H:%M:%S')
        sunset_time = datetime.utcfromtimestamp(sunset_timestamp).strftime('%H:%M:%S')
        
        # Format the response
        formatted_data = {
            'city': data['name'],
            'coordinates': {
                'lat': float(lat),
                'lon': float(lon)
            },
            'sunrise': {
                'timestamp': sunrise_timestamp,
                'time_utc': sunrise_time
            },
            'sunset': {
                'timestamp': sunset_timestamp,
                'time_utc': sunset_time
            },
            'timezone': data['timezone']  # Timezone offset in seconds from UTC
        }
        
        return jsonify(formatted_data)
    except KeyError:
        return error_response('Sun times data not available', 404)
