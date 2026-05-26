import { submissionService } from "../../services/SubmissionService";

function ExamDetails({ currentUser, exam, onBack, onTakeExam }) {
  const alreadySubmitted = submissionService.hasStudentSubmitted(
    currentUser.id,
    exam.id
  );

  return (
    <section className="page-container">
      <div className="page-header">
        <h1>{exam.title}</h1>
        <p>{exam.description}</p>
      </div>

      <div className="details-box">
        <p><strong>Exam ID:</strong> {exam.id}</p>
        <p><strong>Questions:</strong> {exam.questions.length}</p>
        <p><strong>Status:</strong> {exam.status}</p>
        <p><strong>Your submission:</strong> {alreadySubmitted ? "Submitted" : "Not submitted"}</p>
      </div>

      <h2>Questions Preview</h2>

      <div className="question-preview-list">
        {exam.questions.map((question, index) => (
          <div className="question-box" key={question.id}>
            <h3>Question {index + 1}</h3>
            <p>{question.text}</p>
            <ul>
              {question.options.map((option, optionIndex) => (
                <li key={optionIndex}>{option}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="action-row">
        <button className="light-button" onClick={onBack}>
          Back
        </button>

        <button disabled={alreadySubmitted} onClick={() => onTakeExam(exam)}>
          {alreadySubmitted ? "Already Submitted" : "Take Exam"}
        </button>
      </div>
    </section>
  );
}

export default ExamDetails;
