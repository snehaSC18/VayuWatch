
// OpenWeather API configuration
const API_KEY = '821fbb0a9d781fd77ea24520e975d0da';
const BASE_URL = 'https://api.openweathermap.org/data/2.5';

// DOM Elements
const temperatureElement = document.getElementById('temperature');
const locationElement = document.getElementById('location');
const datetimeElement = document.getElementById('datetime');
const weatherConditionElement = document.getElementById('weather-condition');
const tempMaxElement = document.getElementById('temp-max');
const tempMinElement = document.getElementById('temp-min');
const humidityElement = document.getElementById('humidity');
const cloudinessElement = document.getElementById('cloudiness');
const windSpeedElement = document.getElementById('wind-speed');
const forecastListElement = document.getElementById('forecast-list');
const searchForm = document.getElementById('search-form');
const searchInput = document.getElementById('search-input');
const snowContainer = document.getElementById('snow-container');
const leftPanel = document.querySelector('.left-panel');
const weatherIcon = document.querySelector('.weather-icon svg');
const feelsLikeElement = document.getElementById('feels-like');
const uvIndexElement = document.getElementById('uv-index');
const uvIndexStatusElement = document.getElementById('uv-status');
const airQualityValueElement = document.getElementById('air-quality-value');
const airQualityStatusElement = document.getElementById('air-quality-status');
const airQualityDescElement = document.getElementById('air-quality-desc');
const airQualityBarElement = document.getElementById('air-quality-bar');
const weeklyForecastElement = document.getElementById('weekly-forecast');

// Format date and time
function formatDateTime(timestamp, timezone) {
  // Convert timestamp to milliseconds and adjust for timezone
  const date = new Date(timestamp * 1000);
  // Get local time string in 24-hour format
  const options = { weekday: 'long', day: 'numeric', month: 'short', year: '2-digit' };
  const timeString = date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });
  const dateString = date.toLocaleDateString('en-US', options);
  
  return {
    time: timeString,
    date: dateString
  };
}

// Format date for weekly forecast
function formatDay(timestamp) {
  const date = new Date(timestamp * 1000);
  const options = { weekday: 'short', day: 'numeric', month: 'short' };
  return date.toLocaleDateString('en-US', options);
}

// Convert weather code to condition text
function getWeatherCondition(code) {
  const weatherCodes = {
    200: 'THUNDERSTORM WITH LIGHT RAIN',
    201: 'THUNDERSTORM WITH RAIN',
    202: 'THUNDERSTORM WITH HEAVY RAIN',
    210: 'LIGHT THUNDERSTORM',
    211: 'THUNDERSTORM',
    212: 'HEAVY THUNDERSTORM',
    221: 'RAGGED THUNDERSTORM',
    230: 'THUNDERSTORM WITH LIGHT DRIZZLE',
    231: 'THUNDERSTORM WITH DRIZZLE',
    232: 'THUNDERSTORM WITH HEAVY DRIZZLE',
    300: 'LIGHT INTENSITY DRIZZLE',
    301: 'DRIZZLE',
    302: 'HEAVY INTENSITY DRIZZLE',
    310: 'LIGHT INTENSITY DRIZZLE RAIN',
    311: 'DRIZZLE RAIN',
    312: 'HEAVY INTENSITY DRIZZLE RAIN',
    313: 'SHOWER RAIN AND DRIZZLE',
    314: 'HEAVY SHOWER RAIN AND DRIZZLE',
    321: 'SHOWER DRIZZLE',
    500: 'LIGHT RAIN',
    501: 'MODERATE RAIN',
    502: 'HEAVY INTENSITY RAIN',
    503: 'VERY HEAVY RAIN',
    504: 'EXTREME RAIN',
    511: 'FREEZING RAIN',
    520: 'LIGHT INTENSITY SHOWER RAIN',
    521: 'SHOWER RAIN',
    522: 'HEAVY INTENSITY SHOWER RAIN',
    531: 'RAGGED SHOWER RAIN',
    600: 'LIGHT SNOW',
    601: 'SNOW',
    602: 'HEAVY SNOW',
    611: 'SLEET',
    612: 'LIGHT SHOWER SLEET',
    613: 'SHOWER SLEET',
    615: 'LIGHT RAIN AND SNOW',
    616: 'RAIN AND SNOW',
    620: 'LIGHT SHOWER SNOW',
    621: 'SHOWER SNOW',
    622: 'HEAVY SHOWER SNOW',
    701: 'MIST',
    711: 'SMOKE',
    721: 'HAZE',
    731: 'SAND/DUST WHIRLS',
    741: 'FOG',
    751: 'SAND',
    761: 'DUST',
    762: 'VOLCANIC ASH',
    771: 'SQUALLS',
    781: 'TORNADO',
    800: 'CLEAR SKY',
    801: 'FEW CLOUDS',
    802: 'SCATTERED CLOUDS',
    803: 'BROKEN CLOUDS',
    804: 'OVERCAST CLOUDS'
  };
  
  return weatherCodes[code] || 'UNKNOWN WEATHER CONDITION';
}

