import { submissionService } from "../../services/SubmissionService";

function MySubmissions({ currentUser }) {
  const submissions = submissionService.getStudentSubmissions(currentUser.id);

  return (
    <section className="page-container">
      <div className="page-header">
        <h1>My Submissions</h1>
        <p>View the exams you submitted and your grades.</p>
      </div>

      {submissions.length === 0 ? (
        <div className="empty-box">
          <p>You have not submitted any exams yet.</p>
        </div>
      ) : (
        <div className="exam-list">
          {submissions.map((submission) => (
            <article className="exam-card" key={submission.id}>
              <div className="exam-card-header">
                <div>
                  <h3>{submission.examTitle}</h3>
                  <p>
                    Submitted at:{" "}
                    {new Date(submission.submittedAt).toLocaleString()}
                  </p>
                </div>

                <span className="grade-badge">
                  {submission.grade}
                </span>
              </div>

              <div className="exam-meta">
                <span>Exam ID: {submission.examId}</span>
                <span>Total Questions: {submission.totalQuestions}</span>
                <span>Submission ID: {submission.id}</span>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}

export default MySubmissions;
