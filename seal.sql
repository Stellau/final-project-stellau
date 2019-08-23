-- Author: Stella Lau
-- Section: CSE 154 AC
-- Last Updated: 08/22/2019 12:48

-- This database will be used in app.js, which will be used for SEAL
CREATE DATABASE IF NOT EXISTS seal;
USE seal;

DROP TABLE IF EXISTS products;
DROP TABLE IF EXISTS gifts;
DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS orders;
DROP TABLE IF EXISTS order_details;
DROP TABLE IF EXISTS contacts;

-- This table stores all information about all the products sold at SEAL
CREATE TABLE products(
  pid INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(63) NOT NULL,
  short VARCHAR(20) NOT NULL UNIQUE,
  content VARCHAR(1000) NOT NULL,
  description VARCHAR(1000) NOT NULL,
  subcategory VARCHAR(63) NOT NULL,
  category VARCHAR(35) NOT NULL,
  color VARCHAR(20),
  price decimal(6,2) NOT NULL,
  unit VARCHAR(10) NOT NULL,
  sales TINYINT(1) DEFAULT 0,
  discount decimal(6,2)
);

-- Note: after inserting statement, import products.csv into the products table
INSERT INTO products (name, short, content, description, subcategory, category, price, unit)
VALUES("Large Organic Hass Avocado", "avocado", "Avocado", "A great source of vitamins B, K, C, E, and potassium", "produce", "Food", 2.99, "each"),
      ("USDA Prime Ribeye Steak", "beef", "USDA PRIME beef", "A great source of iron and zinc!", "meat", "Food", 13.99, "lb"),
      ("Parmigiano Cheese", "cheese", "Parmigiano Cheese", "One of the best Italian cheese, great on pizza and pasta!", "dairy", "Food", 19.99, "lb"),
      ("Pasture-raised Freerange Eggs", "eggs", "Pasture-raised freerange eggs", "Eggs from free chicken raised happily!", "dairy", "Food", 5.99, "dozen"),
      ("Rotisserie Chicken", "chicken", "Orgainic chicken with spice and salt", "Roasted whole orgainic chicken!", "meat", "Food", 12.99, "each"),
      ("Dungeness Crab", "crab", "Dungeness crab", "Dungeness crab from Puget Sound!", "seafood", "Food", 15.99, "each"),
      ("Whole Ham Leg", "ham", "Whole ham leg", "Ham legs from Black Iberian Pigs, delivered fresh from spain", "meat", "Food", 49.99, "each"),
      ("Fresh Oysters", "oyster", "Oysters", "Fresh oysters from Puget Sound!", "seafood", "Food", 3.99, "each"),
      ("Bell Pepper", "pepper", "Bell peppers", "Orgainic bell pepper harvested from local farms!", "produce", "Food", 0.99, "each"),
      ("Tiger Shrimps", "shrimp", "Frozen tiger shrimps from Thailand", "Great for shrimp alfredo and so much more!", "seafood", "Food", 9.99, "lb"),
      ("Roasted Turkey", "turkey", "Organic turkey", "Turkeys are not only for Thanksgiving!", "meat", "Food", 10.99, "each"),
      ("Zucchini", "zucchini", "Organic zucchini", "Organic zucchini harvested from local farms!", "produce", "Food", 0.99, "each"),
      ("Kyoho Grapes", "grapes", "Organic Kyoho grapes", "Kyoho grapes form California!", "produce", "Food", 10.99, "lb"),
      ("Monthong Durians", "durian", "Monthong Durians", "Flavorful and exotic Monthong durians imported from Thailand!", "produce", "Food", 20.99, "each"),
      ("Kiwis", "kiwi", "Kiwi fruits", "Kiwi fruits imported from New Zealand!", "produce", "Food", 3.99, "lb");

-- This table stores all of the information about gifts that users can exchange with their points
-- Note: import gifts.csv into the gifts table
CREATE TABLE gifts(
  gid INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(63) NOT NULL,
  short VARCHAR(20) NOT NULL UNIQUE,
  content VARCHAR(1000) NOT NULL,
  description VARCHAR(1000) NOT NULL,
  points INT NOT NULL,
  unit VARCHAR(10)
);

-- This table stores all information about the users of this website
CREATE TABLE users(
  uid INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
  username VARCHAR(63) NOT NULL,
  email VARCHAR(63) NOT NULL,
  phone_number VARCHAR(20) NOT NULL,
  password VARCHAR(30) NOT NULL,
  points INT DEFAULT 0,
  join_time DATETIME DEFAULT NOW(),
  session_id VARCHAR(63) NOT NULL UNIQUE
);

-- This table stores all orders submitted
CREATE TABLE orders(
  order_id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
  uid INT NOT NULL,
  total_price DECIMAL(8,2) NOT NULL,
  tax DECIMAL(8,2) NOT NULL,
  order_time DATETIME DEFAULT NOW(),
  FOREIGN KEY (uid) REFERENCES users(uid)
);

-- This table stores the order details of the orders so I can have more than one item for an order
CREATE TABLE order_details(
  detail_id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
  order_id INT NOT NULL,
  pid INT NOT NULL,
  p_qty INT NOT NULL,
  gid INT NOT NULL,
  q_qty INT NOT NULL,
  FOREIGN KEY (order_id) REFERENCES orders(order_id),
  FOREIGN KEY (pid) REFERENCES products(pid),
  FOREIGN KEY (gid) REFERENCES gifts(gid)
);

-- This table stores all the customer service contant information
CREATE TABLE contacts(
  cid INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
  uid INT,
  name VARCHAR(63),
  phone_number VARCHAR(20),
  email VARCHAR(63),
  message VARCHAR(1500) NOT NULL,
  FOREIGN KEY (uid) REFERENCES users(uid)
);