// Get UV Index status based on value
function getUVIndexStatus(uvIndex) {
  if (uvIndex < 3) {
    return 'Low';
  } else if (uvIndex < 6) {
    return 'Moderate';
  } else if (uvIndex < 8) {
    return 'High';
  } else if (uvIndex < 11) {
    return 'Very High';
  } else {
    return 'Extreme';
  }
}

// Get Air Quality status based on AQI value
function getAirQualityStatus(aqi) {
  switch (aqi) {
    case 1: return 'Good';
    case 2: return 'Fair';
    case 3: return 'Moderate';
    case 4: return 'Poor';
    case 5: return 'Very Poor';
    default: return 'Unknown';
  }
}

// Get Air Quality description based on status
function getAirQualityDescription(status) {
  switch (status) {
    case 'Good': return 'Air quality is suitable for outdoor activity.';
    case 'Fair': return 'Air quality is acceptable for most individuals.';
    case 'Moderate': return 'Air quality is acceptable, but may cause concern for sensitive groups.';
    case 'Poor': return 'Members of sensitive groups may experience health effects.';
    case 'Very Poor': return 'Health warnings of emergency conditions for everyone.';
    default: return 'No air quality data available.';
  }
}

// Set the air quality indicator bar color and width
function updateAirQualityBar(aqi) {
  let barColor, barWidth;
  
  switch (aqi) {
    case 1:
      barColor = 'var(--good-air)';
      barWidth = '20%';
      break;
    case 2:
      barColor = 'var(--fair-air)';
      barWidth = '40%';
      break;
    case 3:
      barColor = 'var(--moderate-air)';
      barWidth = '60%';
      break;
    case 4:
      barColor = 'var(--poor-air)';
      barWidth = '80%';
      break;
    case 5:
      barColor = 'var(--very-poor-air)';
      barWidth = '100%';
      break;
    default:
      barColor = '#888';
      barWidth = '0%';
  }
  
  airQualityBarElement.style.width = barWidth;
  airQualityBarElement.style.backgroundColor = barColor;
}

