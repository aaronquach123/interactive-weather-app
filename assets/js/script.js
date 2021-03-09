var cityWeatherData = [];
var cityChoice = "";
var currentDate = "";
var currentCityDailyInfoEl = $("#city-current-info");
var currentCityFiveDayInfoEl = $("#city-five-day");
var cityHistoryEl = $("#city-history");
var historyButtonsEl = $("#city-button")
var savedCities = JSON.parse(localStorage.getItem("savedCities"));


//On initialization load all saved cities if none return
var pageInit = function() {
    if (savedCities) {
        
        //loops through saved cities and writes them to buttons
        for (i = 0; i < savedCities.length; i++) {
            var buttonholderEl = $("<div>")
                .addClass("button-div");
            $("<button>")
                .addClass("btn btn-light border m-0 col-12 text-left text-capitalize")
                .attr("city-button", savedCities[i])
                .text(savedCities[i])
                .appendTo(buttonholderEl);
            buttonholderEl.appendTo(cityHistoryEl);
        };
    } else {
        return;
    };
};


//On click of submit button prevent check localstorage if empty set local storage, if full add to localstorage
$("#city-submit").on("click", function(event) {
    event.preventDefault();
    //returns value of input
    cityChoice = $("#city-input")
        .val();
    //checks if any value was submitted
    if (cityChoice) {
        //checks localstorage to see if null
        if (savedCities === null) {
            savedCities = [
                cityChoice,
            ]
            //sets localstorage as array of cities using city choice then calls generate saved cities function
            localStorage.setItem("savedCities", JSON.stringify(savedCities));
            generateSavedCities(cityChoice);
        } else  {
            //if cities already saved push new city and save to storage then calls generate savedcities function
            savedCities.push(cityChoice)
            localStorage.setItem("savedCities", JSON.stringify(savedCities));
            generateSavedCities(cityChoice);
        };
        //Runs api fetch with city choice
        getCityCoords(cityChoice);
    } else {
            alert("Please enter a city first.")
    };
    
});

//generates new button with saved city
var generateSavedCities = function() {
        var buttonholderEl = $("<div>")
            .addClass("button-div");
        $("<button>")
            .addClass("btn btn-light border m-0 col-12 text-left text-capitalize")
            .attr("city-button", cityChoice)
            .text(cityChoice)
            .appendTo(cityHistoryEl);
        buttonholderEl.appendTo(cityHistoryEl);
};

//On click of any history button generate weather report for it
$("#city-history").on("click", function(event) {
    cityChoice = event.target.getAttribute("city-button");
    if (cityChoice) {
        getCityCoords(cityChoice);
    }
});

