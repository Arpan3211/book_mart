import Login from "../../components/Login.js";
import Register from "../../components/Register.js";
import { loginUser, registerUser } from "./api.js";
import { showToast } from "../../components/toast.js";

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

  // Validate email format
  function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  // Check password strength
  function checkPasswordStrength(password) {
    let strength = 0;
    const feedback = {
      isValid: false,
      hasLength: password.length >= 6,
      hasUpperCase: /[A-Z]/.test(password),
      hasLowerCase: /[a-z]/.test(password),
      hasNumber: /\d/.test(password),
      hasSpecialChar: /[!@#$%^&*(),.?":{}|<>]/.test(password)
    };

    if (feedback.hasLength) strength += 1;
    if (feedback.hasUpperCase) strength += 1;
    if (feedback.hasLowerCase) strength += 1;
    if (feedback.hasNumber) strength += 1;
    if (feedback.hasSpecialChar) strength += 1;

    feedback.strength = strength;
    feedback.isValid = feedback.hasLength && feedback.hasUpperCase &&
                      feedback.hasLowerCase && feedback.hasNumber;

    return feedback;
  }

  // Update password strength UI
  function updatePasswordStrengthUI(password) {
    const strengthBar = document.getElementById("password-strength-bar");
    const lengthCheck = document.getElementById("length-check");
    const uppercaseCheck = document.getElementById("uppercase-check");
    const lowercaseCheck = document.getElementById("lowercase-check");
    const numberCheck = document.getElementById("number-check");

    if (!strengthBar) return;

    const feedback = checkPasswordStrength(password);

    // Update strength bar
    let percentage = (feedback.strength / 5) * 100;
    strengthBar.style.width = `${percentage}%`;

    // Set color based on strength
    if (percentage <= 20) {
      strengthBar.style.backgroundColor = "#ff4d4d"; // Red
    } else if (percentage <= 40) {
      strengthBar.style.backgroundColor = "#ffa64d"; // Orange
    } else if (percentage <= 60) {
      strengthBar.style.backgroundColor = "#ffff4d"; // Yellow
    } else if (percentage <= 80) {
      strengthBar.style.backgroundColor = "#4dff4d"; // Light green
    } else {
      strengthBar.style.backgroundColor = "#26e626"; // Green
    }

    // Update requirement checks
    lengthCheck.classList.toggle("passed", feedback.hasLength);
    uppercaseCheck.classList.toggle("passed", feedback.hasUpperCase);
    lowercaseCheck.classList.toggle("passed", feedback.hasLowerCase);
    numberCheck.classList.toggle("passed", feedback.hasNumber);

    return feedback.isValid;
  }

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

    // Login form validation and submission
    const loginForm = document.getElementById("login-form");
    if (loginForm) {
      const loginEmail = document.getElementById("login-email");
      const loginPassword = document.getElementById("login-password");
      const loginEmailError = document.getElementById("login-email-error");
      const loginPasswordError = document.getElementById("login-password-error");
      const loginFormError = document.getElementById("login-form-error");

      // Email validation
      loginEmail?.addEventListener("input", () => {
        const email = loginEmail.value.trim();
        if (!email) {
          loginEmailError.textContent = "Email is required";
        } else if (!isValidEmail(email)) {
          loginEmailError.textContent = "Please enter a valid email address";
        } else {
          loginEmailError.textContent = "";
        }
      });

      // Password validation
      loginPassword?.addEventListener("input", () => {
        const password = loginPassword.value.trim();
        if (!password) {
          loginPasswordError.textContent = "Password is required";
        } else {
          loginPasswordError.textContent = "";
        }
      });

      loginForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        loginFormError.textContent = "";

        const email = loginEmail.value.trim();
        const password = loginPassword.value.trim();
        let isValid = true;

        // Validate email
        if (!email) {
          loginEmailError.textContent = "Email is required";
          isValid = false;
        } else if (!isValidEmail(email)) {
          loginEmailError.textContent = "Please enter a valid email address";
          isValid = false;
        } else {
          loginEmailError.textContent = "";
        }

        // Validate password
        if (!password) {
          loginPasswordError.textContent = "Password is required";
          isValid = false;
        } else {
          loginPasswordError.textContent = "";
        }

        if (isValid) {
          try {
            await loginUser(email, password);
          } catch (error) {
            loginFormError.textContent = error.message || "Login failed. Please try again.";
          }
        }
      });
    }

    // Register form validation and submission
    const registerForm = document.getElementById("register-form");
    if (registerForm) {
      const nameInput = document.getElementById("register-name");
      const emailInput = document.getElementById("register-email");
      const passwordInput = document.getElementById("register-password");
      const nameError = document.getElementById("name-error");
      const emailError = document.getElementById("email-error");
      const passwordError = document.getElementById("password-error");
      const formError = document.getElementById("form-error");

      // Name validation
      nameInput?.addEventListener("input", () => {
        const name = nameInput.value.trim();
        if (!name) {
          nameError.textContent = "Name is required";
        } else if (name.length < 2) {
          nameError.textContent = "Name must be at least 2 characters long";
        } else if (name.length > 50) {
          nameError.textContent = "Name cannot exceed 50 characters";
        } else {
          nameError.textContent = "";
        }
      });

      // Email validation
      emailInput?.addEventListener("input", () => {
        const email = emailInput.value.trim();
        if (!email) {
          emailError.textContent = "Email is required";
        } else if (!isValidEmail(email)) {
          emailError.textContent = "Please enter a valid email address";
        } else {
          emailError.textContent = "";
        }
      });

      // Password validation with strength meter
      passwordInput?.addEventListener("input", () => {
        const password = passwordInput.value.trim();
        if (!password) {
          passwordError.textContent = "Password is required";
          return;
        }

        const isValid = updatePasswordStrengthUI(password);

        if (!isValid) {
          passwordError.textContent = "Password doesn't meet the requirements";
        } else {
          passwordError.textContent = "";
        }
      });

      registerForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        formError.textContent = "";

        const name = nameInput.value.trim();
        const email = emailInput.value.trim();
        const password = passwordInput.value.trim();
        let isValid = true;

        // Validate name
        if (!name) {
          nameError.textContent = "Name is required";
          isValid = false;
        } else if (name.length < 2) {
          nameError.textContent = "Name must be at least 2 characters long";
          isValid = false;
        } else if (name.length > 50) {
          nameError.textContent = "Name cannot exceed 50 characters";
          isValid = false;
        } else {
          nameError.textContent = "";
        }

        // Validate email
        if (!email) {
          emailError.textContent = "Email is required";
          isValid = false;
        } else if (!isValidEmail(email)) {
          emailError.textContent = "Please enter a valid email address";
          isValid = false;
        } else {
          emailError.textContent = "";
        }

        // Validate password
        if (!password) {
          passwordError.textContent = "Password is required";
          isValid = false;
        } else {
          const passwordValidation = checkPasswordStrength(password);
          if (!passwordValidation.isValid) {
            passwordError.textContent = "Password doesn't meet the requirements";
            isValid = false;
          } else {
            passwordError.textContent = "";
          }
        }

        if (isValid) {
          try {
            const isRegistered = await registerUser(name, email, password);
            if (isRegistered) {
              showToast("Registration successful! Please log in.", "success");
              showLoginForm();
            }
          } catch (error) {
            formError.textContent = error.message || "Registration failed. Please try again.";
          }
        }
      });
    }
  }
});
