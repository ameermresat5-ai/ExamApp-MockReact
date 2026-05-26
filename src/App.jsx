import { useState } from "react";
import "./App.css";
import { authService } from "./services/AuthService";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import NavigationMenu from "./components/common/NavigationMenu";

function App() {
  const [currentUser, setCurrentUser] = useState(authService.getCurrentUser());
  const [authPage, setAuthPage] = useState("login");
  const [currentPage, setCurrentPage] = useState("dashboard");

  function handleLogin(user) {
    setCurrentUser(user);
    setCurrentPage("dashboard");
  }

  function handleRegister(user) {
    setCurrentUser(user);
    setCurrentPage("dashboard");
  }

  function handleLogout() {
    authService.logout();
    setCurrentUser(null);
    setAuthPage("login");
    setCurrentPage("dashboard");
  }

  function getPageTitle() {
    if (currentPage === "dashboard") {
      return `${currentUser.role} Dashboard`;
    }

    if (currentPage === "teacher-exams") {
      return "Teacher Exams";
    }

    if (currentPage === "create-exam") {
      return "Create Exam";
    }

    if (currentPage === "available-exams") {
      return "Available Exams";
    }

    if (currentPage === "my-submissions") {
      return "My Submissions";
    }

    return "Dashboard";
  }

  function getPageDescription() {
    if (currentPage === "dashboard") {
      return "This is the main page after login. The next modules will add real teacher and student features.";
    }

    if (currentPage === "teacher-exams") {
      return "Here the teacher will view, edit, and manage exams.";
    }

    if (currentPage === "create-exam") {
      return "Here the teacher will create a new exam.";
    }

    if (currentPage === "available-exams") {
      return "Here the student will view published exams.";
    }

    if (currentPage === "my-submissions") {
      return "Here the student will view submitted exams and results.";
    }

    return "";
  }

  if (!currentUser && authPage === "register") {
    return (
      <RegisterPage
        onRegister={handleRegister}
        onGoToLogin={() => setAuthPage("login")}
      />
    );
  }

  if (!currentUser) {
    return (
      <LoginPage
        onLogin={handleLogin}
        onGoToRegister={() => setAuthPage("register")}
      />
    );
  }

  return (
    <div className="app-layout">
      <NavigationMenu
        currentUser={currentUser}
        currentPage={currentPage}
        onNavigate={setCurrentPage}
        onLogout={handleLogout}
      />

      <main className="app-page">
        <section className="dashboard-card wide-card">
          <h1>{getPageTitle()}</h1>

          <p>
            Welcome, <strong>{currentUser.name}</strong>.
          </p>

          <div className="user-box">
            <p><strong>Email:</strong> {currentUser.email}</p>
            <p><strong>Role:</strong> {currentUser.role}</p>
            <p><strong>User ID:</strong> {currentUser.id}</p>
          </div>

          <p>{getPageDescription()}</p>
        </section>
      </main>
    </div>
  );
}

export default App;
