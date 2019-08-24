"use strict";

/*
 * Name: Stella Lau
 * Date: 08.23.2019
 * Section: CSE 154 AC
 * This is the JavaScript file that gives behaviors to cart.html
 */

(function() {

  window.addEventListener("load", init);
  const gen = helpers.gen;
  const id = helpers.id;
  const qsa = helpers.qsa;
  const checkStatus = helpers.checkStatus;
  const ERROR_MESSAGE = helpers["ERROR_MESSAGE"];

  /**
   * this function is used to initialize the cart page
   * of SEAL
   */
  function init() {
    let cart = this.localStorage.getItem("cart");
    cart = JSON.parse(cart);
    checkLogin();
    generateItems(cart);
  }

  /**
   * this function is used to generate all the items in cart
   * @param {JSON} cart - JSON object that contains everything in the cart
   */
  async function generateItems(cart) {
    for (let i = 0; i < cart.length; i++) {
      await genLi(cart[i]);
    }
    generateTotal();
    generateTotalPoints();
    id("check-out").addEventListener("click", submitOrder);
  }

  /**
   * this function is used to generate the total price of the items in cart
   */
  function generateTotal() {
    let items = qsa("li.products");
    let subtotal = 0;
    let tax = 0;
    const TAX_RATE = 0.1;
    for (let i = 0; i < items.length; i++) {
      let item = items[i];
      let quantity = item.querySelector("input").value;
      let priceTag = item.querySelector("p.price").textContent;
      let price = priceTag.substring(priceTag.indexOf("$") + 1, priceTag.indexOf("/"));
      price = parseFloat(price);
      subtotal += quantity * price;
      if (item.classList.contains("tax")) {
        tax += price * TAX_RATE;
      }
    }
    let pointsEarned = parseInt(subtotal / 2);
    tax = parseFloat(tax.toFixed(2));
    subtotal = parseFloat(subtotal.toFixed(2));
    id("subtotal-price").textContent = subtotal;
    id("tax").textContent = tax;
    id("grand-total").textContent = subtotal + tax;
    id("points-earned").textContent = pointsEarned;
  }

  /**
   * this function is used to generate total points of gifts
   */
  function generateTotalPoints() {
    let items = qsa("li.gifts");
    let points = 0;
    for (let i = 0; i < items.length; i++) {
      let item = items[i];
      let quantity = item.querySelector("input").value;
      let priceTag = item.querySelector("p.points").textContent;
      let price = priceTag.substring(priceTag.indexOf(" ") + 1, priceTag.indexOf("/"));
      price = parseInt(price);
      points += quantity * price;
    }
    id("subtotal-points").textContent = points;
  }

  /**
   * this function is used to generate basic information about an item in cart
   * @param {JSON} product - current item
   */
  async function genLi(product) {
    let items = id("items-cart");
    let short = product.short;
    let item = gen("li");
    let productCode = gen("p");
    productCode.textContent = "Product Code: ";
    let code = gen("span");
    code.classList.add("product-code");
    code.textContent = short;
    productCode.appendChild(code);
    let information = await genInfo(short);
    let name = gen("p");
    name.textContent = information.name;
    let qty = product.qty;
    let quantity = gen("p");
    quantity.textContent = "Qty: ";
    let price = genPrice(information, item);
    let input = generateInput(short, qty);
    quantity.appendChild(input);
    item.appendChild(name);
    item.appendChild(price);
    item.appendChild(productCode);
    item.appendChild(quantity);
    items.appendChild(item);
  }

  /**
   * this function generates the quantity input for each item
   * @param {string} short - short of the item
   * @param {integer} qty - quantity of the item
   * @returns {object} - an input object
   */
  function generateInput(short, qty) {
    let input = gen("input");
    input.id = short;
    input.value = qty;
    input.type = "number";
    input.min = 0;
    input.step = 1;
    input.addEventListener("change", function() {
      generateTotal();
      generateTotalPoints();
    });
    return input;
  }

  /**
   * this helper function generates the price of an item in cart
   * it also tells the user, whether there will be tax
   * @param {JSON} information - information about the product
   * @param {object} item - the parent node of the p object
   * @returns {object} - a DOM paragraph object
   */
  function genPrice(information, item) {
    let type = information.type;
    let unit = information.unit;
    let tax = information.tax;
    let price = gen("p");
    let text;
    if (type === "product") {
      text = "Price: $" + information.price + "/" + unit;
      item.classList.add("products");
      price.classList.add("price");
      if (tax) {
        text += " + tax";
        item.classList.add("tax");
      }
    } else {
      text = "Points: " + information.points + "/" + unit;
      price.classList.add("points");
      item.classList.add("gifts");
    }
    price.textContent = text;
    return price;
  }

  /**
   * this function is to fetch for basic information about an item in cart
   * @param {string} short - the short of the product
   * @returns {JSON} - a JSON object with the basic information of the item
   */
  async function genInfo(short) {
    let url = "/cart/" + short;
    try {
      let res = await fetch(url);
      res = checkStatus(res);
      return res.json();
    } catch (err) {
      handleError();
    }
  }

  /**
   * this function submits the order
   */
  async function submitOrder() {
    let url = "/currentuserid";
    try {
      let res = await fetch(url, {method: "POST"});
      res = checkStatus(res);
      let uid = await res.json();
      let total = parseFloat(id("grand-total").textContent);
      let totalPoints = parseInt(id("subtotal-points").textContent);
      let tax = parseInt(id("tax").textContent);
      let pointsEarned = parseInt(id("points-earned").textContent);
      let params = new FormData();
      params.append("uid", uid);
      params.append("total_price", total);
      params.append("total_points", totalPoints);
      params.append("tax", tax);
      params.append("points_earned", pointsEarned);
      await finalSubmit(params);
    } catch (err) {
      handleError();
    }
  }

  /**
   * this function is used to submit the final order
   * @param {object} params - a FormData object that stores all the parameters required
   */
  async function finalSubmit(params) {
    let url = "/submit";
    try {
      let res = await fetch(url, {method: "POST", body: params});
      res = checkStatus(res);
      let result = await res.text();
      hideView();
      id("success").textContent = result;
      const DELAY = 5000;
      setTimeout(returnToMain, DELAY);
    } catch (err) {
      handleError();
    }
  }

  /**
   * this function returns to the main view
   */
  function returnToMain() {
    id("container").classList.remove("hidden");
    id("container").classList.add("flex");
    id("items-cart").innerHTML = "";
    id("subtotal-price").textContent = 0;
    id("subtotal-points").textContent = 0;
    id("tax").textContent = 0;
    id("points-earned").textContent = 0;
    window.localStorage.setItem("cart", "[]");
  }

  /**
   * this function is used to check whether there is a user who is logged-in
   */
  async function checkLogin() {
    let url = "/checklogin";
    try {
      let res = await fetch(url, {method: "POST"});
      res = checkStatus(res);
      let login = await res.text();
      if (login === "true") {
        id("user-icon").classList.remove("hidden");
      } else {
        id("user-icon").classList.add("hidden");
        hideView();
        let paragraph = gen("p");
        paragraph.textContent = "Please make sure you are signed in to checkout!";
        id("error-container").appendChild(paragraph);
      }
    } catch (err) {
      handleError();
    }
  }

  /**
   * Helper function to handle errors
   */
  function handleError() {
    hideView();
    let paragraph = gen("p");
    paragraph.textContent = ERROR_MESSAGE;
    id("error-container").appendChild(paragraph);
  }

  /**
   * this function is used to hide the main view of this page
   */
  function hideView() {
    id("container").classList.remove("flex");
    id("container").classList.add("hidden");
  }

})();
