let formDetails = document.querySelector("#weather-form");
formDetails.addEventListener("submit", updatePlace);

//Update search engine
let newPlace = document.querySelector("#searched-place");
function updatePlace(event) {
  event.preventDefault();

  //Get current forecast
  let city = `${newPlace.value}`;
  let apiKey = "b33a0e7a6oc54ed07cdc24f8fb5ft43a";
  let apiUrl = `https://api.shecodes.io/weather/v1/current?query=${city}&key=${apiKey}&units=metric`;

  axios.get(apiUrl).then(showCurrentForecast);
}

//Update date and time
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

function showCurrentForecast(response) {
  let temp = Math.round(response.data.temperature.current);
  let currentHumidity = Math.round(response.data.temperature.humidity);
  let currentWindSpeed = response.data.wind.speed;
  let currentCondition = response.data.condition.description;
  let date = new Date(response.data.time * 1000);

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

  getWeeklyForecast(response.data.city);
}

function getWeeklyForecast(city) {
  let apiKey = "b33a0e7a6oc54ed07cdc24f8fb5ft43a";
  let apiUrl = `https://api.shecodes.io/weather/v1/forecast?query=${city}&key=${apiKey}&units=metric`;

  axios(apiUrl).then(displayWeeklyForecast);
}

function formatWeeklyDay (timestamp) {
  let date = new Date (timestamp * 1000);
  let days = ["Sun", "Mon", "Tue", "Wed", "Thur", "Fri", "Sat"];

  return days[date.getDay()];
}

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
          <div><img src="${day.condition.icon_url
          }" class="weekly-forecast-icon" /></div>
          <div class="weekly-forecast-temperatures">
            <div class="weekly-max-temperature">
              <strong>${Math.round(day.temperature.maximum)}º</strong>
            </div>
            <div class="weather-min-temperature">${Math.round(
              day.temperature.minimum
            )}º</div>
          </div>
        </div>
      `;
    }
  });

  let forecastElement = document.querySelector("#weekly-forecast");
  forecastElement.innerHTML = forecastHtml;
}

displayWeeklyForecast();
