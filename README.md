# Weather Group Joseph - Weather Dashboard

This is the repository for Weather_Group_Joseph's Weather Dashboard Project for Software Engineering 2. The application provides weather information with an interactive map interface using Google Maps.

## Features

- View current weather conditions for any location
- Interactive Google Maps integration
- Click on the map to check weather at different locations
- Weekly weather forecasts
- Weather condition details
- Settings customization
- Compare weather between different locations

## Prerequisites

- Node.js (v18 or higher)
- Python 3.11
- npm or yarn package manager

## Installation

### Clone the repository

```bash
git clone https://github.com/JoshHouse/Weather_Group_Joseph.git
cd Weather_Group_Joseph
```

### Install Frontend Dependencies

```bash
npm install
# or if you use yarn
yarn install
```

### Install Backend Dependencies

```bash
pip install flask flask-cors requests
```

## Running the Application

The application consists of a React frontend and multiple Flask backend microservices. To run the entire application, use:

```bash
npm start
```

This command will:
1. Start the webpack development server for the frontend
2. Launch the main Flask application (Main.py) which will start all backend services

The frontend will be available at [http://localhost:8080](http://localhost:8080) (or the port configured in your webpack setup).

## Backend Services

The backend consists of several microservices running on different ports:

- Main Backend: Port 5000
- Saved Searches: Port 5001
- Weather Forecast: Port 5002
- City Name Service: Port 5003
- Coordinates Service: Port 5004
- Google Maps API Proxy: Port 5005
- Suggested Searches: Port 5006

All services are automatically started when you run `npm start`.

## Google Maps Integration

The application includes Google Maps integration with a secure backend proxy to protect API keys. The Google Maps functionality:

- Displays an interactive map in the home page
- Allows clicking on the map to get weather for specific locations
- Uses geocoding to convert between addresses and coordinates
- Securely manages API keys through the backend

No additional configuration is needed as the API key is already configured in the backend.

## Development

### Building for Production

To create a production build:

```bash
npm run build
```

### Project Structure

- `/src` - Frontend React code
- `/Backend` - Python Flask backend services
- `/public` - Static assets

## Troubleshooting

### Backend Services Not Starting

If you encounter issues with backend services not starting:

1. Ensure Python 3.11 is installed and available in your PATH
2. Verify all required Python packages are installed
3. Check that no other applications are using the required ports (5000-5006)

### Google Maps Not Loading

If the Google Maps component isn't loading:

1. Check that the backend service on port 5005 is running
2. Verify your internet connection
3. Check the browser console for any errors

## License

ISC