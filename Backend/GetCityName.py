from flask import Flask, jsonify, request
from flask_cors import CORS
import requests
from Utils.BackendUtils import API_URLS, API_KEYS

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})

@app.route('/name', methods=['GET'])
def get_city_name():
    lat, lon = request.args.get('lat'), request.args.get('lon')

    url = f"{API_URLS['NAME']}?lat={lat}&lon={lon}&limit=1&appid={API_KEYS['JOSHUA']}"
    
    try:
        response = requests.get(url)
        response.raise_for_status()  # Raise error for bad responses (4xx, 5xx)
        return jsonify(response.json())  # Return weather data to frontend
    except requests.exceptions.RequestException as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(port=5004, debug=True)