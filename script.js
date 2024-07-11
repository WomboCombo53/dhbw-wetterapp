class WeatherData
{
    temp;
    rainPossibility;
    forecast;
    timeOfReport;

    WeatherData(temp, rain, forecast, timeOfReport)
    {
        this.temp = temp;
        this.rainPossibility = rain;
        this.forecast = forecast;
        this.timeOfReport = timeOfReport;
    }
    WeatherData(temp, rain, forecast)
    {
        WeatherData(temp, rain, forecast, new Date(Date.now()))
    }
    WeatherData(){}

    getFahrenheit()
    {
        return temp * 0.56;
    }
}
function ConvertDWDResponseToObject(json)
{
    try
    {
        const forecast = json["forecast1"]
        const temp = forecast["temperature"]["18"] / 10 // temp value is multiplied by 10
        const rainPossibility = forecast["rain"]["18"]

        let data = new WeatherData()
        data.temp = temp;
        data.forecast = forecast;
        data.rainPossibility = rainPossibility;

        return data;
    }
    catch //index not found ex
    {
        return null;
    }
}

let openBtn;
let closeBtnschliessen;
let modal;

const userStorageName = "user"
const cityStorageName = "city"
const weatherStorage = "weather"
const favoriteStorage = "favs"
const cityActivityStorage = "cAct"
const userActivityStorage = "uAct"

const defaultWeather = {"temp": 35, "desc": "Sonnig", "rain": 55};

// Daten
let users = [
    {"username": "user", "password": "user", "isAdmin": false, "useFahrenheit": true},
    {"username": "admin", "password": "admin", "isAdmin": true, "useFahrenheit": false}
]

let cities = [
    {"cityname": "Bonn", "apiKey": "10517", "weather": new WeatherData(17, "Sonnig", 12)},
    {"cityname": "Stuttgart", "apiKey": "Q358", "weather": new WeatherData(31, "Bewölkt", 78)}
]
function getWeatherForCity(cityname)
{
    for (let i = 0; i < cities.length; i++)
    {
        if (cities[i]["cityname"] === cityname)
            return cities[i]["weather"];
    }
}

let weatherReports = [
    {"user": "user", "report": new WeatherData(12, 33, "Sonnig")}
]

let favouriteCities = [
    {"user": "user", "city": "Bonn"}
]

let cityActivity = [
    {"city": "Bonn", "showCount": 187}
]

let userActivity = [
    {"user": "user", "report": weatherReports[0]}
]

// Angemeldeter User
let currentUserIndex = 0;

function LoadStorageData()
{
    let storedUsers = localStorage.getItem(userStorageName)
    let storedCities = localStorage.getItem(cityStorageName)
    let storedWeather = localStorage.getItem(weatherStorage)
    let storedFavs = localStorage.getItem(favoriteStorage)
    let storedCAct = localStorage.getItem(cityActivityStorage)
    let storedUAct = localStorage.getItem(userActivityStorage)

    if (storedUsers != null)
        users = JSON.parse(storedUsers)

    if (storedCities != null)
        cities = JSON.parse(storedCities)

    if (storedWeather != null)
        weatherReports = JSON.parse(storedWeather)

    if (storedFavs != null)
        favouriteCities = JSON.parse(storedFavs)

    if (storedCAct != null)
        cityActivity = JSON.parse(storedCAct)

    if (storedUAct != null)
        userActivity = JSON.parse(storedUAct)
}

function SaveStorageData()
{
    localStorage.setItem(userStorageName, JSON.stringify(users))
    localStorage.setItem(cityStorageName, JSON.stringify(cities))
    localStorage.setItem(weatherStorage, JSON.stringify(weatherReports))
    localStorage.setItem(favoriteStorage, JSON.stringify(favouriteCities))
    localStorage.setItem(cityActivityStorage, JSON.stringify(cityActivity))
    localStorage.setItem(userActivityStorage, JSON.stringify(userActivity))
}

function ShowAdminInterface(visible)
{
    const adminObjs = document.getElementsByClassName("admin");

    for (let i = 0; i < adminObjs.length; i++)
    {
        let item = adminObjs.item(i);
        item.style.visibility = visible ? "visible" : "hidden";
    }
}

function SetInnerHTML(DOMobj, text)
{
    DOMobj.innerHTML = text;
}

function EventFahrenheitValueChanged()
{
    const value = document.getElementById("fahrenheit").checked;
    users[currentUserIndex].useFahrenheit = value;
    SaveStorageData();
}

// von: https://stackoverflow.com/questions/831030/how-to-get-get-request-parameters-in-javascript
function getParam(name)
{
    if(name=(new RegExp('[?&]'+encodeURIComponent(name)+'=([^&]*)')).exec(location.search))
       return decodeURIComponent(name[1]);
}

// API-Call
function GetDWDWeatherData(station)
{
    // Aufgrund von Cross-Origin-Request Beschränkungen funktioniert dieser API-Call nicht!
    let request = new XMLHttpRequest();
    const url = "https://dwd.api.proxy.bund.dev/v30/stationOverviewExtended?stationIds=" + station;
    request.open("GET", url);
    request.send(null);

    return request.responseText;
}

function SetPopupListeners()
{
    openBtn = document.getElementById("popupoeffnen")
    closeBtnschliessen = document.getElementById("popupschliessen")
    modal = document.getElementById("popup")

    openBtn.addEventListener("click", () => 
        {
            modal.classList.add("open");
        });
        
    closeBtnschliessen.addEventListener("click", () =>
        {
            modal.classList.remove("open");
        });
}

function SetCityName(cityname)
{
    const citynameObj = document.getElementById("Stadtname");
    SetInnerHTML(citynameObj, cityname);
}
function SetTemperature(temp)
{
    const tempObj = document.getElementById("Stadttemp");
    SetInnerHTML(tempObj, temp);
}
function SetRain(rain)
{
    const rainObj = document.getElementById("Regenwahrsch");
    SetInnerHTML(rainObj, rain);
}
function SetFahrenheitCheckbox(fahrenheit)
{
    const fObj = document.getElementById("fahrenheit");
    fObj.checked = fahrenheit;
}

function SetUser(username)
{
    for (let i = 0; i < users.length; i++)
    {
        if (username === users[i]["username"])
        {
            currentUserIndex = i;
            ShowAdminInterface(users[i].isAdmin);
            SetFahrenheitCheckbox(users[i].useFahrenheit);
            return;
        }
    }

    alert("Der Benutzer wurde nicht gefunden!");
}

function FillData()
{
    const cityname = getParam(cityStorageName);
    const weather = getWeatherForCity(cityname);

    if (weather == undefined)
    {
        throw "Die Stadt wurde nicht gefunden";
    }
    else
    {
        SetCityName(cityname);
    
        SetTemperature(users[currentUserIndex].useFahrenheit ? weather.getFahrenheit() : weather.temp);
        SetRain(weather.rainPossibility);
    }
}

function ScriptOnDocLoad()
{
    SetPopupListeners();
    LoadStorageData();
    
    const currentUser = getParam(userStorageName);
    SetUser(currentUser);

    // Bei diesem API-Call entsteht aufgrund der CORS-Regelung ein nicht behebbarer Fehler!
    // Daher werden ersatzweise Standardwerte für das Wetter verwendet.
    let weather = ConvertDWDResponseToObject(GetDWDWeatherData(cities[0]["apiKey"]))

    console.log("PARAMS: " + location.search); // DEBUG
    
    try
    {
        FillData();
    }
    catch
    {
        // HTML Elemente nicht gefunden
    }
}
window.onload = ScriptOnDocLoad;