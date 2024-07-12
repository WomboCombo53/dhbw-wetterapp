class FavouriteCity
{
    cityname;
    username;

    constructor(cityname, username)
    {
        this.cityname = cityname;
        this.username = username;
    }
}
class CityDisplayEntry
{
    index;
    cityname;

    constructor(index, cityname)
    {
        this.index = index;
        this.cityname = cityname;
    }
}
class WeatherData
{
    temp;
    rainPossibility;
    forecast;
    timeOfReport;

    constructor(temp, rain, forecast)
    {
        this.temp = temp;
        this.rainPossibility = rain;
        this.forecast = forecast;
        this.timeOfReport = new Date(Date.now());
    }

}
function getFahrenheitString(weather)
{
    return ((weather.temp * 1.8) + 32).toFixed(2) + " *F";
}
function getCelsiusString(weather){
    return weather.temp + " °C";
}
function ConvertDWDResponseToObject(json)
{
    try
    {
        const forecast = json["forecast1"]
        const temp = forecast["temperature"]["18"] / 10 // temp value is multiplied by 10
        const rainPossibility = forecast["rain"]["18"]

        let data = new WeatherData(temp, rainPossibility, forecast);
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

const defaultWeather = new WeatherData(25, 78, "Regen erwartet");

// Daten
let users = [
    {"username": "user", "password": "user", "isAdmin": false, "useFahrenheit": true},
    {"username": "admin", "password": "admin", "isAdmin": true, "useFahrenheit": false}
]
function usersGetFahrenheitPreference(index)
{
    return users[index].useFahrenheit;
}

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
function addCity(cityname)
{
    cities.push({"cityname": cityname, "apiKey": "5845D", "weather": defaultWeather});
    SaveStorageData();
}

let cityDisplay = [
    new CityDisplayEntry(0, "")
]
function getCitynameForIndex(index)
{
    for (let i = 0; i < cityDisplay.length; i++)
    {
        if (cityDisplay[i].index === index)
            return cityDisplay[i].cityname;
    }

    return "null";
}

let weatherReports = [
    {"user": "user", "report": new WeatherData(12, 33, "Sonnig")}
]

let favouriteCities = [
    new FavouriteCity("Bonn", "user"),
    new FavouriteCity("Stuttgart", "admin")
]
function toggleFavourite(cityname, user)
{
    let addToCollection = true;

    for (let i = 0; i < favouriteCities.length; i++)
    {
        if (favouriteCities[i].username === user)
        {
            // Remove favourite from array if its already in there
            if (favouriteCities[i].cityname === cityname)
            {
                favouriteCities.splice(i, 1);
                addToCollection = false;
            }
        }
    }

    // Add new favourite if its not in the array
    if (addToCollection)
    {
        favouriteCities.push(new FavouriteCity(cityname, user));
    }

    SaveStorageData();
    ResetCityOverview();
}

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

function SetClickListener(DOMobj, listener)
{
    DOMobj.addEventListener("click", listener, false);
}
function SetInnerHTML(DOMobj, text)
{
    DOMobj.innerHTML = text;
}
function GetDOMObject(DOMobjName)
{
    return document.getElementById(DOMobjName);
}
function GetInnerHTML(DOMobjName)
{
    return GetDOMObject(DOMobjName).innerHTML;
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

function ListenerNewCityClick()
{
    const newCity = GetDOMObject("neue_stadt").value;
    addCity(newCity);
    ResetCityOverview();
}
function ListenerFavoriteClick(evt)
{
    const cityname = getCitynameForIndex(evt.currentTarget.num);
    const username = users[currentUserIndex]["username"];
    toggleFavourite(cityname, username);
}
function ListenerCitynameClick(evt)
{
    const cityname = getCitynameForIndex(evt.currentTarget.num);
    const username = users[currentUserIndex]["username"];
    open("Stadt.html?user=" + username + "&city=" + cityname);
}

function AddCityOverview(num, cityname, tempString, isFavourite)
{
    // Es werden nur drei Favoriten angezeigt
    const table = GetDOMObject("cityOverviewTable");
    const template = GetInnerHTML("cityOverview1");
    const defaultNameStr = "Stadtname1";
    const defaultTempStr = "Stadttemp1";
    const defaultFavStr = "FavoritenSpeichern1"
    const nameStr = "Stadtname" + num;
    const tempStr = "Stadttemp" + num;
    const favStr = "FavoritenSpeichern" + num;

    const rowIndex = num - 2 < 0 ? 0 : num - 2;
    let row = table.insertRow(rowIndex);
    row.innerHTML = template;
    const nameObj = document.getElementById(defaultNameStr);
    const tempObj = document.getElementById(defaultTempStr);
    const favObj = document.getElementById(defaultFavStr);
    
    nameObj.id = nameStr;
    nameObj.style.fontSize = "xx-large"
    nameObj.num = num;

    tempObj.id = tempStr;
    
    favObj.id = favStr;
    favObj.num = num;
    favObj.innerHTML += isFavourite ? "fav" : ""
    
    SetClickListener(favObj, ListenerFavoriteClick);
    SetClickListener(nameObj, ListenerCitynameClick);
    SetInnerHTML(nameObj, cityname);
    SetInnerHTML(tempObj, tempString);
    
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

    //alert("Kein Benutzer angegeben!");
}

function FillWeatherReports()
{
    const usernameObj = GetDOMObject("username");
    const timeObj = GetDOMObject("uhrzeit_user");
    const tempObj = GetDOMObject("temp_user");
    const rainObj = GetDOMObject("regen_user");

    const report = weatherReports[0]["report"];
    SetInnerHTML(usernameObj, weatherReports[0]["user"]);
    SetInnerHTML(timeObj, report.timeOfReport.toDateString());
    SetInnerHTML(tempObj, usersGetFahrenheitPreference(currentUserIndex) ? getFahrenheitString(report) : getCelsiusString(report));
    SetInnerHTML(rainObj, report.rainPossibility + "% Regenwahrscheinlichkeit");
}
function ResetCityOverview()
{
    const rowName = "cityOverview1";
    const table = GetDOMObject("cityOverviewTable");
    const template = GetInnerHTML(rowName);

    table.innerHTML = "";
    let row = table.insertRow(0);
    row.innerHTML = template;
    row.style.visibility = "hidden";
    row.id = rowName;

    FillCityOverview();
}
function FillCityOverview()
{
    let addedCities = [];
    let currentOverviewIndex = 2;
    cityDisplay = []; // Clear display
    // Zuerst favorisierte Städte anzeigen
    for (let i = 0; i < favouriteCities.length; i++)
    {
        const currentFav = favouriteCities[i];
        if (currentFav.username === users[currentUserIndex]["username"]) // is favourite city of current user
        {
            const weather = getWeatherForCity(currentFav.cityname);
            const fahrenheit = usersGetFahrenheitPreference(currentUserIndex);
            let temp;
            if (fahrenheit)
                temp = getFahrenheitString(weather);
            else
                temp = getCelsiusString(weather);

            AddCityOverview(currentOverviewIndex, currentFav.cityname, temp, true);
            addedCities.push(currentFav.cityname);
            cityDisplay.push(new CityDisplayEntry(currentOverviewIndex, currentFav.cityname));

            currentOverviewIndex++;
        }
    }

    // Andere nicht favorisierte Städte hinzufügen
    for (let i = 0; i < cities.length; i++)
    {
        let notFav = true;
        let currentCity = cities[i];
        for (let i = 0; i < addedCities.length; i++)
        {
            if (currentCity["cityname"] === addedCities[i])
            {
                notFav = false;
                break;
            }
        }

        if (notFav)
        {
            const weather = currentCity["weather"];
            let temp = usersGetFahrenheitPreference(currentUserIndex);
            temp = temp ? getFahrenheitString(weather) : getCelsiusString(weather);

            AddCityOverview(currentOverviewIndex, currentCity["cityname"], temp, false);
            cityDisplay.push(new CityDisplayEntry(currentOverviewIndex, currentCity["cityname"]));

            currentOverviewIndex++;
        }
    }
}

function FillData()
{
    const cityname = getParam(cityStorageName);
    const weather = getWeatherForCity(cityname);

    if (weather != undefined)
    {
        SetCityName(cityname);
    
        SetTemperature(usersGetFahrenheitPreference(currentUserIndex) ? getFahrenheitString(weather) : getCelsiusString(weather));
        SetRain(weather.rainPossibility);
    }

    FillCityOverview();
    
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


    FillWeatherReports();
}
window.onload = ScriptOnDocLoad;