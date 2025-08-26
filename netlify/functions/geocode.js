const fetch = require("node-fetch");

exports.handler = async function (event, context) {
  try {
    const query = event.queryStringParameters.q;
    const API_KEY = process.env.OPENWEATHER_API_KEY;

    const response = await fetch(
      `https://api.openweathermap.org/geo/1.0/direct?q=${query}&limit=5&appid=${API_KEY}`
    );

    if (!response.ok) {
      throw new Error("OpenWeather request failed");
    }

    const data = await response.json();
    return {
      statusCode: 200,
      body: JSON.stringify(data),
    };
  } catch (error) {
    console.error("Error fetching geocoding data:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Failed to fetch geocoding data" }),
    };
  }
};
