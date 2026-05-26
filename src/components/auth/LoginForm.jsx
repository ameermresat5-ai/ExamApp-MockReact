import { useState } from "react";
import { authService } from "../../services/AuthService";

function LoginForm({ onLogin, onGoToRegister }) {
  const [email, setEmail] = useState("teacher@example.com");
  const [password, setPassword] = useState("123456");
  const [error, setError] = useState("");

  function handleSubmit(event) {
    event.preventDefault();

    const user = authService.login(email, password);

    if (!user) {
      setError("Invalid email or password");
      return;
    }

    setError("");
    onLogin(user);
  }

  return (
    <form className="form-card" onSubmit={handleSubmit}>
      <h2>Login</h2>

      <label>Email</label>
      <input
        type="email"
        value={email}
        onChange={(event) => setEmail(event.target.value)}
        required
      />

      <label>Password</label>
      <input
        type="password"
        value={password}
        onChange={(event) => setPassword(event.target.value)}
        required
      />

      {error && <p className="error-message">{error}</p>}

      <button type="submit">Login</button>

      <p className="small-text">
        Do not have an account?
        <button type="button" className="link-button" onClick={onGoToRegister}>
          Register
        </button>
      </p>

      <div className="demo-box">
        <p><strong>Demo Teacher:</strong> teacher@example.com / 123456</p>
        <p><strong>Demo Student:</strong> student@example.com / 123456</p>
      </div>
    </form>
  );
}

export default LoginForm;
