// script.js
const apiKey = '24106620cbdbd0abf71e61d0ebf6ed83'; // Your OpenWeatherMap API key
let previousSearches = [];

document.getElementById('searchBtn').addEventListener('click', function () {
    const location1 = document.getElementById('location1').value;
    const location2 = document.getElementById('location2').value;

    if (location1) fetchWeather(location1);
    if (location2) fetchWeather(location2);
});

document.getElementById('compareBtn').addEventListener('click', function () {
    const location1 = document.getElementById('prevLocation1').value;
    const location2 = document.getElementById('prevLocation2').value;
    const compareOptions = Array.from(document.querySelectorAll('input[name="compare"]:checked')).map(option => option.value);

    if (location1 && location2 && compareOptions.length > 0) {
        const search1 = previousSearches.find(search => search.name === location1);
        const search2 = previousSearches.find(search => search.name === location2);

        if (search1 && search2) {
            localStorage.setItem('compareData', JSON.stringify({ search1, search2, compareOptions }));
            window.location.href = 'comparison.html'; // Redirect to comparison page
        } else {
            alert('Selected locations not found in previous searches.');
        }
    } else {
        alert('Please select two locations and at least one comparison option.');
    }
});

function fetchWeather(location) {
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${location}&units=metric&appid=${apiKey}`;

    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            if (data.cod === 200) {
                const searchData = {
                    name: data.name,
                    city: data.name,
                    state: data.sys.country,
                    temp: data.main.temp,
                    feels_like: data.main.feels_like,
                    conditions: data.weather[0].description,
                    wind_speed: data.wind.speed,
                    wind_deg: data.wind.deg,
                    sunrise: new Date(data.sys.sunrise * 1000).toLocaleTimeString(),
                    sunset: new Date(data.sys.sunset * 1000).toLocaleTimeString(),
                    uv: 'N/A', // OpenWeatherMap doesn't provide UV index in the free tier
                    air_quality: 'N/A' // OpenWeatherMap doesn't provide air quality in the free tier
                };
                previousSearches.push(searchData);
                updatePreviousSearches();
            } else {
                alert('Location not found. Please try again.');
            }
        })
        .catch(error => {
            console.error('Error fetching weather data:', error);
        });
}

function updatePreviousSearches() {
    const prevLocation1 = document.getElementById('prevLocation1');
    const prevLocation2 = document.getElementById('prevLocation2');
    prevLocation1.innerHTML = '<option value="">Select Location</option>';
    prevLocation2.innerHTML = '<option value="">Select Location</option>';

    previousSearches.forEach(search => {
        const option = document.createElement('option');
        option.value = search.name;
        option.textContent = search.name;
        prevLocation1.appendChild(option.cloneNode(true));
        prevLocation2.appendChild(option);
    });
}