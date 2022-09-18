"use strict";

/*
 * Name: Stella Lau
 * Date: 08.18.2019
 * Section: CSE 154 AC
 * This is the JavaScript file which acts as an API and deal with requests
 * from the server-side JavaScript files for the e-commerce store SEAL
 */

const express = require("express");
const mysql = require("promise-mysql");
const multer = require("multer"); // Handles form-data requests.
const cookieParser = require("cookie-parser");
const app = express();
const LOCALHOST = 8000;
const INVALID_PARAM_ERROR = 400;
const MISS_PARAM = "Please make sure you entered all required parameters!";
const INVALID_SHORT = "Please make sure that the short name is valid!";
const FILE_ERROR = 500;
const SERVER_ERROR = "Something went wrong on the server.";
const CONTACT_SUCCESS =
"You successfully submitted the contact form. Our staff will be glad to help you soon!";
const SECOND = 1000;
const SIXTY = 60;
const HOUR = 2;
const COOKIE_EXPIRATION = HOUR * SIXTY * SIXTY * SECOND;

app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(multer().none());
app.use(cookieParser());
app.use(express.static("public"));

app.get("/allProducts", async (req, res) => {
  let db;
  try {
    db = await getDB();
    let foods = await getAllFoods(db);
    let apparels = await getAllApparels(db);
    db.end();
    res.json({"Food": foods, "Apparel": apparels});
  } catch (err) {
    handleError(db, res);
  }
});

app.get("/allFoods", async (req, res) => {
  let db;
  try {
    db = await getDB();
    let foods = await getAllFoods(db);
    db.end();
    res.json(foods);
  } catch (err) {
    handleError(db, res);
  }
});

app.get("/allApparels", async (req, res) => {
  let db;
  try {
    db = await getDB();
    let apparels = await getAllApparels(db);
    db.end();
    res.json(apparels);
  } catch (err) {
    handleError(db, res);
  }
});

app.get("/allGifts", async (req, res) => {
  let db;
  try {
    db = await getDB();
    let query = "SELECT name, short, points, unit FROM gifts;";
    let gifts = await db.query(query);
    db.end();
    res.json(gifts);
  } catch (err) {
    handleError(db, res);
  }
});

app.get("/sales", async (req, res) => {
  let db;
  try {
    db = await getDB();
    let query =
    "SELECT name, short, price, unit, discount FROM products WHERE sales = 1;";
    let items = await db.query(query);
    db.end();
    res.json(items);
  } catch (err) {
    handleError(db, res);
  }
});

app.get("/single/:short", async (req, res) => {
  let short = req.params.short;
  short = short.toLowerCase();
  let db;
  try {
    db = await getDB();
    let query = "SELECT content, description FROM products WHERE short = ?;";
    let result = await db.query(query, [short]);
    db.end();
    if (result.length === 0) {
      res.type("text");
      res.status(INVALID_PARAM_ERROR).send(INVALID_SHORT);
    } else {
      res.json(result[0]);
    }
  } catch (err) {
    handleError(db, res);
  }
});

app.get("/gift/:short", async (req, res) => {
  let short = req.params.short;
  short = short.toLowerCase();
  let db;
  try {
    db = await getDB();
    let query = "SELECT content, description FROM gifts WHERE short = ?;";
    let result = await db.query(query, [short]);
    db.end();
    if (result.length === 0) {
      res.type("text");
      res.status(INVALID_PARAM_ERROR).send(INVALID_SHORT);
    } else {
      res.json(result[0]);
    }
  } catch (err) {
    handleError(db, res);
  }
});

app.get("/color/:name", async (req, res) => {
  let name = req.params.name;
  let db;
  try {
    db = await getDB();
    let query = "SELECT color FROM products WHERE name = ?";
    let result = await db.query(query, [name]);
    db.end();
    if (result.length === 0) {
      res.type("text");
      res.status(INVALID_PARAM_ERROR).send("Please make sure that the name is valid!");
    } else {
      let value = "color";
      let colors = mapValues(result, value);
      res.json(colors);
    }
  } catch (err) {
    handleError(db, res);
  }
});

app.get("/price/:range", async (req, res) => {
  let range = req.params.range;
  let db;
  try {
    db = await getDB();
    let query =
    "SELECT short FROM products WHERE sales = 1 && price-discount < ? OR sales = 0 && price < ?;";
    let result = await db.query(query, [range, range]);
    db.end();
    if (result.length === 0) {
      res.type("text");
      res.status(INVALID_PARAM_ERROR).send("Please make sure that the range is valid!");
    } else {
      let value = "short";
      let shorts = mapValues(result, value);
      res.json(shorts);
    }
  } catch (err) {
    handleError(db, res);
  }
});

