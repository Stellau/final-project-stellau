CREATE DATABASE IF NOT EXISTS seal;
USE seal;

DROP TABLE IF EXISTS products;
DROP TABLE IF EXISTS gifts;
DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS orders;
DROP TABLE IF EXISTS contacts;

CREATE TABLE products(
  pid INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(63) NOT NULL,
  short VARCHAR(20) NOT NULL,
  content VARCHAR(1000) NOT NULL,
  description VARCHAR(1000) NOT NULL,
  subcategory VARCHAR(63) NOT NULL,
  category VARCHAR(35) NOT NULL,
  color VARCHAR(20),
  price decimal(6,2) NOT NULL,
  unit VARCHAR(10) NOT NULL,
  stock INT NOT NULL,
  sales TINYINT(1) DEFAULT 0,
  discount decimal(6,2)
);

INSERT INTO products (name, short, content, description, subcategory, category, price, unit, stock)
VALUES("Large Organic Hass Avocado", "avocado", "Avocado", "A great source of vitamins B, K, C, E, and potassium", "Produce", "Food", 2.99, "each", 1000),
      ("USDA Prime Ribeye Steak", "beef", "USDA PRIME beef", "A great source of iron and zinc!", "Meat", "Food", 13.99, "lb", 500),
      ("Parmigiano Cheese", "cheese", "Parmigiano Cheese", "One of the best Italian cheese, great on pizza and pasta!", "Dairy", "Food", 19.99, "lb", 250),
      ("Pasture-raised Freerange Eggs", "eggs", "Pasture-raised freerange eggs", "Eggs from free chicken raised happily!", "Dairy", "Food", 5.99, "dozen", 300),
      ("Rotisserie Chicken", "chicken", "Orgainic chicken with spice and salt", "Roasted whole orgainic chicken!", "Meat", "Food", 12.99, "each", 200),
      ("Dungeness Crab", "crab", "Dungeness crab", "Dungeness crab from Puget Sound!", "Seafood", "Food", 15.99, "each", 150),
      ("Whole Ham Leg", "ham", "Whole ham leg", "Ham legs from Black Iberian Pigs, delivered fresh from spain", "Meat", "Food", 49.99, "each", 50),
      ("Fresh Oysters", "oyster", "Oysters", "Fresh oysters from Puget Sound!", "Seafood", "Food", 3.99, "each", 150),
      ("Bell Pepper", "pepper", "Bell peppers", "Orgainic bell pepper harvested from local farms!", "Produce", "Food", 0.99, "each", 200),
      ("Tiger Shrimps", "shrimp", "Frozen tiger shrimps from Thailand", "Great for shrimp alfredo and so much more!", "Seafood", "Food", 9.99, "lb", 100),
      ("Roasted Turkey", "turkey", "Organic turkey", "Turkeys are not only for Thanksgiving!", "Meat", "Food", 10.99, "each", 50),
      ("Zucchini", "zucchini", "Organic zucchini", "Organic zucchini harvested from local farms!", "Produce", "Food", 0.99, "each", 50),
      ("Kyoho Grapes", "grapes", "Organic Kyoho grapes", "Kyoho grapes form California!", "Produce", "Food", 10.99, "lb", 60),
      ("Monthong Durians", "durian", "Monthong Durians", "Flavorful and exotic Monthong durians imported from Thailand!", "Produce", "Food", 20.99, "each", 50),
      ("Kiwis", "kiwi", "Kiwi fruits", "Kiwi fruits imported from New Zealand!", "Produce", "Food", 3.99, "lb", 100);

LOAD DATA LOCAL INFILE 'products.csv' INTO TABLE Products
FIELDS TERMINATED BY ','
ENCLOSED BY '"'
LINES TERMINATED BY '\r\n';

CREATE TABLE gifts(
  gid INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(63) NOT NULL,
  short VARCHAR(20) NOT NULL,
  content VARCHAR(1000) NOT NULL,
  description VARCHAR(1000) NOT NULL,
  points INT NOT NULL,
  stock INT NOT NULL,
  unit VARCHAR(10)
);

CREATE TABLE users(
  uid INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
  username VARCHAR(63) NOT NULL,
  email VARCHAR(63) NOT NULL,
  phone_number VARCHAR(20) NOT NULL,
  points INT DEFAULT 0,
  join_time DATETIME DEFAULT NOW()
);

CREATE TABLE orders(
  orid INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
  uid INT NOT NULL,
  total_price DECIMAL(8,2) NOT NULL,
  tax DECIMAL(8,2) NOT NULL,
  order_time DATETIME DEFAULT NOW()
);

CREATE TABLE contacts(
  cid INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
  uid INT,
  name VARCHAR(63),
  phone_number VARCHAR(20),
  email VARCHAR(63),
  message VARCHAR(1500) NOT NULL
);
