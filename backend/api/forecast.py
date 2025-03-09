from flask import Blueprint, request, jsonify # type: ignore
import os
from .utils import make_api_request, error_response, get_coordinates

# Get API key from environment variables
API_KEY = os.environ.get('OPENWEATHER_API_KEY')

# Create blueprint
forecast_bp = Blueprint('forecast', __name__)

@forecast_bp.route('/', methods=['GET'])
def get_forecast():
    """
    Get weather forecast for a city
    Query parameters:
    - city: Name of the city (required)
    - days: Number of days (optional, default: 5)
    - units: Units of measurement (optional, default: imperial)
    """
    city = request.args.get('city')
    days = request.args.get('days', '5')
    units = request.args.get('units', 'imperial')
    
    if not city:
        return error_response('City parameter is required')
    
    try:
        days = int(days)
        if days < 1 or days > 7:
            return error_response('Days parameter must be between 1 and 7')
    except ValueError:
        return error_response('Days parameter must be a number')
    
    # Validate units parameter
    if units not in ['standard', 'metric', 'imperial']:
        return error_response('Units must be one of: standard, metric, imperial')
    
    # First, get coordinates for the city
    coords = get_coordinates(city)
    
    if 'error' in coords:
        return error_response(coords['error'], coords.get('status_code', 400))
    
    # Now get forecast using coordinates
    lat = coords['lat']
    lon = coords['lon']
    
    # Using the One Call API for forecast data
    url = f"https://api.openweathermap.org/data/3.0/onecall?lat={lat}&lon={lon}&exclude=current,minutely,hourly,alerts&appid={API_KEY}&units={units}"
    data = make_api_request(url)
    
    if 'error' in data:
        return error_response(data['error'], data['status_code'])
    
    # Extract forecast data from the response
    try:
        # Limit to the requested number of days
        daily_forecast = data['daily'][:days]
        
        # Format the response
        formatted_data = {
            'city': coords['city_name'],
            'coordinates': {
                'lat': lat,
                'lon': lon
            },
            'forecast': []
        }
        
        for day in daily_forecast:
            day_data = {
                'date': day['dt'],  # Unix timestamp
                'temperature': {
                    'day': day['temp']['day'],
                    'min': day['temp']['min'],
                    'max': day['temp']['max'],
                    'night': day['temp']['night'],
                    'evening': day['temp']['eve'],
                    'morning': day['temp']['morn']
                },
                'feels_like': {
                    'day': day['feels_like']['day'],
                    'night': day['feels_like']['night'],
                    'evening': day['feels_like']['eve'],
                    'morning': day['feels_like']['morn']
                },
                'pressure': day['pressure'],
                'humidity': day['humidity'],
                'weather': [{
                    'main': condition['main'],
                    'description': condition['description'],
                    'icon': condition['icon']
                } for condition in day['weather']],
                'wind_speed': day['wind_speed'],
                'wind_deg': day['wind_deg'],
                'clouds': day['clouds'],
                'pop': day['pop'],  # Probability of precipitation
                'rain': day.get('rain', 0),  # Rain volume, if available
                'uvi': day['uvi']  # UV index
            }
            formatted_data['forecast'].append(day_data)
        
        return jsonify(formatted_data)
    except KeyError as e:
        return error_response(f'Forecast data not available: {str(e)}', 404)

@forecast_bp.route('/by-coordinates', methods=['GET'])
def get_forecast_by_coordinates():
    """
    Get weather forecast by latitude and longitude
    Query parameters:
    - lat: Latitude (required)
    - lon: Longitude (required)
    - days: Number of days (optional, default: 5)
    - units: Units of measurement (optional, default: imperial)
    """
    lat = request.args.get('lat')
    lon = request.args.get('lon')
    days = request.args.get('days', '5')
    units = request.args.get('units', 'imperial')
    
    if not lat or not lon:
        return error_response('Latitude and longitude parameters are required')
    
    try:
        days = int(days)
        if days < 1 or days > 7:
            return error_response('Days parameter must be between 1 and 7')
    except ValueError:
        return error_response('Days parameter must be a number')
    
    # Validate units parameter
    if units not in ['standard', 'metric', 'imperial']:
        return error_response('Units must be one of: standard, metric, imperial')
    
    # Get forecast using coordinates
    url = f"https://api.openweathermap.org/data/3.0/onecall?lat={lat}&lon={lon}&exclude=current,minutely,hourly,alerts&appid={API_KEY}&units={units}"
    data = make_api_request(url)
    
    if 'error' in data:
        return error_response(data['error'], data['status_code'])
    
    # Get city name from reverse geocoding
    city_url = f"https://api.openweathermap.org/geo/1.0/reverse?lat={lat}&lon={lon}&limit=1&appid={API_KEY}"
    city_data = make_api_request(city_url)
    
    city_name = "Unknown"
    if not 'error' in city_data and len(city_data) > 0:
        city_name = city_data[0].get('name', "Unknown")
    
    # Extract forecast data from the response
    try:
        # Limit to the requested number of days
        daily_forecast = data['daily'][:days]
        
        # Format the response
        formatted_data = {
            'city': city_name,
            'coordinates': {
                'lat': float(lat),
                'lon': float(lon)
            },
            'forecast': []
        }
        
        for day in daily_forecast:
            day_data = {
                'date': day['dt'],  # Unix timestamp
                'temperature': {
                    'day': day['temp']['day'],
                    'min': day['temp']['min'],
                    'max': day['temp']['max'],
                    'night': day['temp']['night'],
                    'evening': day['temp']['eve'],
                    'morning': day['temp']['morn']
                },
                'feels_like': {
                    'day': day['feels_like']['day'],
                    'night': day['feels_like']['night'],
                    'evening': day['feels_like']['eve'],
                    'morning': day['feels_like']['morn']
                },
                'pressure': day['pressure'],
                'humidity': day['humidity'],
                'weather': [{
                    'main': condition['main'],
                    'description': condition['description'],
                    'icon': condition['icon']
                } for condition in day['weather']],
                'wind_speed': day['wind_speed'],
                'wind_deg': day['wind_deg'],
                'clouds': day['clouds'],
                'pop': day['pop'],  # Probability of precipitation
                'rain': day.get('rain', 0),  # Rain volume, if available
                'uvi': day['uvi']  # UV index
            }
            formatted_data['forecast'].append(day_data)
        
        return jsonify(formatted_data)
    except KeyError as e:
        return error_response(f'Forecast data not available: {str(e)}', 404)
