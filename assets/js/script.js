const API_KEY = "13a0ac05fae874cf29354a89a188f1b9";
const cityInput = document.getElementById("cityInput");
const searchButton = document.getElementById("searchButton");

searchButton.addEventListener("click", function () {
  const cityName = cityInput.value;

  if (cityName === "") {
    alert("Please enter a city name.");
    return;
  }

  cityInput.addEventListener("keypress", function (event) {
    if (event.key === "Enter") {
      searchButton.click();
    }
  });

  getWeatherData(cityName);
  getForecastData(cityName);
});

function getWeatherData(city) {
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`;

  fetch(url)
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
      displayWeatherData(data);
    })
    .catch((error) => {
      alert("Error fetching weather data. Please try again later.");
      console.error("Error:", error);
    });
}

function displayWeatherData(data) {
  document.querySelector(
    ".city-name"
  ).textContent = `${data.name}, ${data.sys.country}`;

  document.querySelector(".todays-date").textContent = getCurrentDate();

  document.querySelector(".temperature").textContent = `${Math.round(
    data.main.temp
  )}°`;

  document.querySelector(".weather-condition").textContent =
    data.weather[0].main;

  const recommendation = getWeatherRecommendation(
    data.main.temp,
    data.weather[0].main,
    data.main.humidity
  );
  document.querySelector(".weather-recommendation").textContent =
    recommendation;

  document.querySelectorAll(
    ".weather-details h3"
  )[0].textContent = `${Math.round(data.main.feels_like)}°`;

  document.querySelectorAll(
    ".weather-details h3"
  )[1].textContent = `${data.main.humidity}%`;

  document.querySelectorAll(
    ".weather-details h3"
  )[2].textContent = `${Math.round(data.wind.speed)} mph`;

  document.querySelectorAll(
    ".weather-details h3"
  )[3].textContent = `${data.main.pressure}"`;

  const weatherIcon = getWeatherIcon(data.weather[0].main);
  document.querySelector(".weather-icon").textContent = weatherIcon;
}

function getWeatherIcon(condition) {
  const icons = {
    Clear: "☀️",
    Clouds: "☁️",
    Rain: "🌧️",
    Drizzle: "🌦️",
    Thunderstorm: "⛈️",
    Snow: "❄️",
    Mist: "🌫️",
    Fog: "🌫️",
    Haze: "🌫️",
  };

  return icons[condition] || "🌤️";
}

function getCurrentDate() {
  const today = new Date();

  const options = {
    weekday: "long",
    month: "long",
    day: "numeric",
  };

  return today.toLocaleDateString("en-US", options);
}

function getWeatherRecommendation(temp, condition, humidity) {
  if (temp >= 30) {
    return "It's very hot! Stay hydrated and avoid direct sunlight.";
  } else if (temp >= 25) {
    return "Perfect weather for outdoor activities!";
  } else if (temp >= 15) {
    return "Pleasant weather. Great for a walk!";
  } else if (temp >= 10) {
    return "A bit cool. Consider wearing a light jacket.";
  } else if (temp >= 0) {
    return "It's cold outside. Bundle up!";
  } else {
    return "Freezing temperatures! Stay warm indoors.";
  }

  if (condition === "Rain" || condition === "Drizzle") {
    return "Don't forget your umbrella! ☔";
  }

  if (condition === "Thunderstorm") {
    return "Stay indoors! Thunderstorm alert. ⛈️";
  }

  if (humidity > 80) {
    return "Very humid today. Stay cool and hydrated!";
  }
}

function getForecastData(city) {
  const url = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${API_KEY}&units=metric`;

  fetch(url)
    .then((response) => response.json())
    .then((data) => {
      console.log("Forecast data:", data);
      displayForecastData(data);
    })
    .catch((error) => {
      console.error("Forecast error:", error);
    });
}

function displayForecastData(data) {
  const dailyForecasts = data.list.filter((item) => {
    return item.dt_txt.includes("12:00:00");
  });

  const fiveDayForecast = dailyForecasts.slice(0, 5);

  console.log("5-day forecast:", fiveDayForecast);

  const forecastBoxes = document.querySelectorAll(".forecast-box");

  fiveDayForecast.forEach((day, index) => {
    if (forecastBoxes[index]) {
      const date = new Date(day.dt * 1000);
      const dayName = date.toLocaleDateString("en-US", { weekday: "short" });

      forecastBoxes[index].querySelector("h6").textContent = dayName;
      forecastBoxes[index].querySelector("div").textContent = getWeatherIcon(
        day.weather[0].main
      );
      forecastBoxes[index].querySelector("h5").textContent = `${Math.round(
        day.main.temp_max
      )}°`;
      forecastBoxes[index].querySelector("p").textContent = `${Math.round(
        day.main.temp_min
      )}°`;
    }
  });
}
