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

//Update search engine
let newPlace = document.querySelector("#new-place");
function updatePlace(event) {
  event.preventDefault();

  let searchedPlace = document.querySelector("#city");
  searchedPlace.innerHTML = newPlace.value;

  //Get current forecast
  let city = `${newPlace.value}`;
  let apiKey = "b33a0e7a6oc54ed07cdc24f8fb5ft43a";
  let apiUrl = `https://api.shecodes.io/weather/v1/current?query=${city}&key=${apiKey}&units=metric`;

  axios.get(apiUrl).then(showCurrentForecast);
}

function showCurrentForecast(response) {
  let temp = Math.round(response.data.temperature.current);
  let currentHumidity = Math.round(response.data.temperature.humidity);
  let currentWindSpeed = response.data.wind.speed;
  let currentCondition = response.data.condition.description;

  let weatherTempValue = document.querySelector("#tempValue");
  let humidity = document.querySelector("#humidityValue");
  let wind = document.querySelector("#windValue");
  let conditionDescription = document.querySelector("#condition");
  let iconElement = document.querySelector("#tempIcon");

  weatherTempValue.innerHTML = `${temp}`;
  humidity.innerHTML = `${currentHumidity}`;
  wind.innerHTML = `${currentWindSpeed}`;
  conditionDescription.innerHTML = `${currentCondition}`;

  switch (currentCondition) {
    case "clear sky":
      iconElement.innerHTML = "☀️";
      break;
    case "few clouds":
      iconElement.innerHTML = "🌤️";
      break;
    case "scattered clouds":
      iconElement.innerHTML = "⛅";
      break;
    case "broken clouds":
      iconElement.innerHTML = "☁️";
      break;
    case "shower rain":
      iconElement.innerHTML = "🌦️";
      break;
    case "rain":
      iconElement.innerHTML = "🌧️";
      break;
    case "thunderstorm":
      iconElement.innerHTML = "⛈️";
      break;
    case "snow":
      iconElement.innerHTML = "❄️";
      break;
    case "mist":
      iconElement.innerHTML = "🌫️";
      break;
    default:
      iconElement.innerHTML = "❓";
  }
}

let formDetails = document.querySelector("#weather-form");
formDetails.addEventListener("submit", updatePlace);
