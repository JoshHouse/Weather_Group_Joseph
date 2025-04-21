# API_URL constants to avoid having to write the urls repeatedly
API_URLS = {
  "WEATHER": "https://api.openweathermap.org/data/2.5/weather",
  "FORECAST": "https://api.openweathermap.org/data/3.0/onecall",
  "NAME": "https://api.openweathermap.org/geo/1.0/reverse",
  "COORDINATES": "https://api.openweathermap.org/geo/1.0/direct"
}

# API_KEY constants to avoid having to write the keys repeatedly
API_KEYS = {
  "JOSHUA": "a7ecb5d8aaa97f57473de04085971f14",
<<<<<<< Updated upstream
  "EMMANUEL": "AIzaSyBDaeWicvigtP9xPv919E-RNoxfvC-Hqik",
  "HUNTER": "1abbb345f5735236601f4c038c1474a9"
=======
  "EMMANUEL": "",
  "HUNTER": "1abbb345f5735236601f4c038c1474a9",
  "GOOGLE_MAPS": "AIzaSyBDaeWicvigtP9xPv919E-RNoxfvC-Hqik"
>>>>>>> Stashed changes
}

# BACKEND_URL constants, specifically for name and coordinate conversions to help 
# with API requirement changes and to avoid having to write urls repeatedly
BACKEND_URLS = {
    "NAME": "http://127.0.0.1:5003",
    "COORDINATES": "http://127.0.0.1:5004"
}

# BACKEND_ENDPOINT constants, specifically for name and coordinate conversions to help 
# with API requirement changes and to avoid having to write endpoints repeatedly
BACKEND_ENDPOINTS = {
    "NAME": "/name",
    "COORDINATES": "/coordinates"
}