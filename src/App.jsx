// הקומפוננטה הראשית של האפליקציה.
// כאן מתבצע ניהול המשתמש המחובר, ניווט בין דפים וחיבור בין המודולים.

import { useState } from "react";
import "./App.css";
import { authService } from "./services/AuthService";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import NavigationMenu from "./components/common/NavigationMenu";
import TeacherDashboard from "./components/teacher/TeacherDashboard";
import ExamList from "./components/teacher/ExamList";
import ExamForm from "./components/teacher/ExamForm";
import StudentDashboard from "./components/student/StudentDashboard";
import AvailableExams from "./components/student/AvailableExams";
import ExamDetails from "./components/student/ExamDetails";
import TakeExam from "./components/student/TakeExam";
import MySubmissions from "./components/student/MySubmissions";

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

    if (page !== "create-exam" && page !== "exam-details" && page !== "take-exam") {
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

  function handleViewExam(exam) {
    setSelectedExam(exam);
    setCurrentPage("exam-details");
  }

  function handleTakeExam(exam) {
    setSelectedExam(exam);
    setCurrentPage("take-exam");
  }

  function handleExamSubmitted() {
    setSelectedExam(null);
    setCurrentPage("my-submissions");
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
      <StudentDashboard
        currentUser={currentUser}
        onNavigate={handleNavigate}
      />
    );
  }

  function renderTeacherPage() {
    if (currentPage === "teacher-exams") {
      return (
        <ExamList
          currentUser={currentUser}
          onEditExam={handleEditExam}
        />
      );
    }

    if (currentPage === "create-exam") {
      return (
        <ExamForm
          currentUser={currentUser}
          examToEdit={selectedExam}
          onSaved={handleExamSaved}
          onCancel={() => handleNavigate("teacher-exams")}
        />
      );
    }

    return renderDashboard();
  }

  function renderStudentPage() {
    if (currentPage === "available-exams") {
      return (
        <AvailableExams
          currentUser={currentUser}
          onViewExam={handleViewExam}
          onTakeExam={handleTakeExam}
        />
      );
    }

    if (currentPage === "exam-details" && selectedExam) {
      return (
        <ExamDetails
          currentUser={currentUser}
          exam={selectedExam}
          onBack={() => handleNavigate("available-exams")}
          onTakeExam={handleTakeExam}
        />
      );
    }

    if (currentPage === "take-exam" && selectedExam) {
      return (
        <TakeExam
          currentUser={currentUser}
          exam={selectedExam}
          onSubmitted={handleExamSubmitted}
          onCancel={() => handleNavigate("available-exams")}
        />
      );
    }

    if (currentPage === "my-submissions") {
      return <MySubmissions currentUser={currentUser} />;
    }

    return renderDashboard();
  }

  function renderPage() {
    if (currentPage === "dashboard") {
      return renderDashboard();
    }

    if (currentUser.role === "teacher") {
      return renderTeacherPage();
    }

    if (currentUser.role === "student") {
      return renderStudentPage();
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
