export default function Register(showLoginForm) {
  return `
        <div class="auth-container">
            <h2>Register</h2>
            <form id="register-form" class="register-form-section">
                <div class="form-group">
                    <input type="text" id="register-name" placeholder="Enter Name" required minlength="2" maxlength="50" />
                    <div class="error-message" id="name-error"></div>
                </div>

                <div class="form-group">
                    <input type="email" id="register-email" placeholder="Enter Email" required />
                    <div class="error-message" id="email-error"></div>
                </div>

                <div class="form-group">
                    <input type="password" id="register-password" placeholder="Enter Password" required minlength="6" />
                    <div class="error-message" id="password-error"></div>
                    <div class="password-strength-meter">
                        <div class="strength-bar" id="password-strength-bar"></div>
                    </div>
                    <div class="password-requirements">
                        Password must contain at least:
                        <ul>
                            <li id="length-check">6 characters</li>
                            <li id="uppercase-check">One uppercase letter</li>
                            <li id="lowercase-check">One lowercase letter</li>
                            <li id="number-check">One number</li>
                        </ul>
                    </div>
                </div>

                <button type="submit" id="register-button">Register</button>
                <div class="form-error" id="form-error"></div>
            </form>
            <p>Already have an account? <a href="#" id="show-login">Login</a></p>
        </div>
    `;
}
