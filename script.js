const userStorage = "user"
const cityStorage = "city"
const weatherStorage = "weather"
const favoriteStorage = "favs"
const cityActivityStorage = "cAct"
const userActivityStorage = "uAct"

let users = [
    {"username": "user", "password": "user", "isAdmin": false, "useCelsius": true},
    {"username": "admin", "password": "admin", "isAdmin": true, "useCelsius": false}
]

let cities = [
    {"cityname": "Bonn"},
    {"cityname": "Stuttgart"}
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
    let storedCities = localStorage.getItem(cityStorage)
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
    localStorage.setItem(cityStorage, JSON.stringify(cities))
    localStorage.setItem(weatherStorage, JSON.stringify(weatherReports))
    localStorage.setItem(favoriteStorage, JSON.stringify(favouriteCities))
    localStorage.setItem(cityActivityStorage, JSON.stringify(cityActivity))
    localStorage.setItem(userActivityStorage, JSON.stringify(userActivity))
}