# SEAL Store API
This API provides information about products, users, and transactions
at SEAL, an e-commerce store.

## /allproducts
**Request Format:** /allproducts

**Request Type:** GET

**Returned Data Format:** JSON

**Description:** Get all the all the products and their information

**Example Request:** /allproducts

**Example Response:**

```json
{
  "products": {
    "food": [
      "dairy": [
        {
          "name": "Parmigiano-Reggiano Cheese",
          "short": "cheese",
          "price": 19.99,
          "unit": "lb"
        },
        {
          "name": "Pasture-raised Free Range Eggs",
          "short": "eggs",
          "price": 5.99,
          "unit": "dozen"
        }
        ,
        {
          "name": "Lactose-free Yogurt",
          "short": "yogurt",
          "price": 4.99,
          "unit": "tub"
        }
      ],
      "meat": [
        {
          "name": "Ribeye Steak",
          "short": "beef",
          "price": 13.99,
          "unit": "lb"
        },
        {
          "name": "Roasted Turkey",
          "short": "turkey",
          "price": 8.99,
          "unit": "Each"
        },
        {
          "name": "Whole Ham",
          "short": "ham",
          "price": 10.99,
          "unit": "Each"
        }
      ]
      ...
    ],
    "apparel": [
      {
        "name": "100% Cotton T-shirt",
        "short": "shirt",
        "colors": ["blue", "orange", "purple"],
        "price": 15.99
      },
      {
        "name": "Down Jacket",
        "short": "jacket",
        "colors": ["blue", "orange"],
        "price": 199.99
      },
      {
        "name": "Denim Jacket",
        "short": "denim-jacket",
        "colors": ["black", "blue"],
        "price": 64.99
      },
      {
        "name": "Jeans",
        "short": "jeans",
        "colors": ["khaki", "blue"],
        "price": 53.99
      }
    ]
  }
}
```

**Error Handling:**
Responds with a 500 status plain text error message if the JSON file cannot be read

## /pricerange/:range
**Request Format:** /pricerange/:range

**Request Type:** GET

**Returned Data Format:** JSON

**Description:** Pass in the price range to filter products

**Example Request:** /pricerange/5

**Example Response:**

```json
[
  {
    "name": "Lactose-free Yogurt",
    "description": "Safe to enjoy for those who are lactose-intolerant!",
    "price": "4.99",
    "unit": "tub"
  }
  {
    "name": "Fresh PNW Oysters",
    "description": "Delivered fresh daily from oyster farms in Puget Sound!",
    "price": "3.99",
    "unit": "Each"
  }
]
```

**Error Handling:**
Responds with a 400 status plain text error message if there is something wrong like the parameter provided is not a number

## /login
**Request Format:** /login

**Request Type:** POST

**Returned Data Format**: JSON

**Description:** Fetches information about the user who just logged in

**Example Request:** POST parameters of *email=foo@bar.com* and *password=12345678*

**Example Response:**

```json
{
  "email": "foo@bar.com",
  "password": "12345678",
  "points": 1000
}
```

**Error Handling:**
Responds with a 500 status plain text error message if there is something with fetching the JSON on the server-side. Responds with a 400 status plain text error message if there is something wrong with the user's parameters

## /signup
**Request Format:** /signup

**Request Type:** POST

**Returned Data Format**: JSON

**Description:** Saves information of the user who just signed up and returns his or her current account information

**Example Request:** POST parameters of *email=foo@bar.com* and *password=12345678*

**Example Response:**

```json
{
  "email": "foo@bar.com",
  "password": "12345678",
  "points": 0
}
```

**Error Handling:**
Responds with a 500 status plain text message if there is something with writing the JSON on the server-side or if there is something wrong with the user's parameter responds with a 400 error

## /add
**Request Format:** /add

**Request Type:** POST

**Returned Data Format**: plain text

**Description:** Adds the item to cart

**Example Request:** POST parameters of *item*

**Example Response:**

```
You successfully added the "item" into your cart!
```

**Error Handling:**
Responds with a 500 status plain text message if there is something with writing the JSON on the server-side or if there is something wrong with the user's parameter responds with a 400 error

## /checkout
**Request Format:** /checkout

**Request Type:** POST

**Returned Data Format**: plain text

**Description:** Checkout all the items in cart

**Example Request:** POST parameters of *items*

**Example Response:**

```
You successfully checkout! Here is your receipt!
```

**Error Handling:**
Responds with a 500 status plain text message if there is something with writing the JSON on the server-side or if there is something wrong with the user's parameter responds with a 400 error
