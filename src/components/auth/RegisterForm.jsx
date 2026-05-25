import { useState } from "react";
import { authService } from "../../services/AuthService";

function RegisterForm({ onRegister, onGoToLogin }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("student");
  const [error, setError] = useState("");

  function handleSubmit(event) {
    event.preventDefault();

    if (password.length < 4) {
      setError("Password must be at least 4 characters");
      return;
    }

    const user = authService.register({
      name,
      email,
      password,
      role
    });

    if (!user) {
      setError("Email already exists");
      return;
    }

    setError("");
    onRegister(user);
  }

  return (
    <form className="form-card" onSubmit={handleSubmit}>
      <h2>Register</h2>

      <label>Full Name</label>
      <input
        type="text"
        value={name}
        onChange={(event) => setName(event.target.value)}
        required
      />

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

      <label>Role</label>
      <select value={role} onChange={(event) => setRole(event.target.value)}>
        <option value="student">Student</option>
        <option value="teacher">Teacher</option>
      </select>

      {error && <p className="error-message">{error}</p>}

      <button type="submit">Register</button>

      <p className="small-text">
        Already have an account?
        <button type="button" className="link-button" onClick={onGoToLogin}>
          Login
        </button>
      </p>
    </form>
  );
}

export default RegisterForm;
