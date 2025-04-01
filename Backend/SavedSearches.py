from flask import Flask, request, jsonify
from flask_cors import CORS
import requests
import time
from Utils.BackendUtils import API_URLS, API_KEYS

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})  # Allow cross-origin requests

# Cache to store recent searches (city -> {timestamp, data})
weather_cache = {}
CACHE_EXPIRATION = 1800  # 30 minutes

@app.route("/saved_searches", methods=["GET"])
def get_weather():
    city = request.args.get("city")
    units = request.args.get('units')
    if not city:
        return jsonify({"error": "City parameter is required"}), 400
    
    current_time = time.time()

    # Check cache
    if city in weather_cache:
        cached_data = weather_cache[city]
        if current_time - cached_data["timestamp"] < CACHE_EXPIRATION:
            if units == cached_data["units"]:
                app.logger.info(f"Returning cached data for {city}")
                return jsonify(cached_data["data"])  # Return cached response
        
    # Fetch new weather data
    response = requests.get(f"{API_URLS['WEATHER']}?q={city}&appid={API_KEYS['JOSHUA']}&units={units}")

    if response.status_code == 200:
        weather_data = response.json()
        weather_cache[city] = {"timestamp": current_time, "data": weather_data, "units": units}
        app.logger.info(f"Returning API data for {city}")
        return jsonify(weather_data)
    else:
        return jsonify({"error": "Failed to fetch weather data"}), response.status_code
    
if __name__ == "__main__":
    app.run(port=5001, debug=True)