app.get("/search/:term", async (req, res) => {
  let term = req.params.term;
  let db;
  try {
    db = await getDB();
    let query = "SELECT short FROM products WHERE name LIKE " + db.escape('%' + term + '%') + ";";
    let result = await db.query(query, [term]);
    db.end();
    let shorts = [];
    if (result.length > 0) {
      let value = "short";
      shorts = mapValues(result, value);
    }
    res.json(shorts);
  } catch (err) {
    handleError(db, res);
  }
});

app.post("/contacts", async (req, res) => {
  let name = req.body.name;
  let email = req.body.email;
  let number = req.body["phone-number"];
  let message = req.body.message;
  res.type("text");
  if (!(name && email && number && message)) {
    res.status(INVALID_PARAM_ERROR).send(MISS_PARAM);
  } else {
    let db;
    try {
      db = await getDB();
      let query = "INSERT INTO contacts(name, phone_number, email, message) VALUES (?, ?, ?, ?);";
      let result = await db.query(query, [name, number, email, message]);
      db.end();
      if (result.affectedRows === 1) {
        res.send(CONTACT_SUCCESS);
      } else {
        throw new Error();
      }
    } catch (err) {
      handleError(db, res);
    }
  }
});

app.post("/user/contacts", async (req, res) => {
  let message = req.body.message;
  res.type("text");
  let db;
  try {
    db = await getDB();
    let sessionId = req.cookies["session_id"];
    let userId = await getUserId(sessionId, db);
    if (await insertUserToContacts(userId, message, db)) {
      res.type("text");
      res.send(CONTACT_SUCCESS);
    } else {
      throw new Error();
    }
    db.end();
  } catch (err) {
    handleError(db, res);
  }
});

app.post("/signup", async (req, res) => {
  let username = req.body.username;
  let email = req.body.email;
  let number = req.body["phone_number"];
  let password = req.body.password;
  res.type("text");
  if (!(username && email && number && password)) {
    res.status(INVALID_PARAM_ERROR).send(MISS_PARAM);
  } else {
    let db;
    try {
      db = await getDB();
      if (await checkUser(username, password, db)) {
        res.send("You already have an account! Please log in!");
      } else {
        let sessionId = await getSessionId(db);
        if (await insertUser(sessionId, username, email, number, password, db)) {
          res.send("You are now one of SEAL's loyal customers, log in to enjoy all the perks!");
        } else {
          throw new Error();
        }
      }
      db.end();
    } catch (err) {
      handleError(db, res);
    }
  }
});

app.post("/login", async (req, res) => {
  let username = req.body.username;
  let password = req.body.password;
  if (!(username && password)) {
    res.type("text");
    res.status(INVALID_PARAM_ERROR).send(MISS_PARAM);
  } else {
    let db;
    try {
      db = await getDB();
      if (!await checkUser(username, password, db)) {
        let warning = "Please make sure your username and passwords are corret!";
        res.type("text");
        res.status(INVALID_PARAM_ERROR).send(warning);
      } else {
        let user = await getUserInfo(username, password, db);
        let expiryTime = new Date(Date.now() + COOKIE_EXPIRATION);
        res.cookie("session_id", user["session_id"], {expires: expiryTime});
        let result = {};
        result["email"] = user["email"];
        result["phone_number"] = user["phone_number"];
        result["points"] = user["points"];
        res.json(result);
      }
      db.end();
    } catch (err) {
      handleError(db, res);
    }
  }
});

app.post("/logout", (req, res) => {
  res.type("text");
  let sessionId = req.cookies["session_id"];
  if (sessionId) {
    res.clearCookie("session_id");
    res.send("You logged out successfully!");
  } else {
    res.send("You logged out already!");
  }
});

app.post("/checklogin", (req, res) => {
  res.type("text");
  let sessionId = req.cookies["session_id"];
  if (sessionId) {
    res.send("true");
  } else {
    res.send("false");
  }
});

app.post("/submit", async (req, res) => {
  let uid = req.body.uid;
  let totalPrice = req.body["total_price"];
  let totalPoints = req.body["total_points"];
  let tax = req.body.tax;
  let pointsEarned = req.body["points_earned"];
  res.type("text");
  if (!(uid && totalPrice && totalPoints && tax)) {
    res.status(INVALID_PARAM_ERROR).send(MISS_PARAM);
  } else {
    let db;
    try {
      db = await getDB();
      let query =
      "INSERT INTO orders(uid, total_price, total_points, tax) VALUES (?, ?, ?, ?);";
      let results = await db.query(query, [uid, totalPrice, totalPoints, tax]);
      if (results.affectedRows === 1) {
        let qry = "UPDATE users SET points = points + ? WHERE uid = ?;";
        let result = await db.query(qry, [pointsEarned, uid]);
        verifyResponse(result, res);
      } else {
        throw new Error();
      }
      db.end();
    } catch (err) {
      handleError(db, res);
    }
  }
});

