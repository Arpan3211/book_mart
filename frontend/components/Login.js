export default function Login(showRegisterForm) {
  return `
        <div class="auth-container">
            <h2>Login</h2>
            <form id="login-form" class="login-form-section">
                <input type="email" id="login-email" placeholder="Enter Email" required />
                <input type="password" id="login-password" placeholder="Enter Password" required />
                <button type="submit">Login</button>
            </form>
            <p>Don't have an account? <a href="#" id="show-register">Register</a></p>
        </div>
    `;
}
