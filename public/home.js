"use strict";

/*
 * Name: Stella Lau
 * Date: 08.19.2019
 * Section: CSE 154 AC
 * This is the JavaScript file that gives behaviors to home.html
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
   * initializes the home page of SEAL
   */
  async function init() {
    let url = "/sales";
    try {
      let res = await fetch(url);
      res = checkStatus(res);
      let saleItems = await res.json();
      fetchSales(saleItems);
      id("back").addEventListener("click", backHome);
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
   * this function processes all the products on sale
   * and display them
   * @param {array} saleItems - an array of JSON objects
   * with information about each product on sale
   */
  function fetchSales(saleItems) {
    for (let i = 0; i < saleItems.length; i++) {
      let saleItem = saleItems[i];
      let price = saleItem.price;
      let figure = gen("figure");
      let img = gen("img");
      img.src = IMAGE_URL + saleItem.short + IMAGE_EXTENTION;
      img.alt = saleItem.name;
      let figcaption = gen("figcaption");
      let name = gen("p");
      name.textContent = saleItem.name;
      let originalPrice = gen("p");
      originalPrice.classList.add("original-price");
      originalPrice.textContent = "$" + price + "/" + saleItem.unit;
      let sale = price - saleItem.discount;
      let salePrice = gen("p");
      salePrice.textContent = "$" + sale + "/" + saleItem.unit;
      figcaption.appendChild(name);
      figcaption.appendChild(originalPrice);
      figcaption.appendChild(salePrice);
      figure.appendChild(img);
      figure.appendChild(figcaption);
      figure.addEventListener("click", function() {
        displaySingle(saleItem.short, price, sale, saleItem.name, saleItem.unit);
      });
      qs("#sales div").appendChild(figure);
    }
  }

  /**
   * Helper function to display the single view of the product
   * @param {string} short - short name of the product
   * @param {float} price - original price of the product
   * @param {float} sale - price of the product after discount
   * @param {string} name - name of the product
   * @param {string} unit - unit of the item
   */
  async function displaySingle(short, price, sale, name, unit) {
    let url = "/single/" + short;
    try {
      let res = await fetch(url);
      res = checkStatus(res);
      let item = await res.json();
      id("content").textContent = item.content;
      id("description").textContent = item.description;
      id("original").textContent = price;
      id("sale-price").textContent = sale;
      id("item-image").src = IMAGE_URL + short + IMAGE_EXTENTION;
      id("item-image").alt = name;
      id("item-info").classList.remove("hidden");
      id("item-info").classList.add("flex");
      let units = qsa(".unit");
      for (let i = 0; i < units.length; i++) {
        units[i].textContent = unit;
      }
      hideView();
    } catch (err) {
      handleError();
    }
  }

  /**
   * go back to home view
   */
  function backHome() {
    qs("main > a").classList.remove("hidden");
    id("sales").classList.remove("hidden");
    id("new-workshops").classList.remove("hidden");
    id("local-nav").classList.remove("hidden");
    id("item-info").classList.add("hidden");
    id("item-info").classList.remove("flex");
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
   * Helper function to hide sales and new workshops
   */
  function hideView() {
    qs("main > a").classList.add("hidden");
    id("sales").classList.add("hidden");
    id("new-workshops").classList.add("hidden");
    id("local-nav").classList.add("hidden");
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
