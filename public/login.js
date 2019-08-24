"use strict";

/*
 * Name: Stella Lau
 * Date: 08.22.2019
 * Section: CSE 154 AC
 * This is the JavaScript file that gives behaviors to login.html
 */

(function() {

  window.addEventListener("load", init);
  const id = helpers.id;
  const gen = helpers.gen;
  const qsa = helpers.qsa;
  const checkStatus = helpers.checkStatus;
  const ERROR_MESSAGE = helpers["ERROR_MESSAGE"];

  /**
   * this function is used to addEventListener to the sign up form
   */
  function init() {
    checkLogin();
    id("sign-up-form").addEventListener("submit", (evt) => {
      evt.preventDefault();
      signUp();
    });
    id("log-in-form").addEventListener("submit", (evt) => {
      evt.preventDefault();
      logIn();
    });
    id("already-btn").addEventListener("click", displayLogIn);
    id("log-out").addEventListener("click", logOut);
    helpers.createCart();
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
        hideView();
        getCurrentUser();
      } else {
        id("user-icon").classList.add("hidden");
      }
    } catch (err) {
      handleError();
    }
  }

  /**
   * this function is used to get the current user's information
   */
  async function getCurrentUser() {
    let url = "/currentuser";
    try {
      let res = await fetch(url, {method: "POST"});
      res = checkStatus(res);
      let result = await res.json();
      setUserInfo(result);
    } catch (err) {
      handleError();
    }
  }

  /**
   * this function is used to sign up the user
   */
  async function signUp() {
    let data = new FormData(id("sign-up-form"));
    let url = "/signup";
    try {
      let res = await fetch(url, {method: "POST", body: data});
      res = checkStatus(res);
      let result = await res.text();
      id("success-signup").textContent = result;
    } catch (err) {
      handleError();
    }
  }

  /**
   * this funciton is used to log in a user
   */
  async function logIn() {
    let data = new FormData(id("log-in-form"));
    let url = "/login";
    try {
      let res = await fetch(url, {method: "POST", body: data});
      res = checkStatus(res);
      let result = await res.json();
      setUserInfo(result);
      id("welcome").classList.remove("hidden");
      id("user-icon").classList.remove("hidden");
    } catch (err) {
      handleError();
    }
  }

  /**
   * this function is used to log out the user
   */
  async function logOut() {
    let url = "/logout";
    try {
      let res = await fetch(url, {method: "POST"});
      res = checkStatus(res);
      let result = await res.text();
      id("logout-message").textContent = result;
      id("points").textContent = "";
      id("user-email").textContent = "";
      id("user-phone").textContent = "";
      id("welcome").classList.add("hidden");
      id("user-icon").classList.add("hidden");
      let userInfo = qsa("input");
      for (let i = 0; i < userInfo.length; i++) {
        userInfo[i].value = "";
      }
      id("user-info").classList.remove("flex");
      id("user-info").classList.add("hidden");
      id("log-out").classList.add("hidden");
      window.localStorage.setItem("cart", "[]");
      const DELAY = 5000;
      setTimeout(returnToMain, DELAY);
    } catch (err) {
      handleError();
    }
  }

  /**
   * function to switch from log out view to main view
   */
  function returnToMain() {
    id("logout-message").textContent = "";
    id("sign-up").classList.remove("hidden");
  }

  /**
   * this function is used to set up the user's information section
   * @param {JSON} result - a JSON object that contains the user's information
   */
  function setUserInfo(result) {
    hideView();
    id("points").textContent = result.points;
    id("user-email").textContent = result.email;
    id("user-phone").textContent = result.phone_number;
    id("user-info").classList.remove("hidden");
    id("user-info").classList.add("flex");
    id("log-out").classList.remove("hidden");
  }

  /**
   * this function is used to display the sign-in view
   */
  function displayLogIn() {
    id("log-in").classList.remove("hidden");
  }

  /**
   * this function is used to handle all errors that occur on this page
   */
  function handleError() {
    hideView();
    let paragraph = gen("p");
    paragraph.textContent = ERROR_MESSAGE;
    id("error-container").appendChild(paragraph);
  }

  /**
   * this helper function is used to hide sections of this page
   * when something goes wrong
   */
  function hideView() {
    id("sign-up").classList.add("hidden");
    id("log-in").classList.add("hidden");
  }

})();
