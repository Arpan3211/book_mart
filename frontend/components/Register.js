export default function Register(showLoginForm) {
  return `
        <div class="auth-container">
            <h2>Register</h2>
            <form id="register-form" class="register-form-section">
                <input type="text" id="register-name" placeholder="Enter Name" required />
                <input type="email" id="register-email" placeholder="Enter Email" required />
                <input type="password" id="register-password" placeholder="Enter Password" required />
                <button type="submit">Register</button>
            </form>
            <p>Already have an account? <a href="#" id="show-login">Login</a></p>
        </div>
    `;
}
