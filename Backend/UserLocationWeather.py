from flask import Flask, request, jsonify
import requests
from flask_cors import CORS
from Utils.BackendUtils import API_URLS, API_KEYS

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})  # Enable CORS for frontend access

@app.route('/user_location_weather', methods=['GET'])
def get_weather():
    lat = request.args.get('lat')
    lon = request.args.get('lon')
    units = request.args.get('units')

    if not lat or not lon:
        return jsonify({"error": "Latitude and longitude are required"}), 400

    weather_url = f"{API_URLS['WEATHER']}?lat={lat}&lon={lon}&appid={API_KEYS['JOSHUA']}&units={units}"
    
    try:
        response = requests.get(weather_url)
        response.raise_for_status()  # Raise error for bad responses (4xx, 5xx)
        return jsonify(response.json())  # Return weather data to frontend
    except requests.exceptions.RequestException as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(port=5002, debug=True)  # Run the server locally on port 5000 by default
