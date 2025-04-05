export default function Login(showRegisterForm) {
  return `
        <div class="auth-container">
            <h2>Login</h2>
            <form id="login-form" class="login-form-section">
                <div class="form-group">
                    <input type="email" id="login-email" placeholder="Enter Email" required />
                    <div class="error-message" id="login-email-error"></div>
                </div>

                <div class="form-group">
                    <input type="password" id="login-password" placeholder="Enter Password" required />
                    <div class="error-message" id="login-password-error"></div>
                </div>

                <button type="submit" id="login-button">Login</button>
                <div class="form-error" id="login-form-error"></div>
            </form>
            <p>Don't have an account? <a href="#" id="show-register">Register</a></p>
        </div>
    `;
}
