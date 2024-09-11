
let activeDiv = null;

// keep track of active div, so we know which div to show or not show
export const setDiv = (newDiv) => {
  if (newDiv != activeDiv) {
    if (activeDiv) {
      activeDiv.style.display = "none";
    }
    newDiv.style.display = "block";
    activeDiv = newDiv;
  }
};

// enabling and disabling input
export let inputEnabled = true;
export const enableInput = (state) => {
  inputEnabled = state;
};


export let token = null;

// keep track wheter use is logged in

export const setToken = (value) => {
  token = value;
  if (value) {
    localStorage.setItem("token", value);
  } else {
    //if the function is called with a null token, we remove the token from local storage
    localStorage.removeItem("token");
  }
};

// When the user takes actions we may want to display a message on the page. We store the value of that message here in the index script in the message variable,
export let message = null;

import { showEvents, handleEvents } from "./jobs.js";
import { showLoginRegister, handleLoginRegister } from "./loginRegister.js";
import { handleLogin } from "./login.js";
import { handleAddEdit } from "./addEdit.js";
import { handleRegister } from "./register.js";

document.addEventListener("DOMContentLoaded", () => {
  token = localStorage.getItem("token");
  message = document.getElementById("message");
  handleLoginRegister();
  handleLogin();
  handleEvents();
  handleRegister();
  handleAddEdit();
  if (token) {
    showEvents();
  } else {
    showLoginRegister();
  }
});
