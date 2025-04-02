from flask import Flask
from flask_cors import CORS  # Import CORS
import subprocess
import os

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

@app.route("/")
def home():
    return "Server is running!"

scripts = [
    (os.path.join(os.path.dirname(__file__), 'SavedSearches.py'), 5001),
    (os.path.join(os.path.dirname(__file__), 'UserLocationWeather.py'), 5002),
    (os.path.join(os.path.dirname(__file__), 'WeatherForecast.py'), 5003),
    (os.path.join(os.path.dirname(__file__), 'GetCityName.py'), 5004)
]

processes = []
for script, port in scripts:
    process = subprocess.Popen(["python3.11", script])
    processes.append(process)

try:
    for process in processes:
        process.wait()
except KeyboardInterrupt:
    print("Shutting down all services...")
    for process in processes:
        process.terminate()

if __name__ == "__main__":
    app.run(debug=True)