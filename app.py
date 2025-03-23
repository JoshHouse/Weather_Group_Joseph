from flask import Flask, jsonify, request
from flask_cors import CORS
import requests
import os
from datetime import datetime

app = Flask(__name__)
CORS(app)  # Allow frontend to communicate with backend

# OpenWeatherMap API key
API_KEY = "a7ecb5d8aaa97f57473de04085971f14"  # Using the key from WeatherConditionsPage.js
BASE_URL = "https://api.openweathermap.org/data/2.5"

@app.route('/')
def home():
    return "Flask backend is running!"

@app.route('/api/weather', methods=['GET'])
def get_weather():
    # Check if latitude and longitude are provided
    lat = request.args.get('lat')
    lon = request.args.get('lon')
    
    # Call OpenWeatherMap API
    if lat and lon:
        # Use coordinates if provided
        url = f"{BASE_URL}/weather?lat={lat}&lon={lon}&appid={API_KEY}&units=imperial"
    else:
        # Fall back to city name
        city = request.args.get('city', 'London')  # Default to London if no city provided
        url = f"{BASE_URL}/weather?q={city}&appid={API_KEY}&units=imperial"
    
    response = requests.get(url)
    
    if response.status_code != 200:
        return jsonify({"error": "Failed to fetch weather data"}), 500
    
    data = response.json()
    
    # Format the response
    weather_data = {
        "name": data['name'],
        "weather": data['weather'][0]['main'],
        "description": data['weather'][0]['description'],
        "temperature": data['main']['temp'],
        "feels_like": data['main']['feels_like'],
        "temp_max": data['main']['temp_max'],
        "temp_min": data['main']['temp_min'],
        "wind_speed": data['wind']['speed'],
        "wind_direction": data['wind']['deg'],
        "wind_gust": data['wind'].get('gust', 0),
        "sunrise": data['sys']['sunrise'],
        "sunset": data['sys']['sunset']
    }
    
    return jsonify(weather_data)

@app.route('/api/compare', methods=['GET'])
def compare_weather():
    city1 = request.args.get('city1', '')
    city2 = request.args.get('city2', '')
    
    if not city1 or not city2:
        return jsonify({"error": "Please provide two cities to compare"}), 400
    
    # Call OpenWeatherMap API for both cities
    url1 = f"{BASE_URL}/weather?q={city1}&appid={API_KEY}&units=imperial"
    url2 = f"{BASE_URL}/weather?q={city2}&appid={API_KEY}&units=imperial"
    
    response1 = requests.get(url1)
    response2 = requests.get(url2)
    
    if response1.status_code != 200 or response2.status_code != 200:
        return jsonify({"error": "Failed to fetch weather data for one or both cities"}), 500
    
    data1 = response1.json()
    data2 = response2.json()
    
    # Format the response for both cities
    weather_data = [
        {
            "city": data1['name'],
            "temp": f"{data1['main']['temp']}°F",
            "feelsLike": f"{data1['main']['feels_like']}°F",
            "condition": data1['weather'][0]['main'],
            "windDirection": get_wind_direction(data1['wind']['deg']),
            "windSpeed": f"{data1['wind']['speed']} mph",
            "sunset": datetime.fromtimestamp(data1['sys']['sunset']).strftime('%I:%M %p'),
            "uvIndex": "3",  # Placeholder - would need a separate API call
            "airQuality": "Good"  # Placeholder - would need a separate API call
        },
        {
            "city": data2['name'],
            "temp": f"{data2['main']['temp']}°F",
            "feelsLike": f"{data2['main']['feels_like']}°F",
            "condition": data2['weather'][0]['main'],
            "windDirection": get_wind_direction(data2['wind']['deg']),
            "windSpeed": f"{data2['wind']['speed']} mph",
            "sunset": datetime.fromtimestamp(data2['sys']['sunset']).strftime('%I:%M %p'),
            "uvIndex": "3",  # Placeholder - would need a separate API call
            "airQuality": "Good"  # Placeholder - would need a separate API call
        }
    ]
    
    return jsonify(weather_data)

@app.route('/api/forecast', methods=['GET'])
def get_forecast():
    city = request.args.get('city', 'London')  # Default to London if no city provided
    
    # Call OpenWeatherMap API for 5-day forecast
    url = f"{BASE_URL}/forecast?q={city}&appid={API_KEY}&units=imperial"
    response = requests.get(url)
    
    if response.status_code != 200:
        return jsonify({"error": "Failed to fetch forecast data"}), 500
    
    data = response.json()
    
    # Process the forecast data (OpenWeatherMap provides forecast in 3-hour intervals)
    # We'll group by day and take the middle of the day (noon) as representative
    daily_forecasts = {}
    
    for item in data['list']:
        date = datetime.fromtimestamp(item['dt']).strftime('%Y-%m-%d')
        hour = datetime.fromtimestamp(item['dt']).hour
        
        # Initialize the day if not already present
        if date not in daily_forecasts:
            daily_forecasts[date] = {
                "date": date,
                "temperature": {
                    "day": 0,
                    "min": float('inf'),
                    "max": float('-inf'),
                    "night": 0,
                    "eve": 0,
                    "morn": 0
                },
                "weather": "",
                "description": "",
                "humidity": 0,
                "wind_speed": 0
            }
        
        temp = item['main']['temp']
        
        # Update min/max temperature
        daily_forecasts[date]["temperature"]["min"] = min(daily_forecasts[date]["temperature"]["min"], temp)
        daily_forecasts[date]["temperature"]["max"] = max(daily_forecasts[date]["temperature"]["max"], temp)
        
        # Assign temperatures based on time of day
        if 5 <= hour < 12:  # Morning
            daily_forecasts[date]["temperature"]["morn"] = temp
        elif 12 <= hour < 17:  # Day
            daily_forecasts[date]["temperature"]["day"] = temp
            daily_forecasts[date]["weather"] = item['weather'][0]['main']
            daily_forecasts[date]["description"] = item['weather'][0]['description']
            daily_forecasts[date]["humidity"] = item['main']['humidity']
            daily_forecasts[date]["wind_speed"] = item['wind']['speed']
        elif 17 <= hour < 21:  # Evening
            daily_forecasts[date]["temperature"]["eve"] = temp
        else:  # Night
            daily_forecasts[date]["temperature"]["night"] = temp
    
    # Convert to list and sort by date
    forecast_list = list(daily_forecasts.values())
    forecast_list.sort(key=lambda x: x["date"])
    
    return jsonify(forecast_list)

@app.route('/api/settings', methods=['GET', 'POST'])
def handle_settings():
    if request.method == 'GET':
        # Return default settings
        settings = {
            "units": "imperial",
            "defaultCity": "London",
            "theme": "light"
        }
        return jsonify(settings)
    elif request.method == 'POST':
        # Update settings (in a real app, this would save to a database)
        data = request.json
        return jsonify({"message": "Settings updated successfully", "settings": data})

def get_wind_direction(degrees):
    """Convert wind direction in degrees to cardinal direction"""
    directions = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"]
    index = round(degrees / 45) % 8
    return directions[index]

if __name__ == '__main__':
    app.run(debug=True)
