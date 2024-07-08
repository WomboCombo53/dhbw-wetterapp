-- SELECT-Abfragen für verschiedene Websitevorgänge

-- Login / Session Authentication
SELECT id, username, passhash FROM user WHERE username="username";

-- Admin Authorization
SELECT id, username, passhash, adminPrivileges FROM user WHERE username="admin";

-- Startseite Städte anzeigen
SELECT id, cityname FROM city;

-- Favorisierte Städte anzeigen
SELECT favouriteCity.id, city.id, city.cityname FROM favouriteCity
LEFT JOIN city ON city.id = favouriteCity.city
WHERE user = "userid";

-- Nutzeraktivitäten anzeigen (Admin)
SELECT userActivity.id, activityType.typeName, user.username, city.cityname, timeOfActivity FROM userActivity
