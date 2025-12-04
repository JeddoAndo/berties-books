// routes/weather.js
const express = require("express");
const router = express.Router();
const request = require("request");

// GET /weather
router.get('/result', function(req, res, next) {

    let apiKey = process.env.WEATHER_API_KEY; // <--- Safer than hardcoding
    let city = req.sanitize(req.query.city); // Get city from GET parameters, with sanitisation
    let url = `http://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`

    request(url, function (err, response, body) {
        if(err){
            return res.send("Error contacting weather service.");
        } else {

            // Safely parse JSON
            try {
                weather = JSON.parse(body);
            } catch (e) {
                return res.send("Weather data is not valid JSON.");
            }

            // Check valid weather structure
            if (!weather || !weather.main) {
                return res.send("No data found.");
            }

            // Check for API error (e.g., city not found)
            if (weather.cod === "404") {
                return res.send(`City "${city}" not found.`);
            }

            // Render the EJS template and pass the weather data
            res.render("weather_result.ejs", {weather: weather });
        }
    });
});

router.get('/form', function(req, res, next) {
    res.render('weather.ejs');
});

module.exports = router;