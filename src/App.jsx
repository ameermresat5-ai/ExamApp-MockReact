import { useState } from "react";
import "./App.css";
import { authService } from "./services/AuthService";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import NavigationMenu from "./components/common/NavigationMenu";
import TeacherDashboard from "./components/teacher/TeacherDashboard";
import ExamList from "./components/teacher/ExamList";
import ExamForm from "./components/teacher/ExamForm";

function App() {
  const [currentUser, setCurrentUser] = useState(authService.getCurrentUser());
  const [authPage, setAuthPage] = useState("login");
  const [currentPage, setCurrentPage] = useState("dashboard");
  const [selectedExam, setSelectedExam] = useState(null);

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
    setSelectedExam(null);
  }

  function handleNavigate(page) {
    setCurrentPage(page);

    if (page !== "create-exam") {
      setSelectedExam(null);
    }
  }

  function handleEditExam(exam) {
    setSelectedExam(exam);
    setCurrentPage("create-exam");
  }

  function handleExamSaved() {
    setSelectedExam(null);
    setCurrentPage("teacher-exams");
  }

  function renderDashboard() {
    if (currentUser.role === "teacher") {
      return (
        <TeacherDashboard
          currentUser={currentUser}
          onNavigate={handleNavigate}
        />
      );
    }

    return (
      <section className="page-container">
        <div className="page-header">
          <h1>Student Dashboard</h1>
          <p>
            Student pages will be added in the next module.
          </p>
        </div>
      </section>
    );
  }

  function renderPage() {
    if (currentPage === "dashboard") {
      return renderDashboard();
    }

    if (currentUser.role === "teacher" && currentPage === "teacher-exams") {
      return (
        <ExamList
          currentUser={currentUser}
          onEditExam={handleEditExam}
        />
      );
    }

    if (currentUser.role === "teacher" && currentPage === "create-exam") {
      return (
        <ExamForm
          currentUser={currentUser}
          examToEdit={selectedExam}
          onSaved={handleExamSaved}
          onCancel={() => handleNavigate("teacher-exams")}
        />
      );
    }

    if (currentUser.role === "student" && currentPage === "available-exams") {
      return (
        <section className="page-container">
          <div className="page-header">
            <h1>Available Exams</h1>
            <p>Student exam list will be added in the next module.</p>
          </div>
        </section>
      );
    }

    if (currentUser.role === "student" && currentPage === "my-submissions") {
      return (
        <section className="page-container">
          <div className="page-header">
            <h1>My Submissions</h1>
            <p>Student submissions will be added in the next module.</p>
          </div>
        </section>
      );
    }

    return renderDashboard();
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
        onNavigate={handleNavigate}
        onLogout={handleLogout}
      />

      <main className="app-page">
        {renderPage()}
      </main>
    </div>
  );
}

export default App;