//fetches lat and longitude of city and sends it to data fetcher
var getCityCoords = async function(cityChoice) {
    var apiUrl = "https://api.openweathermap.org/geo/1.0/direct?q=" + cityChoice + "&limit=1&appid=6de4763b9cb4cbf4f37cd99408665e12"
    console.log(apiUrl)
    await fetch(apiUrl).then(function(response) {
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


//used lat and lon to fetch weather data for current and five day forecast
var generateCityData = async function(cityLat, cityLon) {
    var apiUrl = "https://api.openweathermap.org/data/2.5/onecall?lat=" + cityLat + "&lon=" + cityLon + "&exclude=hourly,minutely,alerts&units=imperial&appid=6de4763b9cb4cbf4f37cd99408665e12"
    console.log(apiUrl)
    await fetch(apiUrl).then(function(response) {
        if (response.ok) {
            response.json().then(function(data) {
                //cleares data and pushes data into array
                cityWeatherData = [];
                cityWeatherData.push(data.current)
                for (var i = 1; i < 6; i++) {
                    cityWeatherData.push(data.daily[i])
                };
                //Run functions to create divs text for all data
                displayDailyWeather();
                displayFiveDayForecast();
            });
        }
    });
};

//Displays daily weather using api data
var displayDailyWeather = function() {
    var currentTemp = cityWeatherData[0].temp;
    var currentHumidity = cityWeatherData[0].humidity;
    var currentWindSpeed = cityWeatherData[0].wind_speed;
    var currentUv = cityWeatherData[0].uvi;
    currentDate = moment.unix(cityWeatherData[0].dt).format("MM/DD/YYYY");
    
    currentCityDailyInfoEl
    .html("")
    .addClass("border mt-2 rounded p-3");

    var currentTitleEl = $("<div>")
        .addClass("d-flex flex-row");

    var currentDateEl = $("<h3>")
        .addClass("text-capitalize")
        .text(cityChoice + " (" + currentDate + ")")
        .appendTo(currentTitleEl);

    var currentIconEl = $("<img>")
        .attr("src", "http://openweathermap.org/img/wn/" + cityWeatherData[0].weather[0].icon + ".png")
        .attr("alt", cityWeatherData[0].weather[0].description)
        .appendTo(currentTitleEl);

    currentTitleEl.appendTo(currentCityDailyInfoEl);
 
    var dailyListEl = $("<ul>")
    .addClass("list-group")
    .attr("id", "daily-weather-list ")

    var currentTempEl = $("<li>")
        .addClass("list-group-item border-0")
        .text("Temperature: " + currentTemp + " °F")
        .appendTo(dailyListEl);
    
    var currentHumidityEl = $("<li>")
        .addClass("list-group-item border-0")
        .text("Humidity: " + currentHumidity + " %")
        .appendTo(dailyListEl);

    var currentWindSpeedEl = $("<li>")
        .addClass("list-group-item border-0")
        .text("Wind Speed: " + currentWindSpeed + " MPH")
        .appendTo(dailyListEl);
    
    var currentUvEl = $("<li>")
        .addClass("list-group-item border-0")
        .text("UV Index: ");
    var currentUvDivEl = $("<div>")
        .addClass("current-uv-div d-inline")
        .text(currentUv)
        .appendTo(currentUvEl);
    //Checks if currentUv is less than or greater than given numbers and changes color to match
    if (currentUv < 3) {
        currentUvDivEl.addClass("bg-success text-light");
    } else if (currentUv > 2 && currentUv < 6) {
        currentUvDivEl.addClass("bg-warning text-light");
    } else if (currentUv > 6) {
        currentUvDivEl.addClass("bg-danger text-light");
    };
    currentUvEl.appendTo(dailyListEl);

    dailyListEl.appendTo(currentCityDailyInfoEl);

};

//Displays five day forecast data
var displayFiveDayForecast = function() {
    currentCityFiveDayInfoEl.html("");
    console.log(cityWeatherData)
    for (var i = 1; i < 6; i++) {
        currentDate = moment.unix(cityWeatherData[i].dt).format("MM/DD/YYYY");
        var fiveDayDataEl = $("<div>")
            .addClass("container-five-day bg-primary border rounded p-4 text-left")
            .attr("id", [i]);
        $("<h4>")
            .addClass("text-light")
            .text(currentDate)
            .appendTo(fiveDayDataEl);
        $("<img>")
            .addClass("d-block")
            .attr("src","http://openweathermap.org/img/wn/" + cityWeatherData[i].weather[0].icon + ".png")
            .attr("alt", cityWeatherData[i].weather[0].description)
            .appendTo(fiveDayDataEl);

        var fiveDayUl = $("<ul>")
            .addClass("list-group");
        
        $("<li>")
            .text("Temp: " + cityWeatherData[i].temp.day + " °F")
            .addClass("list-group-item bg-primary border-0 text-light p-0 mb-4")
            .appendTo(fiveDayUl);
        
        $("<li>")
            .text("Humidity: " + cityWeatherData[i].humidity + "%")
            .addClass("list-group-item bg-primary border-0 text-light p-0 mb-4")
            .appendTo(fiveDayUl);

        fiveDayDataEl.appendTo(currentCityFiveDayInfoEl);   
        fiveDayUl.appendTo(fiveDayDataEl); 
    }
};



pageInit();