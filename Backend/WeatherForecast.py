from flask import Flask, jsonify, request
from flask_cors import CORS
import logging
import requests
from datetime import datetime
from Utils.BackendUtils import API_URLS, API_KEYS

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})

logging.basicConfig(level=logging.DEBUG)

@app.route('/forecast', methods=['GET'])
def get_forecast():
    # Get parameters from the query string
    city = request.args.get('city')
    units = request.args.get('units')

    # Call the OpenWeather reverse geocoding API to get coordinates
    geolocation_url = f"https://api.openweathermap.org/geo/1.0/direct?q={city}&appid={API_KEYS['JOSHUA']}"
    geolocation_response = requests.get(geolocation_url)
    
    try:
        geolocation_response.raise_for_status()
    except requests.exceptions.RequestException as e:
        return jsonify({"error": f"Error fetching coordinates: {e}"}), 500

    geolocation_data = geolocation_response.json()
    if not geolocation_data:
        return jsonify({"error": "City not found"}), 404
    
    lat = geolocation_data[0]['lat']
    lon = geolocation_data[0]['lon']

    # Then, call the One Call API to get daily forecast data
    onecall_url = (
        f"{API_URLS['FORECAST']}?lat={lat}&lon={lon}&exclude=minutely,hourly,alerts,current&appid={API_KEYS['JOSHUA']}&units={units}"
    )
    forecast_response = requests.get(onecall_url)
    try:
        forecast_response.raise_for_status()
    except requests.exceptions.RequestException as e:
        return jsonify({"error": f"Error fetching forecast: {e}"}), 500

    return jsonify(forecast_response.json())

if __name__ == '__main__':
    app.run(port=5003, debug=True)
