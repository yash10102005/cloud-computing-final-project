const country = document.querySelector("#country");
const city = document.querySelector("#city");
const check = document.querySelector("#check");
const tempIcon = document.querySelector("#tempIcon");
const weatherCountry = document.querySelector("#weatherCountry");
const temperature = document.querySelector("#temperature");
const weatherDescription = document.querySelector("#weatherDescription");
const feelsLike = document.querySelector("#feelsLike");
const humidity = document.querySelector("#humidity");
const coordinates = document.querySelector("#coordinates");

// Background gradients for different weather conditions
const weatherBackgrounds = {
    'clear': 'linear-gradient(135deg, #ff9a9e 0%, #fad0c4 100%)',
    'clouds': 'linear-gradient(135deg, #a1c4fd 0%, #c2e9fb 100%)',
    'rain': 'linear-gradient(135deg, #6a11cb 0%, #2575fc 100%)',
    'thunderstorm': 'linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%)',
    'snow': 'linear-gradient(135deg, #e0f7fa 0%, #b2ebf2 100%)',
    'mist': 'linear-gradient(135deg, #c9d6ff 0%, #e2e2e2 100%)',
    'default': 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
};

// Weather icon mapping
const weatherIcons = {
    'clear': 'tempicons/sun.svg',
    'sunny': 'tempicons/sun.svg',
    'clouds': 'tempicons/clouds.svg',
    'cloudy': 'tempicons/clouds.svg',
    'overcast': 'tempicons/clouds.svg',
    'rain': 'tempicons/rain.svg',
    'thunderstorm': 'tempicons/storm.svg',
    'snow': 'tempicons/snow.svg',
    'mist': 'tempicons/atmosphere.svg',
    'fog': 'tempicons/atmosphere.svg',
    'drizzle': 'tempicons/drizzle.svg'
};

// Event listeners
check.addEventListener("click", getWeather);
city.addEventListener("keypress", (e) => e.key === "Enter" && getWeather());
country.addEventListener("keypress", (e) => e.key === "Enter" && getWeather());

function getWeather() {
    const countryVal = country.value.trim();
    const cityVal = city.value.trim();
    
    if (!cityVal) {
        alert("Please enter a city name");
        return;
    }
    
    const apiKey = 'YOUR API KEY';
    const query = countryVal ? `${cityVal},${countryVal}` : cityVal;
    const url = `YOUR API`;
    
    // Loading state
    weatherCountry.textContent = "Loading...";
    temperature.innerHTML = "--°<strong>C</strong>";
    weatherDescription.textContent = "Fetching weather data...";
    
    fetch(url)
        .then(response => {
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            return response.json();
        })
        .then(data => {
            if (data.error) throw new Error(data.error.message);
            updateWeatherUI(data);
        })
        .catch(error => {
            console.error('Error:', error);
            weatherCountry.textContent = "Error loading data";
            weatherDescription.textContent = error.message || "Please check the city name";
            resetWeatherData();
        });
}

function updateWeatherUI(data) {
    if (!data?.current?.condition || !data?.location) {
        throw new Error("Invalid weather data structure");
    }
    
    // Update main info
    weatherCountry.textContent = `${data.location.name}, ${data.location.country || 'N/A'}`;
    temperature.innerHTML = `${Math.round(data.current.temp_c)}°<strong>C</strong>`;
    weatherDescription.textContent = data.current.condition.text;
    
    // Determine weather type
    const condition = data.current.condition.text.toLowerCase();
    let weatherType = 'default';
    
    if (condition.includes('sun') || condition.includes('clear')) weatherType = 'clear';
    else if (condition.includes('cloud')) weatherType = 'clouds';
    else if (condition.includes('rain')) weatherType = 'rain';
    else if (condition.includes('thunder') || condition.includes('storm')) weatherType = 'thunderstorm';
    else if (condition.includes('snow')) weatherType = 'snow';
    else if (condition.includes('mist') || condition.includes('fog')) weatherType = 'mist';
    else if (condition.includes('drizzle')) weatherType = 'drizzle';
    
    // Update visuals
    updateBackground(weatherType);
    updateWeatherIcon(weatherType, data.current.condition.text);
    
    // Update details
    feelsLike.textContent = `${Math.round(data.current.feelslike_c)}°C`;
    humidity.textContent = `${data.current.humidity}%`;
    coordinates.textContent = `${data.location.lat.toFixed(2)}, ${data.location.lon.toFixed(2)}`;
}

function updateBackground(weatherType) {
    const bgElement = document.createElement('div');
    bgElement.className = 'weather-bg';
    bgElement.style.background = weatherBackgrounds[weatherType] || weatherBackgrounds['default'];
    document.body.appendChild(bgElement);
    
    setTimeout(() => {
        bgElement.style.opacity = '1';
        setTimeout(() => {
            const oldBg = document.querySelector('.weather-bg:not(:last-child)');
            if (oldBg) oldBg.remove();
        }, 800);
    }, 50);
}

function updateWeatherIcon(weatherType, altText) {
    tempIcon.src = weatherIcons[weatherType] || weatherIcons['clouds'];
    tempIcon.alt = altText;
    tempIcon.onerror = () => { tempIcon.src = weatherIcons['clouds']; };
}

function resetWeatherData() {
    temperature.innerHTML = "--°<strong>C</strong>";
    feelsLike.textContent = "--°C";
    humidity.textContent = "--%";
    coordinates.textContent = "--, --";
    tempIcon.src = "tempicons/clouds.svg";
    document.body.style.background = weatherBackgrounds['default'];
}

// Initialize
resetWeatherData();