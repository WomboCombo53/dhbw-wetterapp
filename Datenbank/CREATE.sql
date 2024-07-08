CREATE TABLE user
(
    id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(50) NOT NULL,
    passhash VARCHAR(64) NOT NULL,
    adminPrivileges BOOLEAN NOT NULL,
    -- Usereinstellungen
    useCelsius BOOLEAN NOT NULL DEFAULT true
)

CREATE TABLE userActivity
(
    id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    activityType INT NOT NULL REFERENCES activityType(id),
    user INT NOT NULL REFERENCES user(id),
    city INT NULL REFERENCES city(id), -- ggf. Verweis auf City z.B. beim Ansehen der Detailseite
    
)
CREATE TABLE activityType
(
    id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    typeName VARCHAR(50) NOT NULL
)

CREATE TABLE favouriteCity
(
    id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    user INT NOT NULL REFERENCES user(id),
    city INT NOT NULL REFERENCES city(id)
)

CREATE TABLE city
(
    id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    cityname VARCHAR(50) NOT NULL
)

CREATE TABLE weatherReport
(
    id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    temp INT NOT NULL,
    generalDescription TEXT NOT NULL, -- z.B. bewölkt oder freier Himmel
    rainPossibility INT NOT NULL,
    timeOfReport datetime NOT NULL DEFAULT current_timestamp
)