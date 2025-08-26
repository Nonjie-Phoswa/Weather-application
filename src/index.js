document.addEventListener("DOMContentLoaded", () => {
  // If browser supports geolocation, get user's location
  if ("geolocation" in navigator) {
    navigator.geolocation.getCurrentPosition(
      fetchWeatherByCoords,
      handleGeoError
    );
  }
});

// Event listeners
let formDetails = document.querySelector("#weather-form");
let newPlace = document.querySelector("#searched-place");
let searchInput = document.querySelector("#searched-place");
let suggestionsList = document.querySelector("#suggestions");
let searchContainer = document.querySelector(".search-container");
formDetails.addEventListener("submit", updatePlace);

const cityElement = document.getElementById("city");
const conditionElement = document.getElementById("condition");
const humidityElement = document.getElementById("humidityValue");
const windElement = document.getElementById("windValue");
const tempValueElement = document.getElementById("tempValue");
const tempIconElement = document.getElementById("tempIcon");

// Fetch weather from SheCodes API
async function fetchWeather(city) {
  try {
    const apiKey = "b33a0e7a6oc54ed07cdc24f8fb5ft43a";
    const response = await axios.get(
      `https://api.shecodes.io/weather/v1/current?query=${city}&key=${apiKey}&units=metric`
    );

    const data = response.data;

    // Update your existing HTML
    cityElement.textContent = data.city;
    conditionElement.textContent = data.condition.description;
    humidityElement.textContent = data.temperature.humidity;
    windElement.textContent = data.wind.speed;
    tempValueElement.textContent = Math.round(data.temperature.current);

    // Weather icon
    tempIconElement.innerHTML = `<img src="${data.condition.icon_url}" alt="${data.condition.description}">`;
  } catch (error) {
    console.error("Error fetching weather:", error);
  }
}

// Listen for input → fetch suggestions from netlify function
searchInput.addEventListener("input", async function () {
  console.log("Typing detected:", searchInput.value);
  const query = searchInput.value.trim();

  if (query.length < 2) {
    suggestionsList.innerHTML = "";
    return;
  }

  try {
    const response = await fetch(`/.netlify/functions/geocode?q=${query}`);

    if (!response.ok) throw new Error("Failed to fetch suggestions");

    const data = await response.json();

    suggestionsList.innerHTML = "";

    if (data.length === 0) {
      const li = document.createElement("li");
      li.textContent =
        "No suggestions available. Type full city name and press Search.";
      li.style.fontStyle = "italic";
      li.style.cursor = "default";
      suggestionsList.appendChild(li);
      return;
    }

    data.forEach((place) => {
      const li = document.createElement("li");
      li.textContent = `${place.name}${
        place.state ? ", " + place.state : ""
      }, ${place.country}`;

    
      li.addEventListener("click", () => {
        searchInput.value = li.textContent; z
        suggestionsList.innerHTML = ""; 
        fetchWeather(li.textContent);
      });

      suggestionsList.appendChild(li);
    });
  } catch (error) {
    console.error("Error fetching suggestions:", error);
  }
});

// Close suggestions if clicking outside
document.addEventListener("click", (e) => {
  if (!searchContainer.contains(e.target)) {
    suggestionsList.innerHTML = "";
  }
});

// Helper to fetch weather by lat/lon
function updatePlaceByCoords(lat, lon) {
  let apiKey = "b33a0e7a6oc54ed07cdc24f8fb5ft43a";
  let apiUrl = `https://api.shecodes.io/weather/v1/current?lon=${lon}&lat=${lat}&key=${apiKey}&units=metric`;

  axios
    .get(apiUrl)
    .then(showCurrentForecast)
    .catch((error) => console.error("Error fetching weather:", error));
}

// Fetch current weather by coordinates from geolocation
function fetchWeatherByCoords(position) {
  try {
    const latitude = position.coords.latitude;
    const longitude = position.coords.longitude;
    const apiKey = "b33a0e7a6oc54ed07cdc24f8fb5ft43a";
    const apiUrl = `https://api.shecodes.io/weather/v1/current?lon=${longitude}&lat=${latitude}&key=${apiKey}&units=metric`;

    axios
      .get(apiUrl)
      .then(showCurrentForecast)
      .catch((error) => {
        console.error("Error fetching weather by location:", error);
      });
  } catch (error) {
    console.error("Unexpected error:", error);
    alert("Something went wrong while fetching weather.");
  }
}

// Handle geolocation error
function handleGeoError(error) {
  console.warn("Geolocation error:", error.message);
  updatePlaceWithDefault("Johannesburg");
}

