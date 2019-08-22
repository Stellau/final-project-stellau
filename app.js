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
const app = express();
const LOCALHOST = 8000;
const INVALID_PARAM_ERROR = 400;
const FILE_ERROR = 500;
const SERVER_ERROR = "Something went wrong on the server.";

app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(multer().none());
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
    if (result.length === 0) {
      res.type("text");
      res.status(INVALID_PARAM_ERROR).send("Please make sure that the short name is valid!");
    } else {
      res.json(result[0]);
    }
    db.end();
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
    if (result.length === 0) {
      res.type("text");
      res.status(INVALID_PARAM_ERROR).send("Please make sure that the short name is valid!");
    } else {
      res.json(result[0]);
    }
    db.end();
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
    if (result.length === 0) {
      res.type("text");
      res.status(INVALID_PARAM_ERROR).send("Please make sure that the name is valid!");
    } else {
      let value = "color";
      let colors = mapValues(result, value);
      res.json(colors);
    }
    db.end();
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
    if (result.length === 0) {
      res.type("text");
      res.status(INVALID_PARAM_ERROR).send("Please make sure that the range is valid!");
    } else {
      let value = "short";
      let shorts = mapValues(result, value);
      res.json(shorts);
    }
    db.end();
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
    let shorts = [];
    if (result.length > 0) {
      let value = "short";
      shorts = mapValues(result, value);
    }
    res.json(shorts);
    db.end();
  } catch (err) {
    handleError(db, res);
  }
});

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
