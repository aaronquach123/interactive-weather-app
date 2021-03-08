var cityWeatherData = [];
var cityChoice = "";
var currentDate = "";
var currentCityDailyInfoEl = $("#city-current-info");
var currentCityFiveDayInfoEl = $("#city-five-day");
var cityHistoryEl = $("#city-history");
var historyButtonsEl = $("#city-button")
var savedCities = JSON.parse(localStorage.getItem("savedCities"));

$("#city-submit").on("click", function() {
    event.preventDefault();

    cityChoice = $("#city-input")
        .val();

    if (cityChoice) {

        if (savedCities === null) {
            savedCities = [
                cityChoice,
            ]
            localStorage.setItem("savedCities", JSON.stringify(savedCities));
            generateSavedCities();
            
        } else  {
            savedCities.push(cityChoice)
            localStorage.setItem("savedCities", JSON.stringify(savedCities));
            generateSavedCities();
        }
    } else {
        alert("Please enter a city first.")
    }
    getCityCoords(cityChoice);
});

var generateSavedCities = function() {
    if (cityHistoryEl.text().trim() === "") {
        for (i = 0; i < savedCities.length; i++) {
            var buttonholderEl = $("<div>")
                .addClass("button-div");
            $("<button>")
                .addClass("btn")
                .attr("city-button", savedCities[i])
                .text(savedCities[i])
                .appendTo(buttonholderEl);
            buttonholderEl.appendTo(cityHistoryEl);
        };
    } else {
        var buttonholderEl = $("<div>")
            .addClass("button-div");
        $("<button>")
            .addClass("btn")
            .attr("city-button", savedCities)
            .text[cityChoice]
            .appendTo(cityHistoryEl);
        buttonholderEl.appendTo(cityHistoryEl);
    }

};

$("#city-history").on("click", function(event) {
    cityChoice = event.target.getAttribute("city-button");
    console.log(cityChoice)
    if (cityChoice) {
        getCityCoords(cityChoice);
    }
});

var getCityCoords = async function(cityChoice) {
    var apiUrl = "https://api.openweathermap.org/geo/1.0/direct?q=" + cityChoice + "&limit=1&appid=6de4763b9cb4cbf4f37cd99408665e12"
    console.log(apiUrl)
    fetch(apiUrl).then(function(response) {
        if (response.ok) {
            response.json().then(function(data) {
                var cityLat = data[0].lat;
                var cityLon = data[0].lon;
                generateCityData(cityLat, cityLon)
            });
        } else {
            alert(response)
        }
    });
};

var generateCityData = async function(cityLat, cityLon) {
    var apiUrl = "https://api.openweathermap.org/data/2.5/onecall?lat=" + cityLat + "&lon=" + cityLon + "&exclude=hourly,minutely,alerts&units=imperial&appid=6de4763b9cb4cbf4f37cd99408665e12"
    console.log(apiUrl)
    await fetch(apiUrl).then(function(response) {
        if (response.ok) {
            response.json().then(function(data) {
                cityWeatherData = [];
                cityWeatherData.push(data.current)
                for (var i = 0; i < 5; i++) {
                    cityWeatherData.push(data.daily[i])
                }
               displayDailyWeather();
            });
        }
    });
};

var displayDailyWeather = function() {
    var currentTemp = cityWeatherData[0].temp;
    var currentHumidity = cityWeatherData[0].humidity;
    var currentWindSpeed = cityWeatherData[0].wind_speed;
    var currentUv = cityWeatherData[0].uvi;
    currentDate = moment.unix(cityWeatherData[0].dt).format("MM/DD/YYYY");
    
    currentCityDailyInfoEl.html("");
    
    var currentTitleEl = $("<div>")
        .addClass("d-flex flex-row");

    var currentDateEl = $("<h3>")
        .addClass("current-date")
        .text(cityChoice + " (" + currentDate + ")")
        .appendTo(currentTitleEl);

    var currentIconEl = $("<img>")
        .attr("src", "http://openweathermap.org/img/wn/" + cityWeatherData[0].weather[0].icon + ".png")
        .attr("alt", cityWeatherData[0].weather[0].description)
        .appendTo(currentTitleEl);

    currentTitleEl.appendTo(currentCityDailyInfoEl);
 
    var dailyListEl = $("<ul>")
    .addClass("list")
    .attr("id", "daily-weather-list")

    var currentTempEl = $("<li>")
        .addClass("daily-temp")
        .text("Temperature: " + currentTemp + " °F")
        .appendTo(dailyListEl);
    
    var currentHumidityEl = $("<li>")
        .addClass("daily-humidity")
        .text("Humidity: " + currentHumidity + " %")
        .appendTo(dailyListEl);

    var currentWindSpeedEl = $("<li>")
        .addClass("daily-wind-speed")
        .text("Wind Speed: " + currentWindSpeed + " MPH")
        .appendTo(dailyListEl);
    
    var currentUvEl = $("<li>")
        .addClass("daily-wind-speed")
        .text("UV Index: " + currentUv)
        .appendTo(dailyListEl);

    dailyListEl.appendTo(currentCityDailyInfoEl)
};

var displayFiveDayForecast = function() {
    currentCityFiveDayInfoEl.html("");
    console.log(cityWeatherData)
    for (var i = 1; i < 5; i++) {
        var fiveDayDataEl = $("<div>")
            .addClass()
            .attr("id", [i]);
        $("<h4>")
            .text(currentDate)
            .appendTo(fiveDayDataEl);
        $("<img>")
            .addClass("d-block")
            .attr("src","http://openweathermap.org/img/wn/" + cityWeatherData[i].weather[0].icon + ".png")
            .attr("alt", cityWeatherData[i].weather[0].description)
            .appendTo(fiveDayDataEl);

        var fiveDayUl = $("<ul>")
        
        $("<li>")
            .text("Temp: " + cityWeatherData[i].temp.day + " °F")
            .appendTo(fiveDayUl);
        
        $("<li>")
            .text("Humidity: " + cityWeatherData[i].humidity + "%")
            .appendTo(fiveDayUl);

        fiveDayDataEl.appendTo(currentCityDailyInfoEl);   
        fiveDayUl.appendTo(fiveDayDataEl); 
    }
};

