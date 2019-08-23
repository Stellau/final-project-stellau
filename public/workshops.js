"use strict";

/*
 * Name: Stella Lau
 * Date: 08.22.2019
 * Section: CSE 154 AC
 * This is the JavaScript file that gives behaviors to workshops.html
 */

(function() {

  const id = helpers.id;
  const qs = helpers.qs;
  const gen = helpers.gen;
  const checkStatus = helpers.checkStatus;
  const ERROR_MESSAGE = helpers["ERROR_MESSAGE"];

  window.addEventListener("load", init);

  /**
   * this function is used to initialize workshops.html
   */
  function init() {
    helpers.createCart();
    checkLogin();
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
   * this function is used to hide the main view of this page
   */
  function hideView() {
    qs("main > p").classList.add("hidden");
    id("local-nav").classList.add("hidden");
    id("goat-yoga").classList.add("hidden");
    id("tart").classList.add("hidden");
    id("hiking").classList.add("hidden");
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
