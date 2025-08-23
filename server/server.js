let express = require("express");
let fetch = require("node-fetch");
let app = express();
let PORT = 3000;
let dotenv = require("dotenv");

dotenv.config();

let API_KEY = process.env.OPENWEATHER_API_KEY;

// Allow frontend requests (CORS)
app.use(function(req, res, next){
  res.header("Access-Control-Allow-Origin", "*");
  next();
});

// Route: geocoding lookup
app.get("/geocode", function (req, res) {
  let query = req.query.q;

  fetch(
    `https://api.openweathermap.org/geo/1.0/direct?q=${query}&limit=5&appid=${API_KEY}`
  )
    .then(function (response) {
      if (!response.ok) {
        throw new Error("OpenWeather request failed");
      }
      return response.json();
    })
    .then(function (data) {
      res.json(data);
    })
    .catch(function (error) {
      console.error("Error fetching geocoding data:", error);
      res.status(500).json({ error: "Failed to fetch geocoding data" });
    });
});

app.listen(PORT, function (){
  console.log(`Server running on http://localhost:${PORT}`);
});
