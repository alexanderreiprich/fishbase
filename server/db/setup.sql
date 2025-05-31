CREATE DATABASE IF NOT EXISTS fishbase;
USE fishbase;

-- benutzertabelle erstellen
CREATE TABLE IF NOT EXISTS users (
  id SMALLINT PRIMARY KEY,
  picture BLOB,
  username VARCHAR(20) NOT NULL,
  email VARCHAR(50) NOT NULL,
  password VARCHAR(50) NOT NULL,
  favoritefish SMALLINT,
  aquarium BLOB
);

-- aquarientabelle erstellen
CREATE TABLE IF NOT EXISTS aquariums (
  id SMALLINT PRIMARY KEY,
  userid SMALLINT NOT NULL,
  name VARCHAR(50) NOT NULL,
  content VARCHAR(200),
  FOREIGN KEY (userid) REFERENCES users(id)
);

-- artentabelle erstellen
CREATE TABLE IF NOT EXISTS inhabitants (
  id SMALLINT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  latinname VARCHAR(100),
  habitat VARCHAR(50),
  color VARCHAR(30),
  predators TEXT,          -- kommaseparierte liste von ids
  image BLOB,
  type VARCHAR(10) NOT NULL,        -- 'animal' oder 'plant'
  length FLOAT,            -- nur für tiere
  food VARCHAR(100),       -- nur für tiere
  minheight FLOAT,         -- nur für pflanzen
  maxheight FLOAT          -- nur für pflanzen
);

-- nachher ausführbar mit mysql -u root -p fishbase