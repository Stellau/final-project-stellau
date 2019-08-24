"use strict";

/*
 * Name: Stella Lau
 * Date: 08.21.2019
 * Section: CSE 154 AC
 * This is the JavaScript file that gives behaviors to rewards.html
 */

(function() {

  const ERROR_MESSAGE = helpers["ERROR_MESSAGE"];
  const IMAGE_URL = helpers["IMAGE_URL"];
  const IMAGE_EXTENTION = helpers["IMAGE_EXTENTION"];
  const id = helpers.id;
  const qs = helpers.qs;
  const qsa = helpers.qsa;
  const gen = helpers.gen;
  const checkStatus = helpers.checkStatus;

  window.addEventListener("load", init);

  /**
   * initializes the rewards page of SEAL
   */
  async function init() {
    let url = "/allGifts";
    try {
      let res = await fetch(url);
      res = checkStatus(res);
      let gifts = await res.json();
      for (let i = 0; i < gifts.length; i++) {
        genPics(gifts[i]);
      }
      id("back").addEventListener("click", back);
      id("add").addEventListener("click", addToCart);
      helpers.createCart();
      checkLogin();
    } catch (err) {
      handleError();
    }
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
      }
    } catch (err) {
      handleError();
    }
  }

  /**
   * this function is used to generate all figures
   * @param {object} item - a JSON object that contains basic information about the item
   */
  function genPics(item) {
    let container = qs("div.image-container");
    let figure = gen("figure");
    let img = gen("img");
    let short = item.short;
    let unit = item.unit;
    img.src = IMAGE_URL + short + IMAGE_EXTENTION;
    img.alt = item.name;
    let figcaption = gen("figcaption");
    let name = gen("p");
    name.textContent = item.name;
    let points = gen("p");
    points.textContent = item.points + " points/" + unit;
    figcaption.appendChild(name);
    figcaption.appendChild(points);
    figure.appendChild(img);
    figure.appendChild(figcaption);
    figure.addEventListener("click", function() {
      displaySingle(points, short, item.name);
    });
    container.appendChild(figure);
  }

  /**
   * display detailed information about the item selected
   * @param {object} points - DOM object that contains price
   * @param {string} short - short name of the gift
   * @param {string} name - name of the gifts
   */
  async function displaySingle(points, short, name) {
    let url = "/gift/" + short;
    try {
      let res = await fetch(url);
      res = checkStatus(res);
      let item = await res.json();
      hideView();
      id("points").textContent = points.textContent;
      id("content").textContent = item.content;
      id("description").textContent = item.description;
      id("item-image").src = IMAGE_URL + short + IMAGE_EXTENTION;
      id("item-image").alt = name;
      id("item-info").classList.remove("hidden");
      id("item-info").classList.add("flex");
    } catch (err) {
      handleError();
    }
  }

  /**
   * Helper function to hide the items
   */
  function hideView() {
    id("option1").classList.add("hidden");
    id("option2").classList.add("hidden");
    id("option3").classList.add("hidden");
    id("option4").classList.add("hidden");
    qs("div.image-container").classList.remove("flex");
    qs("div.image-container").classList.add("hidden");
    id("local-nav").classList.add("hidden");
    let messages = qsa("main > p");
    for (let i = 0; i < messages.length; i++) {
      messages[i].classList.add("hidden");
    }
  }

  /**
   * Go back to main view
   */
  function back() {
    id("option1").classList.remove("hidden");
    id("option2").classList.remove("hidden");
    id("option3").classList.remove("hidden");
    id("option4").classList.remove("hidden");
    qs("div.image-container").classList.remove("hidden");
    qs("div.image-container").classList.add("flex");
    let messages = qsa("main > p");
    for (let i = 0; i < messages.length; i++) {
      messages[i].classList.remove("hidden");
    }
    id("item-info").classList.remove("flex");
    id("item-info").classList.add("hidden");
  }

  /**
   * adds the item to cart
   */
  function addToCart() {
    let cart = window.localStorage.getItem("cart");
    cart = JSON.parse(cart);
    let imageSource = id("item-image").src;
    let startIndex = imageSource.lastIndexOf("/") + 1;
    let endIndex = imageSource.length - IMAGE_EXTENTION.length;
    let short = imageSource.substring(startIndex, endIndex);
    if (!inCart(cart, short)) {
      cart.push({"short": short, "qty": 1});
    } else {
      cart = updateCart(cart, short);
    }
    cart = JSON.stringify(cart);
    window.localStorage.setItem("cart", cart);
  }

  /**
   * update the cart by increasing the qty of the item
   * @param {array} cart - an array of json items in the cart
   * @param {string} short - short of the item
   * @returns {array} - the updated cart
   */
  function updateCart(cart, short) {
    for (let i = 0; i < cart.length; i++) {
      if (cart[i].short === short) {
        cart[i].qty += 1;
      }
    }
    return cart;
  }

  /**
   * checks if the item is already in cart
   * @param {array} cart - an array of json items in the cart
   * @param {string} short - short of the item
   * @returns {boolean} - whether the item is in cart already
   */
  function inCart(cart, short) {
    for (let i = 0; i < cart.length; i++) {
      if (cart[i].short === short) {
        return true;
      }
    }
    return false;
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

})();
