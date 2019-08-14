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
    "dairy": [
      {
        "name": "Parmigiano-Reggiano Cheese",
        "description": "One of Italian's favorite hard cheese",
        "price": "19.99",
        "unit": "lb"
      }
      {
        "name": "Pasture-raised Free Range Eggs",
        "description": "These eggs are safe for Tamago gohan",
        "price": "5.99",
        "unit": "dozen"
      }
      {
        "name": "Lactose-free Yogurt",
        "description": "Safe to enjoy for those who are lactose-intolerant!",
        "price": "4.99",
        "unit": "tub"
      }
    ],
    "meat": [
      {
        "name": "Ribeye Steak",
        "description": "Finest USDA Prime Steak!",
        "price": "13.99",
        "unit": "lb"
      }
      {
        "name": "Roasted Turkey",
        "description": "Turkeys are not just for Thanksgiving!",
        "price": "8.99",
        "unit": "Each"
      }
      {
        "name": "Whole Ham",
        "description": "Ham leg from pigs raised eating pine nuts!",
        "price": "10.99",
        "unit": "Each"
      }
    ]
    ...
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

## /contacts
**Request Format:** /contacts

**Request Type:** POST

**Returned Data Format**: plain text

**Description:** Adds the contact information into the contact JSON file

**Example Request:** POST parameters of *name=Foo*, *email=foo@bar.com*, *phone=123-456-7890*, and *message="more food please!"*

**Example Response:**

```
Hi! You successfully submitted the contact form, our staff will be with your soon!
```

**Error Handling:**
Responds with a 500 status plain text message if there is something with writing the JSON on the server-side or if there is something wrong with the user's parameter responds with a 400 error