app.post("/currentuser", async (req, res) => {
  let sessionId = req.cookies["session_id"];
  let db;
  try {
    db = await getDB();
    let query =
    "SELECT email, phone_number, points FROM users WHERE session_id = ?";
    let result = await db.query(query, [sessionId]);
    db.end();
    res.json(result[0]);
  } catch (err) {
    handleError(db, res);
  }
});

app.post("/currentuserid", async (req, res) => {
  let sessionId = req.cookies["session_id"];
  let db;
  try {
    db = await getDB();
    let query = "SELECT uid FROM users WHERE session_id = ?";
    let result = await db.query(query, [sessionId]);
    db.end();
    if (result.length === 1) {
      res.json(result[0].uid);
    } else {
      throw new Error();
    }
  } catch (err) {
    handleError(db, res);
  }
});

app.get("/cart/:item", async (req, res) => {
  let item = req.params.item;
  let db;
  try {
    db = await getDB();
    let query =
    "SELECT name, price, unit, sales, discount, color FROM products WHERE short=?;";
    let result = await db.query(query, [item]);
    if (result.length === 1) {
      result = result[0];
      let name = result.name;
      let unit = result.unit;
      let color = result.color;
      let product = {};
      if (result.sales) {
        let price = result.price - result.discount;
        product = genProductJSON(name, price, unit, color, product);
      } else {
        product = genProductJSON(name, result.price, unit, color, product);
      }
      db.end();
      res.json(product);
    } else {
      await checkGifts(item, db, res);
    }
  } catch (err) {
    handleError(db, res);
  }
});

/**
 * this function helpes to generate a JSON object with product information given
 * @param {string} name - name of the product
 * @param {integer} price - price of the product
 * @param {string} unit - unit of the product
 * @param {string} color - color of the product
 * @param {JSON} product - an empty JSON
 * @returns {JSON} - a JSON with the product's information
 */
function genProductJSON(name, price, unit, color, product) {
  if (color) {
    product["name"] = color + " " + name;
    product["tax"] = true;
  } else {
    product["name"] = name;
    product["tax"] = false;
  }
  product["unit"] = unit;
  product["price"] = price;
  product["type"] = "product";
  return product;
}

/**
 * @param {string} short - short of the gift
 * @param {promise} db - the database connection
 * @param {promise} res - response that will be sent
 * @returns {JSON} a JSON object that holds basic information about the gift
 */
async function checkGifts(short, db, res) {
  let query = "SELECT name, points, unit FROM gifts WHERE short=?;";
  let result = await db.query(query, [short]);
  db.end();
  if (result.length === 1) {
    let finalResult = result[0];
    finalResult["type"] = "gift";
    finalResult["tax"] = false;
    res.json(finalResult);
  } else {
    res.type("text");
    res.status(INVALID_PARAM_ERROR).send(INVALID_SHORT);
  }
}

/**
 * this function verify whether points are updated correctly
 * for the user
 * @param {JSON} result - the JSON object holding the insert data
 * @param {object} res - the response object
 */
function verifyResponse(result, res) {
  if (result.affectedRows === 1) {
    res.send("You order is successfully submitted and is being processed now!");
  } else {
    throw new Error();
  }
}

/**
 * this function is used to obtain user's information
 * @param {string} username - username of the user
 * @param {string} password - password of the user
 * @param {promise} db - the database connection
 * @param {JSON} - the basic information about the user
 */
async function getUserInfo(username, password, db) {
  let query =
  "SELECT email, phone_number, points, session_id FROM users WHERE username=? AND password=?";
  let result = await db.query(query, [username, password]);
  return result[0];
}

/**
 * this function is used to check whether the user has an account
 * @param {string} username - username of the user
 * @param {stirng} password - password of the user
 * @param {promise} db - the database connection
 * @returns {boolean} - whether the user is already in the database or not
 */
async function checkUser(username, password, db) {
  let query = "SELECT uid FROM users WHERE username=? AND password=?";
  let results = await db.query(query, [username, password]);
  return results.length > 0;
}

/**
 * Generates an unused sessionid and returns it to the user.
 * @param {promise} db - A connection object to the database.
 * @returns {string} - The random session id.
 */
async function getSessionId(db) {
  let query = "SELECT uid FROM users WHERE session_id = ?";
  let id;
  const RADIX = 36;
  const START = 2;
  const END = 15;
  do {
    /*
     * This wizardry comes from https://gist.github.com/6174/6062387
     * it can also be found on the section slides on the 20th
     * Melissa granted permission for me to apply this to my final project
     */
    id = Math.random().toString(RADIX)
      .substring(START, END) + Math.random().toString(RADIX)
      .substring(START, END);
  } while ((await db.query(query, [id])).length > 0);
  return id;
}

