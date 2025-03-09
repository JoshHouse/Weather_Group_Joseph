import os
from flask import Flask, jsonify # type: ignore
from flask_cors import CORS # type: ignore
from dotenv import load_dotenv # type: ignore

# Load environment variables from .env file
load_dotenv()

# Create Flask app
app = Flask(__name__)

# Enable CORS for all routes
CORS(app)

# Import API routes
from api.weather import weather_bp
from api.uv_index import uv_index_bp
from api.forecast import forecast_bp
from api.air_quality import air_quality_bp
from api.sun_times import sun_times_bp

# Register blueprints
app.register_blueprint(weather_bp, url_prefix='/api/weather')
app.register_blueprint(uv_index_bp, url_prefix='/api/uv-index')
app.register_blueprint(forecast_bp, url_prefix='/api/forecast')
app.register_blueprint(air_quality_bp, url_prefix='/api/air-quality')
app.register_blueprint(sun_times_bp, url_prefix='/api/sun-times')

# Root route
@app.route('/')
def index():
    return jsonify({
        'message': 'Weather API Backend',
        'endpoints': [
            '/api/weather',
            '/api/uv-index',
            '/api/forecast',
            '/api/air-quality',
            '/api/sun-times'
        ]
    })

# Run the app
if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port, debug=True)
