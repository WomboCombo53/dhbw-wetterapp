users = [
    {"username": "user", "password": "user", "isAdmin": false, "useCelsius": true},
    {"username": "admin", "password": "admin", "isAdmin": true, "useCelsius": false}
]

storedUsers = localStorage.getItem("users")

if (storedUsers != null)
{
    users = JSON.parse(storedUsers)
}