"use strict";

/*
 * Name: Stella Lau
 * Date: 08.20.2019
 * Section: CSE 154 AC
 * This is the JavaScript file that is a helper module for my JavaScript
 * files. Melissa taught me this and said it is okay to use it.
 */

let helpers = {

  ERROR_MESSAGE: "Something is wrong, please try again later!",

  IMAGE_URL: "img/",

  IMAGE_EXTENTION: ".png",

  /**
   * Returns the element that has the ID attribute with the specified value.
   * @param {string} idName - element ID
   * @returns {object} DOM object associated with id.
   */
  id: function(idName) {
    return document.getElementById(idName);
  },

  /**
   * Returns the first element that matches the given CSS selector.
   * @param {string} selector - CSS query selector.
   * @returns {object} The first DOM object matching the query.
   */
  qs: function(selector) {
    return document.querySelector(selector);
  },

  /**
   * Returns the array of elements that match the given CSS selector.
   * @param {string} selector - CSS query selector
   * @returns {object[]} array of DOM objects matching the query.
   */
  qsa: function(selector) {
    return document.querySelectorAll(selector);
  },

  /**
   * Returns a new element with the given tag name.
   * @param {string} tagName - HTML tag name for new DOM element.
   * @returns {object} New DOM object for given HTML tag.
   */
  gen: function(tagName) {
    return document.createElement(tagName);
  },

  /**
   * Creates localstorage to add items to cart
   */
  createCart: function() {
    if (!window.localStorage.getItem("cart")) {
      window.localStorage.setItem("cart", "[]");
    }
  },

  /**
   * Helper function to return the response's result text if successful, otherwise
   * returns the rejected Promise result with an error status and corresponding text
   * @param {object} response - response to check for success/error
   * @returns {object} - Response if status code is ok (200-level)
   */
  checkStatus: function(response) {
    if (!response.ok) {
      throw Error("Error in request: " + response.statusText);
    }
    return response;
  }

};
