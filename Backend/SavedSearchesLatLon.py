from flask import Flask, request, jsonify
from flask_cors import CORS
import requests
import time
import urllib.parse
from Utils.BackendUtils import API_URLS, API_KEYS

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})

# ------ Initializing Cache Details ------
weather_cache = {}
CACHE_EXPIRATION = 1800  # 30 minutes

# Backend Endpoint "/saved_searches_lat_lon"
@app.route("/saved_searches_lat_lon", methods=["GET"])
def get_weather_by_coordinates():
    
    # ------ Getting the request details ------
    lat = request.args.get("lat")
    lon = request.args.get("lon")
    units = request.args.get('units')

    if not lat or not lon or not units:
        return jsonify({"error": "Latitude, longitude, and units parameters are required"}), 400

    cache_key = f"{lat},{lon}"
    current_time = time.time()

    # ------ Checking the Cache ------
    if cache_key in weather_cache:
        cached_data = weather_cache[cache_key]
        if current_time - cached_data["timestamp"] < CACHE_EXPIRATION:
            if units == cached_data["units"]:
                app.logger.info(f"RESPONSE LOG: Returning cached weather for coordinates {lat}, {lon}")
                return jsonify(cached_data["data"])
        else:
            del weather_cache[cache_key]

    # ------ Making the API Call ------
    url = f"{API_URLS['WEATHER']}?lat={lat}&lon={lon}&appid={API_KEYS['JOSHUA']}&units={units}"
    response = requests.get(url)

    if response.status_code == 200:
        weather_data = response.json()
        weather_cache[cache_key] = {"timestamp": current_time, "data": weather_data, "units": units}

        app.logger.info(f"RESPONSE LOG: Returning fetched API weather for coordinates {lat}, {lon}")
        return jsonify(weather_data)
    else:
        app.logger.info(f"Fetching weather with URL: ?lat={lat}&lon={lon}&units={units}")
        return jsonify({"error": "Failed to fetch weather data from API"}), response.status_code

# Run this file on port 5007
if __name__ == "__main__":
    app.run(port=5007, debug=True)
