from flask import Flask, jsonify
import requests
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # Allow cross-origin requests from React frontend

API_KEY = "6fd23365cb0cff93a229f133b710d825"

@app.route('/weather/<city>', methods=['GET'])
def get_weather(city):
    """Fetch weather data from OpenWeather API for a given city"""
    url = f"http://api.openweathermap.org/data/2.5/weather?q={city}&units=metric&appid={API_KEY}"
    
    try:
        response = requests.get(url)
        data = response.json()

        if response.status_code == 200:
            return jsonify(data)  # Send weather data to React
        else:
            return jsonify({"error": "City not found"}), 404
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)
