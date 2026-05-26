import { useState } from "react";
import "./App.css";
import { authService } from "./services/AuthService";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";

function App() {
  const [currentUser, setCurrentUser] = useState(authService.getCurrentUser());
  const [page, setPage] = useState("login");

  function handleLogin(user) {
    setCurrentUser(user);
  }

  function handleRegister(user) {
    setCurrentUser(user);
  }

  function handleLogout() {
    authService.logout();
    setCurrentUser(null);
    setPage("login");
  }

  if (!currentUser && page === "register") {
    return (
      <RegisterPage
        onRegister={handleRegister}
        onGoToLogin={() => setPage("login")}
      />
    );
  }

  if (!currentUser) {
    return (
      <LoginPage
        onLogin={handleLogin}
        onGoToRegister={() => setPage("register")}
      />
    );
  }

  return (
    <main className="app-page">
      <section className="dashboard-card">
        <h1>Welcome, {currentUser.name}</h1>
        <p>
          You are logged in as <strong>{currentUser.role}</strong>.
        </p>

        <div className="user-box">
          <p><strong>Email:</strong> {currentUser.email}</p>
          <p><strong>User ID:</strong> {currentUser.id}</p>
        </div>

        <p>
          This is the first working auth module. Next we will add teacher pages,
          student pages, navigation menu, and exam features.
        </p>

        <button onClick={handleLogout}>Logout</button>
      </section>
    </main>
  );
}

export default App;
