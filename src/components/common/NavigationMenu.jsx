function NavigationMenu({ currentUser, currentPage, onNavigate, onLogout }) {
  const isTeacher = currentUser.role === "teacher";
  const isStudent = currentUser.role === "student";

  return (
    <nav className="navigation-menu">
      <div className="nav-brand">
        <h2>ExamApp</h2>
        <span>{currentUser.role}</span>
      </div>

      <div className="nav-links">
        <button
          className={currentPage === "dashboard" ? "active-nav" : ""}
          onClick={() => onNavigate("dashboard")}
        >
          Dashboard
        </button>

        {isTeacher && (
          <>
            <button
              className={currentPage === "teacher-exams" ? "active-nav" : ""}
              onClick={() => onNavigate("teacher-exams")}
            >
              My Exams
            </button>

            <button
              className={currentPage === "create-exam" ? "active-nav" : ""}
              onClick={() => onNavigate("create-exam")}
            >
              Create Exam
            </button>
          </>
        )}

        {isStudent && (
          <>
            <button
              className={currentPage === "available-exams" ? "active-nav" : ""}
              onClick={() => onNavigate("available-exams")}
            >
              Available Exams
            </button>

            <button
              className={currentPage === "my-submissions" ? "active-nav" : ""}
              onClick={() => onNavigate("my-submissions")}
            >
              My Submissions
            </button>
          </>
        )}
      </div>

      <div className="nav-user">
        <span>{currentUser.name}</span>
        <button className="logout-button" onClick={onLogout}>
          Logout
        </button>
      </div>
    </nav>
  );
}

export default NavigationMenu;
