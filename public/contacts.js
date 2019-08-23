"use strict";

/*
 * Name: Stella Lau
 * Date: 08.22.2019
 * Section: CSE 154 AC
 * This is the JavaScript file that gives behaviors to contacts.html
 */

(function() {

  window.addEventListener("load", init);
  const id = helpers.id;
  const checkStatus = helpers.checkStatus;
  const qsa = helpers.qsa;
  const gen = helpers.gen;
  const ERROR_MESSAGE = helpers["ERROR_MESSAGE"];
  const DELAY = 5000;

  /**
   * this function is used to addEventListener to the contact form
   */
  function init() {
    checkLogin();
    id("guest-contact").addEventListener("submit", (evt) => {
      evt.preventDefault();
      submitGuestForm();
    });
    id("user-contact").addEventListener("submit", (evt) => {
      evt.preventDefault();
      submitUserForm();
    });
  }

  /**
   * this function is used to check whether there is a user who is logged-in
   * @returns {boolean} - whether there is a user logged in or not
   */
  async function checkLogin() {
    let url = "/checklogin";
    try {
      let res = await fetch(url, {method: "POST"});
      res = checkStatus(res);
      let login = await res.text();
      if (login === "true") {
        id("user-icon").classList.remove("hidden");
        id("guest").classList.add("hidden");
        id("user").classList.remove("hidden");
        return true;
      }
      id("user-icon").classList.add("hidden");
      return false;
    } catch (err) {
      handleError();
    }
  }

  /**
   * submits the guest contacts form to SEAL
   */
  async function submitGuestForm() {
    let data = new FormData(id("guest-contact"));
    let url = "/contacts";
    try {
      let res = await fetch(url, {method: "POST", body: data});
      res = checkStatus(res);
      let message = await res.text();
      hideView();
      id("success-message").textContent = message;
      setTimeout(returnToMain, DELAY);
    } catch (err) {
      handleError();
    }
  }

  /**
   * submits the user contacts form to SEAL
   */
  async function submitUserForm() {
    let data = new FormData(id("user-contact"));
    let url = "/user/contacts";
    try {
      let res = await fetch(url, {method: "POST", body: data});
      res = checkStatus(res);
      let message = await res.text();
      hideView();
      id("success-message").textContent = message;
      setTimeout(returnToMain, DELAY);
    } catch (err) {
      handleError();
    }
  }

  /**
   * returns to the main view
   */
  function returnToMain() {
    id("success-message").textContent = "";
    clearInput();
    if (!checkLogin()) {
      let sections = qsa("main > section");
      for (let i = 0; i < sections.length; i++) {
        sections[i].classList.remove("hidden");
      }
    }
  }

  /**
   * clear the previous user input
   */
  function clearInput() {
    let inputs = qsa("input");
    for (let i = 0; i < inputs.length; i++) {
      inputs[i].value = "";
    }
    let textareas = qsa("textarea");
    for (let j = 0; j < textareas.length; j++) {
      textareas[j].value = "";
    }
  }

  /**
   * hides everything on this page
   */
  function hideView() {
    let sections = qsa("main > section");
    for (let i = 0; i < sections.length; i++) {
      sections[i].classList.add("hidden");
    }
  }

  /**
   * this function is used to handle errors when they occur
   */
  function handleError() {
    hideView();
    let paragraph = gen("p");
    paragraph.textContent = ERROR_MESSAGE;
    id("error-container").appendChild(paragraph);
  }

})();