// Update weather icon based on weather condition
function updateWeatherIcon(weatherId) {
  let iconPath = '';
  
  // Clear the current SVG content
  weatherIcon.innerHTML = '';
  
  // Set icon based on weather condition
  if (weatherId >= 200 && weatherId < 300) {
    // Thunderstorm
    iconPath = `
      <path d="M17 18a5 5 0 1 0-6-6.5 7 7 0 1 1-8 9.5h13a3 3 0 0 0 1-5Z"></path>
      <path d="m13 15-3 4"></path>
      <path d="m11 12-3 4"></path>
    `;
  } else if ((weatherId >= 300 && weatherId < 400) || (weatherId >= 500 && weatherId < 600)) {
    // Rain
    iconPath = `
      <path d="M17 18a5 5 0 1 0-6-6.5 7 7 0 1 1-8 9.5h13a3 3 0 0 0 1-5Z"></path>
      <path d="M9 16v2"></path>
      <path d="M13 16v2"></path>
      <path d="M17 16v2"></path>
    `;
  } else if (weatherId >= 600 && weatherId < 700) {
    // Snow
    iconPath = `
      <path d="M17 18a5 5 0 1 0-6-6.5 7 7 0 1 1-8 9.5h13a3 3 0 0 0 1-5Z"></path>
      <path d="M8 15h.01"></path>
      <path d="M12 15h.01"></path>
      <path d="M16 15h.01"></path>
      <path d="M8 19h.01"></path>
      <path d="M12 19h.01"></path>
      <path d="M16 19h.01"></path>
    `;
  } else if (weatherId >= 700 && weatherId < 800) {
    // Atmosphere (fog, mist, etc.)
    iconPath = `
      <path d="M3 10h18"></path>
      <path d="M3 14h18"></path>
      <path d="M3 18h18"></path>
      <path d="M3 6h18"></path>
    `;
  } else if (weatherId === 800) {
    // Clear sky
    iconPath = `
      <circle cx="12" cy="12" r="5"></circle>
      <line x1="12" y1="1" x2="12" y2="3"></line>
      <line x1="12" y1="21" x2="12" y2="23"></line>
      <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
      <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
      <line x1="1" y1="12" x2="3" y2="12"></line>
      <line x1="21" y1="12" x2="23" y2="12"></line>
      <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
      <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
    `;
  } else {
    // Cloudy (default)
    iconPath = `
      <path d="M17.5 21H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z"></path>
      <path d="M22 10a3 3 0 0 0-3-3h-2.207a5.502 5.502 0 0 0-10.702.5"></path>
    `;
  }
  
  weatherIcon.innerHTML = iconPath;
}

// Set background image based on weather condition
function setBackgroundImage(weatherId) {
  let backgroundImage = '';
  
  if (weatherId >= 200 && weatherId < 300) {
    // Thunderstorm
    backgroundImage = 'https://images.unsplash.com/photo-1605727216801-e27ce1d0cc28?auto=format&fit=crop&w=1200&q=80';
  } else if ((weatherId >= 300 && weatherId < 400) || (weatherId >= 500 && weatherId < 600)) {
    // Rain
    backgroundImage = 'https://images.unsplash.com/photo-1515694346937-94d85e41e695?auto=format&fit=crop&w=1200&q=80';
  } else if (weatherId >= 600 && weatherId < 700) {
    // Snow
    backgroundImage = 'https://images.unsplash.com/photo-1482938289607-e9573fc25ebb?auto=format&fit=crop&w=1200&q=80';
  } else if (weatherId >= 700 && weatherId < 800) {
    // Atmosphere (fog, mist, etc.)
    backgroundImage = 'https://images.unsplash.com/photo-1485236715568-ddc5ee6ca227?auto=format&fit=crop&w=1200&q=80';
  } else if (weatherId === 800) {
    // Clear sky
    backgroundImage = 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=1200&q=80';
  } else {
    // Cloudy (default)
    backgroundImage = 'https://images.unsplash.com/photo-1525087740718-9e0f2c58c7ef?auto=format&fit=crop&w=1200&q=80';
  }
  
  leftPanel.style.backgroundImage = `url('${backgroundImage}')`;
  
  // Show snow animation only for snow weather conditions
  if (weatherId >= 600 && weatherId < 700) {
    createSnowflakes();
    snowContainer.style.display = 'block';
  } else {
    snowContainer.style.display = 'none';
    snowContainer.innerHTML = '';
  }
}

