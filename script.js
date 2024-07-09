class WeatherData
{
    temp;

    
}
function ConvertDWDResponseToObject(json)
{
    try
    {
        const forecast = json["forecast1"]
        const temp = forecast["temperature"]["18"]
    
        let data = new WeatherData()
        data.temp = temp;

        return data;
    }
    catch //index not found ex
    {
        return null;
    }
}

const userStorage = "user"
const cityStorageName = "city"
const weatherStorage = "weather"
const favoriteStorage = "favs"
const cityActivityStorage = "cAct"
const userActivityStorage = "uAct"

let users = [
    {"username": "user", "password": "user", "isAdmin": false, "useCelsius": true},
    {"username": "admin", "password": "admin", "isAdmin": true, "useCelsius": false}
]

let cities = [
    {"cityname": "Bonn", "apiKey": "10517"},
    {"cityname": "Stuttgart", "apiKey": "Q358"}
]

let weatherReports = [
    {"temp": 22, "generalDescription": "Bewölkt", "rainPossibility": 87, "timeOfReport": new Date(12, 12, 2023)}
]

let favouriteCities = [
    {"user": "user", "city": "Bonn"}
]

let cityActivity = [
    {"city": "Bonn", "showCount": 187}
]

let userActivity = [
    {"user": "user", }
]

function LoadStorageData()
{
    let storedUsers = localStorage.getItem(userStorage)
    let storedCities = localStorage.getItem(cityStorageName)
    let storedWeather = localStorage.getItem(weatherStorage)
    let storedFavs = localStorage.getItem(favoriteStorage)
    let storedCAct = localStorage.getItem(cityActivityStorage)
    let storedUAct = localStorage.getITem(userActivityStorage)

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
    localStorage.setItem(userStorage, JSON.stringify(users))
    localStorage.setItem(cityStorageName, JSON.stringify(cities))
    localStorage.setItem(weatherStorage, JSON.stringify(weatherReports))
    localStorage.setItem(favoriteStorage, JSON.stringify(favouriteCities))
    localStorage.setItem(cityActivityStorage, JSON.stringify(cityActivity))
    localStorage.setItem(userActivityStorage, JSON.stringify(userActivity))
}

function SetInnerHTML(DOMobj, text)
{
    DOMobj.innerHTML = text;
}

// von: https://stackoverflow.com/questions/831030/how-to-get-get-request-parameters-in-javascript
function getParam(name){
    if(name=(new RegExp('[?&]'+encodeURIComponent(name)+'=([^&]*)')).exec(location.search))
       return decodeURIComponent(name[1]);
}

function GetDWDWeatherData(station)
{
    let request = new XMLHttpRequest();
    const url = "https://dwd.api.proxy.bund.dev/v30/stationOverviewExtended?stationIds=" + station;
    request.open("GET", url);
    request.send(null);

    return request.responseText;
}

function ScriptOnDocLoad()
{
    SetPopup()
    
    const citynameObj = document.getElementById("Stadtname");
    const tempObj = document.getElementById("Stadttemp");
    const cityname = getParam(cityStorageName);

    let weather = ConvertDWDResponseToObject(GetDWDWeatherData(cities[0]["apiKey"]))

    console.log("PARAMS: " + location.search);
    SetInnerHTML(citynameObj, cityname);
    SetInnerHTML(tempObj, weather.temp);
}

let openBtn;
let closeBtnschliessen;
let modal;

function SetPopup()
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

window.onload = ScriptOnDocLoad;