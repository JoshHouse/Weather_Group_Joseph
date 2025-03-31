from flask import Flask, jsonify, request  # Flask for web server and jsonify for returning JSON responses
from flask_cors import CORS  # CORS for handling Cross-Origin Resource Sharing
import requests  # Requests for making HTTP requests to external APIs
from BackendUtils import API_URLS, API_KEYS

# Initialize Flask application
app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})  # Enable CORS to allow cross-origin requests

# Define the route for fetching weather forecast data
@app.route('/forecast', methods=['GET'])
def get_weather():
    city = request.args.get('q', 'London')  # Default city is London if not provided
    days = request.args.get('cnt', 7)  # Default to 7 days if not provided

    # OpenWeatherMap API URL for daily (up to 16) forecast
    url = f"{API_URLS['FORECAST']}/daily?q={city}&cnt={days}&appid={API_KEYS['HUNTER']}&units=imperial"
    
    # Make the HTTP GET request to OpenWeatherMap API
    response = requests.get(url)
    
    # Check if the API response is successful
    if response.status_code != 200:
        return jsonify({"error": "Failed to fetch data from OpenWeatherMap"}), 500
    
    # Parse JSON response
    data = response.json()
    
    # Extract relevant forecast details
    forecast_data = {
        "city": data["city"]["name"],
        "country": data["city"]["country"],
        "timezone": data["city"].get("timezone", "Unknown"),
        "forecast": []
    }
    
    for day in data["list"]:
        forecast_data["forecast"].append({
            "date": day["dt"],  # Unix timestamp for date 
            "temperature": {
                "day": day["temp"]["day"],
                "min": day["temp"]["min"],
                "max": day["temp"]["max"],
                "night": day["temp"]["night"],
                "eve": day["temp"]["eve"],
                "morn": day["temp"]["morn"]
            },
            "feels_like": {
                "day": day["feels_like"]["day"],
                "night": day["feels_like"]["night"],
                "eve": day["feels_like"]["eve"],
                "morn": day["feels_like"]["morn"]
            },
            "weather": {
                "id": day["weather"][0]["id"],
                "main": day["weather"][0]["main"],
                "description": day["weather"][0]["description"],
                "icon": day["weather"][0]["icon"]
            },
            "pressure": day["pressure"],
            "humidity": day["humidity"],
            "wind": {
                "speed": day["speed"],
                "direction": day["deg"],
                "gust": day.get("gust", 0)
            },
            "clouds": day["clouds"],
            "precipitation": {
                "rain": day.get("rain", 0),
                "snow": day.get("snow", 0),
                "pop": day.get("pop", 0)
            }
        })
    
    # Return the extracted forecast data as a JSON response
    return jsonify(forecast_data)

# Run the Flask app if executed directly
if __name__ == '__main__':
    app.run(port=5003, debug=True)