// Update UI with weather data
function updateWeatherUI(data) {
  // Update main weather info
  temperatureElement.textContent = `${Math.round(data.temperature)}°`;
  locationElement.textContent = data.location;
  datetimeElement.textContent = `${data.time} - ${data.date}`;
  weatherConditionElement.textContent = data.condition;
  
  // Update weather details
  tempMaxElement.textContent = `${Math.round(data.details.tempMax)}°`;
  tempMinElement.textContent = `${Math.round(data.details.tempMin)}°`;
  humidityElement.textContent = `${data.details.humidity}%`;
  cloudinessElement.textContent = `${data.details.cloudiness}%`;
  windSpeedElement.textContent = `${Math.round(data.details.windSpeed)}km/h`;
  
  // Update new detail elements
  feelsLikeElement.textContent = `${Math.round(data.details.feelsLike)}°`;
  uvIndexElement.textContent = data.details.uvIndex;
  uvIndexStatusElement.textContent = getUVIndexStatus(data.details.uvIndex);
  
  // Update air quality 
  airQualityValueElement.textContent = data.airQuality.value;
  airQualityStatusElement.textContent = data.airQuality.status;
  airQualityDescElement.textContent = data.airQuality.description;
  updateAirQualityBar(data.airQuality.aqi);
  
  // Update weather icon and background
  updateWeatherIcon(data.weatherId);
  setBackgroundImage(data.weatherId);
  
  // Update hourly forecast
  forecastListElement.innerHTML = '';
  data.forecast.forEach(item => {
    const forecastItem = document.createElement('div');
    forecastItem.className = 'forecast-item';
    
    let forecastIcon = '';
    if (item.weatherId >= 600 && item.weatherId < 700) {
      // Snow icon
      forecastIcon = `
        <path d="M2 12h10"></path>
        <path d="m9 4 3 8 3-8"></path>
        <path d="M9 20h10"></path>
        <path d="m19 12-3 8-3-8"></path>
      `;
    } else if ((item.weatherId >= 300 && item.weatherId < 400) || (item.weatherId >= 500 && item.weatherId < 600)) {
      // Rain icon
      forecastIcon = `
        <path d="M8 19v2"></path>
        <path d="M8 13v2"></path>
        <path d="M16 19v2"></path>
        <path d="M16 13v2"></path>
        <path d="M12 21v2"></path>
        <path d="M12 15v2"></path>
      `;
    } else {
      // Default cloud icon
      forecastIcon = `
        <path d="M17.5 21H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z"></path>
      `;
    }
    
    forecastItem.innerHTML = `
      <div class="forecast-info">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="forecast-icon">
          ${forecastIcon}
        </svg>
        <div>
          <div class="forecast-time">${item.time}</div>
          <div class="forecast-condition">${item.condition}</div>
        </div>
      </div>
      <div class="forecast-temp">${Math.round(item.temperature)}°</div>
    `;
    
    forecastListElement.appendChild(forecastItem);
  });
  
  // Update weekly forecast
  weeklyForecastElement.innerHTML = '';
  if (data.weeklyForecast) {
    data.weeklyForecast.forEach(item => {
      const weeklyItem = document.createElement('div');
      weeklyItem.className = 'weekly-forecast-item';
      
      let forecastIcon = '';
      if (item.weatherId >= 600 && item.weatherId < 700) {
        // Snow icon
        forecastIcon = `
          <path d="M2 12h10"></path>
          <path d="m9 4 3 8 3-8"></path>
          <path d="M9 20h10"></path>
          <path d="m19 12-3 8-3-8"></path>
        `;
      } else if ((item.weatherId >= 300 && item.weatherId < 400) || (item.weatherId >= 500 && item.weatherId < 600)) {
        // Rain icon
        forecastIcon = `
          <path d="M8 19v2"></path>
          <path d="M8 13v2"></path>
          <path d="M16 19v2"></path>
          <path d="M16 13v2"></path>
          <path d="M12 21v2"></path>
          <path d="M12 15v2"></path>
        `;
      } else {
        // Default cloud icon
        forecastIcon = `
          <path d="M17.5 21H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z"></path>
        `;
      }
      
      weeklyItem.innerHTML = `
        <div class="weekly-day">${item.day}</div>
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="weekly-icon">
          ${forecastIcon}
        </svg>
        <div class="weekly-temp-range">
          <span class="weekly-temp-max">${Math.round(item.tempMax)}°</span>
          <span class="weekly-temp-min">${Math.round(item.tempMin)}°</span>
        </div>
      `;
      
      weeklyForecastElement.appendChild(weeklyItem);
    });
  }
}

