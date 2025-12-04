// routes/weather.js
const express = require("express");
const router = express.Router();
const request = require("request");

// GET /weather
router.get('/', function(req, res, next) {

    let apiKey = "f529c39c328239f6f2f7bd76fb3c87cd"
    let city = "london";
    let url = `http://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`

    request(url, function (err, response, body) {
        if(err){
            next(err)
        } else {
            res.send(body)
        }
    });
});