import { examService } from "../../services/ExamService";

function TeacherDashboard({ currentUser, onNavigate }) {
  const exams = examService.getTeacherExams(currentUser.id);
  const draftCount = exams.filter((exam) => exam.status === "draft").length;
  const publishedCount = exams.filter((exam) => exam.status === "published").length;
  const closedCount = exams.filter((exam) => exam.status === "closed").length;

  return (
    <section className="page-container">
      <div className="page-header">
        <h1>Teacher Dashboard</h1>
        <p>Manage your exams, create new exams, and change exam statuses.</p>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <h3>Total Exams</h3>
          <p>{exams.length}</p>
        </div>

        <div className="stat-card">
          <h3>Draft</h3>
          <p>{draftCount}</p>
        </div>

        <div className="stat-card">
          <h3>Published</h3>
          <p>{publishedCount}</p>
        </div>

        <div className="stat-card">
          <h3>Closed</h3>
          <p>{closedCount}</p>
        </div>
      </div>

      <div className="action-row">
        <button onClick={() => onNavigate("create-exam")}>Create New Exam</button>
        <button className="secondary-button" onClick={() => onNavigate("teacher-exams")}>
          View My Exams
        </button>
      </div>
    </section>
  );
}

export default TeacherDashboard;
