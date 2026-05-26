import { examService } from "../../services/ExamService";
import { submissionService } from "../../services/SubmissionService";

function StudentDashboard({ currentUser, onNavigate }) {
  const availableExams = examService.getPublishedExams();
  const mySubmissions = submissionService.getStudentSubmissions(currentUser.id);

  const averageGrade =
    mySubmissions.length === 0
      ? 0
      : Math.round(
          mySubmissions.reduce((sum, submission) => sum + submission.grade, 0) /
            mySubmissions.length
        );

  return (
    <section className="page-container">
      <div className="page-header">
        <h1>Student Dashboard</h1>
        <p>View available exams, submit answers, and check your results.</p>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <h3>Available Exams</h3>
          <p>{availableExams.length}</p>
        </div>

        <div className="stat-card">
          <h3>Submitted Exams</h3>
          <p>{mySubmissions.length}</p>
        </div>

        <div className="stat-card">
          <h3>Average Grade</h3>
          <p>{averageGrade}</p>
        </div>

        <div className="stat-card">
          <h3>User Role</h3>
          <p>S</p>
        </div>
      </div>

      <div className="action-row">
        <button onClick={() => onNavigate("available-exams")}>
          View Available Exams
        </button>

        <button
          className="secondary-button"
          onClick={() => onNavigate("my-submissions")}
        >
          View My Submissions
        </button>
      </div>
    </section>
  );
}

export default StudentDashboard;
