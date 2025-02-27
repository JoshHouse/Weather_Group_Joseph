# Import necessary libraries
from flask import Flask, jsonify  # Flask for web server and jsonify for returning JSON responses
from flask_cors import CORS  # CORS for handling Cross-Origin Resource Sharing (important for frontend-backend communication)
import requests  # Requests for making HTTP requests to external APIs

# Initialize Flask application
app = Flask(__name__)

# Enable CORS to allow cross-origin requests (for communication between React frontend and Flask backend)
CORS(app)

# Define the route for the weather data endpoint
@app.route('/weather', methods=['GET'])
def get_weather():
    # My OpenWeatherMap API key *DO NOT USE*
    api_key = "a7ecb5d8aaa97f57473de04085971f14"  
    
    # Default city for weather data (will change to take dynamic input in the future)
    city = "London"  
    
    # URL to make the API call to OpenWeatherMap's weather data endpoint
    url = f"https://api.openweathermap.org/data/2.5/weather?q={city}&appid={api_key}&units=imperial"
    
    # Make the HTTP GET request to the OpenWeatherMap API
    response = requests.get(url)
    
    # Check if the API response status is successful (status code 200)
    if response.status_code != 200:
        # If not successful, return an error message and a 500 HTTP status code
        return jsonify({"error": "Failed to fetch data from OpenWeatherMap"}), 500
    
    # Parse the JSON data returned by the API
    data = response.json()

    # Extract relevant weather data from the API response
    weather_data = {
        "name": data["name"],  # Name of the city
        "weather": data["weather"][0]["main"],  # General weather condition (e.g. Rain)
        "description": data["weather"][0]["description"],  # Description of the weather condition (e.g. light rain)
        "temperature": data["main"]["temp"],  # Current temperature in Fahrenheit (due to 'units=imperial' in the URL)
        "feels_like": data["main"]["feels_like"],  # Feels like temperature in Fahrenheit (due to 'units=imperial' in the URL)
        "temp_max": data["main"]["temp_max"],  # Maximum temperature for the day in Fahrenheit (due to 'units=imperial' in the URL)
        "temp_min": data["main"]["temp_min"],  # Minimum temperature for the day in Fahrenheit (due to 'units=imperial' in the URL)
        "wind_speed": data["wind"]["speed"],  # Wind speed in miles per hour (due to 'units=imperial' in the URL)
        "wind_direction": data["wind"]["deg"],  # Wind direction in degrees (0-360, where 0 = North)
        "wind_gust": data["wind"].get("gust", 0),  # Wind gust speed in miles per hour (default to 0 if not available)
        "sunrise": data["sys"]["sunrise"],  # Sunrise time in Unix timestamp
        "sunset": data["sys"]["sunset"],  # Sunset time in Unix timestamp
    }

    # Return the extracted weather data as a JSON response
    return jsonify(weather_data)

# Run the Flask app if this script is executed directly (for local development/testing)
if __name__ == '__main__':
    app.run(debug=True)

