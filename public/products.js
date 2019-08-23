"use strict";

/*
 * Name: Stella Lau
 * Date: 08.19.2019
 * Section: CSE 154 AC
 * This is the JavaScript file that gives behaviors to products.html
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
   * initializes the products page of SEAL
   */
  async function init() {
    let food = "/allFoods";
    let apparel = "/allApparels";
    try {
      let res = await fetch(food);
      res = checkStatus(res);
      let foods = await res.json();
      fetchAllFoods(foods);
      let resApparels = await fetch(apparel);
      resApparels = checkStatus(resApparels);
      let apparels = await resApparels.json();
      fetchAllClothes(apparels);
      id("back").addEventListener("click", back);
      id("add").addEventListener("click", addToCart);
      qs("select").addEventListener("change", filterProducts);
      id("search").addEventListener("click", searchProducts);
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
   * search the products that match the keywords
   */
  async function searchProducts() {
    let term = id("search-item").value;
    displayHiddenProducts();
    if (term) {
      let url = "/search/" + term;
      try {
        let res = await fetch(url);
        res = checkStatus(res);
        let items = await res.json();
        filterDisplay(items);
      } catch (err) {
        handleError();
      }
    }
  }

  /**
   * filters the products when the select changes
   */
  async function filterProducts() {
    let range = this.value;
    displayHiddenProducts();
    if (range) {
      let url = "/price/" + range;
      try {
        let res = await fetch(url);
        res = checkStatus(res);
        let items = await res.json();
        filterDisplay(items);
      } catch (err) {
        handleError();
      }
    }
  }

  /**
   * function to display hidden when products are not filtered
   */
  function displayHiddenProducts() {
    let hiddenTitles = qsa("h2.hidden");
    for (let i = 0; i < hiddenTitles.length; i++) {
      hiddenTitles[i].classList.remove("hidden");
    }
    let hiddenProducts = qsa("figure.hidden");
    for (let j = 0; j < hiddenProducts.length; j++) {
      hiddenProducts[j].classList.remove("hidden");
    }
  }

  /**
   * only display the items that match the price range indicated
   * @param {array} items - an array of products that matches the price range
   */
  function filterDisplay(items) {
    let categoryTitles = qsa("main > section > h2");
    for (let j = 0; j < categoryTitles.length; j++) {
      categoryTitles[j].classList.add("hidden");
    }
    let allProducts = qsa("figure");
    for (let i = 0; i < allProducts.length; i++) {
      let product = allProducts[i];
      let short = product.id;
      if (!items.includes(short)) {
        product.classList.add("hidden");
      }
    }
  }

  /**
   * this function processes all the simple data of products
   * that are foods
   * @param {json} foods - JSON object that contains basic
   * information about all of the foods
   */
  function fetchAllFoods(foods) {
    let categories = Object.keys(foods);
    for (let i = 0; i < categories.length; i++) {
      let category = categories[i];
      fetchFoods(foods[category], category);
    }
  }

  /**
   * this function processes all the simple data of clothes
   * @param {json} apparels - JSON object that contains basic
   * information about all of the clothes
   */
  function fetchAllClothes(apparels) {
    let categories = Object.keys(apparels);
    for (let i = 0; i < categories.length; i++) {
      let category = categories[i];
      fetchApparels(apparels[category], category);
    }
  }

  /**
   * this function processes all the simple data of apparels
   * by category
   * @param {array} apparels - an array of JSON objects containing
   * clothes in the category given
   * @param {string} category - the category name given
   */
  function fetchApparels(apparels, category) {
    let uniqueClothes = [];
    let container = qs("#" + category + " div");
    for (let i = 0; i < apparels.length; i++) {
      let item = apparels[i];
      let name = item.name;
      if (!uniqueClothes.includes(name)) {
        uniqueClothes.push(name);
        genPics(item, container);
      }
    }
  }

  /**
   * this function processes all the simple data of foods
   * by category
   * @param {array} foods - an array of JSON objects containing
   * foods in the category given
   * @param {string} category - the category name given
   */
  function fetchFoods(foods, category) {
    let container = qs("#" + category + " div");
    for (let i = 0; i < foods.length; i++) {
      let item = foods[i];
      genPics(item, container);
    }
  }

  /**
   * function to generate figure for each food
   * @param {JSON} item - an JSON object containing all information about
   * @param {object} container - DOM object that will hold the item figure
   * the item
   */
  function genPics(item, container) {
    let figure = gen("figure");
    let img = gen("img");
    let short = item.short;
    let unit = item.unit;
    img.src = IMAGE_URL + short + IMAGE_EXTENTION;
    img.alt = item.name;
    let figcaption = gen("figcaption");
    let name = gen("p");
    name.textContent = item.name;
    let originalPrice = gen("p");
    let price = item.price;
    let salePrice;
    if (item.sales) {
      originalPrice.classList.add("original-price");
      let sale = price - item.discount;
      salePrice = gen("p");
      salePrice.textContent = "$" + sale + "/" + unit;
    }
    originalPrice.textContent = "$" + price + "/" + unit;
    figcaption.appendChild(name);
    figcaption.appendChild(originalPrice);
    checkSales(salePrice, figcaption);
    figure.id = short;
    figure.appendChild(img);
    figure.appendChild(figcaption);
    addClick(figure, salePrice, originalPrice, short, item.name, item.category);
    container.appendChild(figure);
  }

  /**
   * Helper function to addEventListeners to the figures
   * @param {object} figure - a figure object to addEventListener to
   * @param {object} salePrice - a paragraph with sale price in it if sales
   * @param {object} originalPrice - a paragraph with the original price in it
   * @param {string} short - short of the item
   * @param {string} name - name of the item
   * @param {string} category - category of the item
   */
  function addClick(figure, salePrice, originalPrice, short, name, category) {
    figure.addEventListener("click", function() {
      displaySingle(salePrice, originalPrice, short, name, category);
    });
  }

  /**
   * display single view of the product
   * @param {object} salePrice - a paragraph with sale price in it if sales
   * @param {object} originalPrice - a paragraph with the original price in it
   * @param {string} short - short of the item
   * @param {string} name - name of the item
   * @param {string} category - category of the item
   */
  async function displaySingle(salePrice, originalPrice, short, name, category) {
    let url = "/single/" + short;
    try {
      let res = await fetch(url);
      res = checkStatus(res);
      let item = await res.json();
      id("original").textContent = originalPrice.textContent;
      if (salePrice) {
        id("original").classList.add("original-price");
        id("sale-price").textContent = salePrice.textContent;
      } else {
        id("original").classList.remove("original-price");
        id("sale-price").textContent = "";
      }
      id("content").textContent = item.content;
      id("description").textContent = item.description;
      id("item-image").src = IMAGE_URL + short + IMAGE_EXTENTION;
      id("item-image").alt = name;
      id("item-info").classList.remove("hidden");
      id("item-info").classList.add("flex");
      hideView();
      if (category) {
        fetchRadio(name);
      }
    } catch (err) {
      handleError();
    }
  }

  /**
   * Helper function to add radio button to the HTML page
   * @param {string} name - name of the product
   */
  async function fetchRadio(name) {
    let url = "/color/" + name;
    try {
      let res = await fetch(url);
      res = checkStatus(res);
      let colors = await res.json();
      let colorRadio = id("color-radio");
      colorRadio.innerHTML = "";
      setUpRadio(colors, colorRadio);
    } catch (err) {
      handleError();
    }
  }

  /**
   * this helper function is used to set up the radio buttons
   * @param {array} colors - an array of color options for the item
   * @param {object} colorRadio - DOM object, a container for the radio buttons
   */
  function setUpRadio(colors, colorRadio) {
    let originalDisplay = getCurrentColor();
    for (let i = 0; i < colors.length; i++) {
      let color = colors[i];
      let lowerColor = color.toLowerCase();
      let div = gen("div");
      let input = gen("input");
      input.type = "radio";
      input.id = lowerColor;
      input.name = "color";
      input.value = lowerColor;
      input = checkRadio(originalDisplay, lowerColor, input);
      input.addEventListener("change", fetchCorrectColor);
      let label = gen("label");
      label.for = lowerColor;
      label.textContent = color;
      div.appendChild(input);
      div.appendChild(label);
      colorRadio.appendChild(div);
    }
  }

  /**
   * this function is used to change the color of the item displayed
   * when the radio button is changed
   */
  function fetchCorrectColor() {
    let image = id("item-image");
    let imageSrc = image.src;
    let currentColor = getCurrentColor();
    let correctColor = this.value;
    image.src = imageSrc.replace(currentColor, correctColor);
  }

  /**
   * helper functio to get the original color of an item
   * @returns {string} - current color of the product
   */
  function getCurrentColor() {
    let imageSource = id("item-image").src;
    let startIndex = imageSource.lastIndexOf("-") + 1;
    let endIndex = imageSource.length - IMAGE_EXTENTION.length;
    return imageSource.substring(startIndex, endIndex);
  }

  /**
   * helper function to check radio buttons features
   * @param {string} originalDisplay - original color displayed
   * @param {string} lowerColor - color that the input represents
   * @param {object} input - DOM input, radio button
   * @returns {object} - a radio button checked
   */
  function checkRadio(originalDisplay, lowerColor, input) {
    if (originalDisplay === lowerColor) {
      input.checked = true;
    }
    return input;
  }

  /**
   * Helper function to check if there is a sale price to display
   * @param {object} salePrice - an object that contains sale price
   * @param {object} figcaption - a figure caption
   * @returns {boolean} - whether the item is on sale or not
   */
  function checkSales(salePrice, figcaption) {
    if (salePrice) {
      figcaption.appendChild(salePrice);
      return true;
    }
    return false;
  }

  /**
   * Helper function to hide the items
   */
  function hideView() {
    let categories = qsa("section.category");
    for (let i = 0; i < categories.length; i++) {
      categories[i].classList.add("hidden");
    }
    id("filter-search").classList.remove("flex");
    id("filter-search").classList.add("hidden");
    id("local-nav").classList.add("hidden");
  }

  /**
   * function to go back to the products' view
   */
  function back() {
    let categories = qsa("section.category");
    for (let i = 0; i < categories.length; i++) {
      categories[i].classList.remove("hidden");
    }
    id("filter-search").classList.remove("hidden");
    id("filter-search").classList.add("flex");
    id("local-nav").classList.remove("hidden");
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
