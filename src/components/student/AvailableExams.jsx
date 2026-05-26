import { examService } from "../../services/ExamService";
import { submissionService } from "../../services/SubmissionService";

function AvailableExams({ currentUser, onViewExam, onTakeExam }) {
  const exams = examService.getPublishedExams();

  return (
    <section className="page-container">
      <div className="page-header">
        <h1>Available Exams</h1>
        <p>Choose an exam to view details or start answering.</p>
      </div>

      {exams.length === 0 ? (
        <div className="empty-box">
          <p>No published exams are available now.</p>
        </div>
      ) : (
        <div className="exam-list">
          {exams.map((exam) => {
            const alreadySubmitted = submissionService.hasStudentSubmitted(
              currentUser.id,
              exam.id
            );

            return (
              <article className="exam-card" key={exam.id}>
                <div className="exam-card-header">
                  <div>
                    <h3>{exam.title}</h3>
                    <p>{exam.description}</p>
                  </div>

                  <span className="status-badge status-published">
                    Published
                  </span>
                </div>

                <div className="exam-meta">
                  <span>Questions: {exam.questions.length}</span>
                  <span>Exam ID: {exam.id}</span>
                  <span>
                    Status: {alreadySubmitted ? "Submitted" : "Not submitted"}
                  </span>
                </div>

                <div className="exam-actions">
                  <button onClick={() => onViewExam(exam)}>View Details</button>

                  <button
                    disabled={alreadySubmitted}
                    onClick={() => onTakeExam(exam)}
                  >
                    {alreadySubmitted ? "Already Submitted" : "Take Exam"}
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
}

export default AvailableExams;