/**
 * this is used to insert the user's information into the users table
 * @param {string} sessionId - a random sessionId
 * @param {string} userName - userName of the user
 * @param {string} email - email of the user
 * @param {string} number - phone number of the user
 * @param {string} password - password of the user
 * @param {promise} db - the database connection
 * @returns {boolean} - whether the user is successfully inserted into the database or not
 */
async function insertUser(sessionId, userName, email, number, password, db) {
  let query =
  "INSERT INTO users(username, email, phone_number, password, session_id) VALUES (?, ?, ?, ?, ?);";
  let results = await db.query(query, [userName, email, number, password, sessionId]);
  return results.affectedRows === 1;
}

/**
 * this is used to insert the contact message of a user into the contacts table
 * @param {interger} userId - userId of the user
 * @param {string} message - message given by the user
 * @param {promise} db - the database connection
 */
async function insertUserToContacts(userId, message, db) {
  let query = "INSERT INTO contacts(uid, message) VALUES (?, ?);";
  let result = await db.query(query, [userId, message]);
  return result.affectedRows === 1;
}

/**
 * this function fetches the userId of the current user
 * @param {string} sessionId - current sessionId
 * @param {promise} db - the database connection
 * @returns {integer} - the user id of the user
 */
async function getUserId(sessionId, db) {
  let query = "SELECT uid FROM users WHERE session_id=?;";
  let results = await db.query(query, [sessionId]);
  return results[0].uid;
}

/**
 * this function is used to get all the subcategories of a category
 * @param {string} category - the name of the category
 * @param {promise} db - the database connection
 * @returns {array} an array of subcategories
 */
async function getSubcategories(category, db) {
  let query = "SELECT DISTINCT subcategory FROM products WHERE category = ?;";
  let items = await db.query(query, [category]);
  return items;
}

/**
 * this function is used to get all the foods in a subcategory
 * @param {string} subcategory - the name of the subcategory
 * @param {promise} db - the database connection
 * @returns {array} an array of items in the subcategory
 */
async function getFoods(subcategory, db) {
  let query =
  "SELECT name, short, price, unit, sales, discount FROM products WHERE subcategory = ?;";
  let items = await db.query(query, [subcategory]);
  return items;
}

/**
 * this function is used to get all the foods
 * @param {promise} db - the database connection
 * @returns {JSON} a JSON object that contains all foods
 */
async function getAllFoods(db) {
  let subcategories = await getSubcategories("Food", db);
  let value = "subcategory";
  subcategories = mapValues(subcategories, value);
  let result = {};
  for (let i = 0; i < subcategories.length; i++) {
    let subcategory = subcategories[i];
    let products = await getFoods(subcategory, db);
    result[subcategory] = products;
  }
  return result;
}

/**
 * this function is used to get all the apparels in a subcategory
 * @param {string} subcategory - the name of the subcategory
 * @param {promise} db - the database connection
 * @returns {array} an array of items in the subcategory
 */
async function getApparels(subcategory, db) {
  let query =
  "SELECT name, category, short, price, unit, color FROM products WHERE subcategory = ?;";
  let items = await db.query(query, [subcategory]);
  return items;
}

/**
 * This function gets all the apparel that SEAL sells
 * @param {promise} db - the database connection
 * @returns {JSON} a JSON object that contains all clothes
 */
async function getAllApparels(db) {
  let subcategories = await getSubcategories("Apparel", db);
  let value = "subcategory";
  subcategories = mapValues(subcategories, value);
  let result = {};
  for (let i = 0; i < subcategories.length; i++) {
    let subcategory = subcategories[i];
    let products = await getApparels(subcategory, db);
    result[subcategory] = products;
  }
  return result;
}

/**
 * this function is used to get extract all values in a JSON array
 * @param {array} arr - an array
 * @param {string} value - the name of values being extracted
 * @returns {array} an array of items in the array
 */
function mapValues(arr, value) {
  let result = arr.map((val) => {
    return val[value];
  });
  return result;
}

/**
 * this function is used to handle database error
 * @param {promise} db - the database connection
 * @param {promise} res - response that will be sent
 */
function handleError(db, res) {
  if (db) {
    db.end();
  }
  res.type("text");
  res.status(FILE_ERROR).send(SERVER_ERROR);
}

/**
 * Establishes a database connection and returns the database object.
 * @returns {Object} - The database object for the connection.
 */
async function getDB() {
  let db = await mysql.createConnection({
    host: "localhost",
    port: "8889",
    user: "root",
    password: "root",
    database: "seal"
  });
  return db;
}

const PORT = process.env.PORT || LOCALHOST;
app.listen(PORT);