// Fetch current weather data from OpenWeather API
async function fetchWeatherData(location = 'Asansol') {
  weatherConditionElement.textContent = 'Loading...';
  try {
    // Fetch current weather data
    const currentWeatherResponse = await fetch(`${BASE_URL}/weather?q=${location}&units=metric&appid=${API_KEY}`);
    
    if (!currentWeatherResponse.ok) {
      throw new Error('Location not found');
    }
    
    const currentWeatherData = await currentWeatherResponse.json();
    
    if (!currentWeatherData) {
      throw new Error('Failed to fetch weather data');
    }
    
    // Fetch 3-hour forecast data
    const forecastResponse = await fetch(`${BASE_URL}/forecast?q=${location}&units=metric&appid=${API_KEY}`);
    const forecastData = await forecastResponse.json();
    
    // Get coordinates for air quality data
    const lat = currentWeatherData.coord.lat;
    const lon = currentWeatherData.coord.lon;
    
    // Fetch air quality data
    const airQualityResponse = await fetch(`https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${API_KEY}`);
    const airQualityData = await airQualityResponse.json();
    
    // Get timezone offset in seconds
    const timezoneOffsetSeconds = currentWeatherData.timezone;
    
    // Calculate local time
    const currentTime = new Date();
    const utcTime = currentTime.getTime() + (currentTime.getTimezoneOffset() * 60000);
    const cityTime = new Date(utcTime + (timezoneOffsetSeconds * 1000));
    
    // Format time and date for display
    const hours = cityTime.getHours().toString().padStart(2, '0');
    const minutes = cityTime.getMinutes().toString().padStart(2, '0');
    const timeString = `${hours}:${minutes}`;
    
    // Format date
    const options = { weekday: 'long', day: 'numeric', month: 'short', year: '2-digit' };
    const dateString = cityTime.toLocaleDateString('en-US', options);
    
    // Extract only the next few forecast items (by 3-hour intervals)
    const forecastItems = forecastData.list.slice(0, 2).map(item => {
      // Convert UTC timestamp to local time with timezone offset
      const forecastUtcTime = item.dt * 1000;
      const forecastLocalTime = new Date(forecastUtcTime + (timezoneOffsetSeconds * 1000));
      const forecastHours = forecastLocalTime.getHours().toString().padStart(2, '0');
      const forecastMinutes = forecastLocalTime.getMinutes().toString().padStart(2, '0');
      const forecastTimeString = `${forecastHours}:${forecastMinutes}`;
      
      return {
        time: forecastTimeString,
        condition: getWeatherCondition(item.weather[0].id),
        temperature: item.main.temp,
        weatherId: item.weather[0].id
      };
    });
    
    // Create weekly forecast using the 5-day/3-hour forecast data
    // Since OneCall API is returning 401, we'll create a weekly forecast from the available data
    const weeklyForecast = [];
    
    // Get unique dates from forecast data
    const uniqueDates = new Set();
    const dailyData = {};
    
    // Process forecast data to get daily min/max
    forecastData.list.forEach(item => {
      const date = new Date(item.dt * 1000);
      const dateKey = date.toISOString().split('T')[0];
      
      if (!dailyData[dateKey]) {
        dailyData[dateKey] = {
          dt: item.dt,
          tempMin: item.main.temp_min,
          tempMax: item.main.temp_max,
          weatherId: item.weather[0].id
        };
        uniqueDates.add(dateKey);
      } else {
        // Update min/max temperatures
        dailyData[dateKey].tempMin = Math.min(dailyData[dateKey].tempMin, item.main.temp_min);
        dailyData[dateKey].tempMax = Math.max(dailyData[dateKey].tempMax, item.main.temp_max);
      }
    });
    
    // Convert to array format needed for display
    Object.keys(dailyData).slice(0, 7).forEach(date => {
      const day = dailyData[date];
      weeklyForecast.push({
        day: formatDay(day.dt),
        tempMax: day.tempMax,
        tempMin: day.tempMin,
        weatherId: day.weatherId,
        condition: getWeatherCondition(day.weatherId)
      });
    });
    
    // Get air quality data
    const airQuality = airQualityData.list[0];
    const aqi = airQuality.main.aqi; // Air Quality Index (1-5)
    const aqiStatus = getAirQualityStatus(aqi);
    const aqiDescription = getAirQualityDescription(aqiStatus);
    
    // Build weather data object
    return {
      temperature: currentWeatherData.main.temp,
      location: currentWeatherData.name + ', ' + currentWeatherData.sys.country,
      time: timeString,
      date: dateString,
      condition: getWeatherCondition(currentWeatherData.weather[0].id),
      weatherId: currentWeatherData.weather[0].id,
      details: {
        tempMax: currentWeatherData.main.temp_max,
        tempMin: currentWeatherData.main.temp_min,
        humidity: currentWeatherData.main.humidity,
        cloudiness: currentWeatherData.clouds.all,
        windSpeed: currentWeatherData.wind.speed * 3.6, // Convert m/s to km/h
        feelsLike: currentWeatherData.main.feels_like,
        uvIndex: 0 // Default to 0 since OneCall API is returning 401 Unauthorized
      },
      forecast: forecastItems,
      weeklyForecast: weeklyForecast,
      airQuality: {
        value: aqi,
        aqi: aqi,
        status: aqiStatus,
        description: aqiDescription
      }
    };
  } catch (error) {
    console.error('Error fetching weather data:', error);
    alert(`Error: ${error.message}`);
    // Return default data in case of error
    return null;
  }
}

