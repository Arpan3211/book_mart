import Login from "../../components/Login.js";
import Register from "../../components/Register.js";
import { loginUser, registerUser } from "./api.js";

document.addEventListener("DOMContentLoaded", () => {
  const authContainerWrapper = document.querySelector(
    ".auth-container-wrapper"
  );

  function showLoginForm() {
    authContainerWrapper.innerHTML = Login();
    addEventListeners();
  }

  function showRegisterForm() {
    authContainerWrapper.innerHTML = Register();
    addEventListeners();
  }

  showLoginForm();

  function addEventListeners() {
    const showRegister = document.getElementById("show-register");
    const showLogin = document.getElementById("show-login");

    if (showRegister)
      showRegister.addEventListener("click", (e) => {
        e.preventDefault();
        showRegisterForm();
      });

    if (showLogin)
      showLogin.addEventListener("click", (e) => {
        e.preventDefault();
        showLoginForm();
      });

    const loginForm = document.getElementById("login-form");
    if (loginForm) {
      loginForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        const email = document.getElementById("login-email").value.trim();
        const password = document.getElementById("login-password").value.trim();

        if (!email || !password) {
          alert("Please enter both email and password.");
          return;
        }

        await loginUser(email, password);
      });
    }

    const registerForm = document.getElementById("register-form");
    if (registerForm) {
      registerForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        const name = document.getElementById("register-name").value.trim();
        const email = document.getElementById("register-email").value.trim();
        const password = document
          .getElementById("register-password")
          .value.trim();

        if (!name || !email || !password) {
          alert("All fields are required.");
          return;
        }

        const isRegistered = await registerUser(name, email, password);
        if (isRegistered) showLoginForm();
      });
    }
  }
});