// Fetch weather for default city
function updatePlaceWithDefault(defaultCity) {
  try {
    let apiKey = "b33a0e7a6oc54ed07cdc24f8fb5ft43a";
    let apiUrl = `https://api.shecodes.io/weather/v1/current?query=${defaultCity}&key=${apiKey}&units=metric`;

    axios.get(apiUrl).then(showCurrentForecast);
  } catch (error) {
    console.error("Unexpected error:", error);
    alert("Something went wrong while fetching default city weather.");
  }
}

// Handle city search
function updatePlace(event) {
  event.preventDefault();

  let city = `${newPlace.value.trim()}`;
  let errorMessage = document.querySelector("#errorMessage");
  errorMessage.textContent = "";

  if (!city) {
    errorMessage.textContent = "Please enter a city name.";
    return;
  }

  if (!/^[a-zA-Z\s]+$/.test(city)) {
    errorMessage.textContent =
      "Invalid city name. Only letters and spaces allowed.";
    return;
  }

  //Call API with city name
  try {
    let apiKey = "b33a0e7a6oc54ed07cdc24f8fb5ft43a";
    let apiUrl = `https://api.shecodes.io/weather/v1/current?query=${city}&key=${apiKey}&units=metric`;

    axios
      .get(apiUrl)
      .then(showCurrentForecast)
      .catch(() => {
        errorMessage.textContent =
          "City not found. Please check your spelling.";
      });
  } catch (error) {
    console.error("Unexpected error:", error);
    errorMessage.textContent = "Something went wrong. Please try again.";
  }
}

// Update current day and time on page
function updateDateTime() {
  let now = new Date();

  let days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  let day = days[now.getDay()];

  let hours = now.getHours();
  let minutes = now.getMinutes();

  let formattedHours;
  let formattedMinutes;

  if (hours < 10) {
    formattedHours = `0${hours}`;
  } else {
    formattedHours = hours;
  }

  if (minutes < 10) {
    formattedMinutes = `0${minutes}`;
  } else {
    formattedMinutes = minutes;
  }

  let time = `${formattedHours}:${formattedMinutes}`;

  let weatherDay = document.querySelector("#Day");
  weatherDay.innerHTML = day;

  let weatherTime = document.querySelector("#Time");
  weatherTime.innerHTML = time;
}

updateDateTime();

// Display current weather info on page
function showCurrentForecast(response) {
  let temp = Math.round(response.data.temperature.current);
  let currentHumidity = Math.round(response.data.temperature.humidity);
  let currentWindSpeed = response.data.wind.speed;
  let currentCondition = response.data.condition.description;

  let cityElement = document.querySelector("#city");
  let weatherTempValue = document.querySelector("#tempValue");
  let humidity = document.querySelector("#humidityValue");
  let wind = document.querySelector("#windValue");
  let conditionDescription = document.querySelector("#condition");
  let iconElement = document.querySelector("#tempIcon");

  cityElement.innerHTML = `${response.data.city}, ${response.data.country}`;
  weatherTempValue.innerHTML = `${temp}`;
  humidity.innerHTML = `${currentHumidity}`;
  wind.innerHTML = `${currentWindSpeed}`;
  conditionDescription.innerHTML = `${currentCondition}`;
  iconElement.innerHTML = `<img src="${response.data.condition.icon_url}" class="weather-app-icon" />`;

  // Fetch 7-day forecast for the city
  getWeeklyForecast(response.data.city);
}

// Fetch weekly forecast by city
function getWeeklyForecast(city) {
  let apiKey = "b33a0e7a6oc54ed07cdc24f8fb5ft43a";
  let apiUrl = `https://api.shecodes.io/weather/v1/forecast?query=${city}&key=${apiKey}&units=metric`;

  axios(apiUrl).then(displayWeeklyForecast);
}

// Format day name for weekly forecast
function formatWeeklyDay(timestamp) {
  let date = new Date(timestamp * 1000);
  let days = ["Sun", "Mon", "Tue", "Wed", "Thur", "Fri", "Sat"];

  return days[date.getDay()];
}

// Display weekly forecast on page
function displayWeeklyForecast(response) {
  console.log(response.data);

  let forecastHtml = "";

  response.data.daily.forEach(function (day, index) {
    if (index < 6 && index > 0) {
      forecastHtml =
        forecastHtml +
        `
        <div class="weekly-forecast-day">
          <div class="weekly-forecast-date">${formatWeeklyDay(day.time)}</div>
          <div><img src="${
            day.condition.icon_url
          }" class="weekly-forecast-icon" /></div>
          <div class="weekly-forecast-temperatures">
            <div class="weekly-max-temperature">
              <strong>${Math.round(day.temperature.maximum)}°</strong>
            </div>
            <div class="weather-min-temperature">${Math.round(
              day.temperature.minimum
            )}°</div>
          </div>
        </div>
      `;
    }
  });

  let forecastElement = document.querySelector("#weekly-forecast");
  forecastElement.innerHTML = forecastHtml;
}

displayWeeklyForecast();