// Create snowflakes
function createSnowflakes() {
  // Clear previous snowflakes
  snowContainer.innerHTML = '';
  
  const numberOfSnowflakes = 40;
  
  for (let i = 0; i < numberOfSnowflakes; i++) {
    const snowflake = document.createElement('div');
    snowflake.className = 'snowflake';
    
    // Random size between 5px and 15px
    const size = Math.random() * 10 + 5;
    snowflake.style.width = `${size}px`;
    snowflake.style.height = `${size}px`;
    
    // Random position
    snowflake.style.left = `${Math.random() * 100}%`;
    snowflake.style.top = `${Math.random() * 100}%`;
    
    // Animation with random duration and delay
    const duration = Math.random() * 10 + 5;
    const delay = Math.random() * 5;
    snowflake.style.animation = `snowfall ${duration}s linear infinite`;
    snowflake.style.animationDelay = `${delay}s`;
    
    snowContainer.appendChild(snowflake);
  }
}

// Handle search form submission
searchForm.addEventListener('submit', async function(e) {
  e.preventDefault();
  const searchTerm = searchInput.value.trim();
  
  if (searchTerm) {
    try {
      // Show loading indicator
      weatherConditionElement.textContent = 'Loading...';
      
      const data = await fetchWeatherData(searchTerm);
      if (data) {
        updateWeatherUI(data);
      }
      searchInput.value = ''; // Clear the input
    } catch (error) {
      console.error("Error fetching weather data:", error);
      alert('Failed to fetch weather data. Please try again later.');
    }
  }
});

// Initialize the app
async function init() {
  try {
    // Show loading placeholder for Asansol instead of London
    locationElement.textContent = 'Asansol';
    weatherConditionElement.textContent = 'Loading...';
    
    const data = await fetchWeatherData();
    if (data) {
      updateWeatherUI(data);
    }
  } catch (error) {
    console.error("Error initializing app:", error);
    alert('Failed to initialize the app. Please try again later.');
  }
}

// Start the app when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', init);