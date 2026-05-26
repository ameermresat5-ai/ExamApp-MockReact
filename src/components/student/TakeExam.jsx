import { useState } from "react";
import { submissionService } from "../../services/SubmissionService";

function TakeExam({ currentUser, exam, onSubmitted, onCancel }) {
  const [answers, setAnswers] = useState({});

  function handleAnswerChange(questionId, answer) {
    setAnswers({
      ...answers,
      [questionId]: answer
    });
  }

  function handleSubmit(event) {
    event.preventDefault();

    const answeredCount = Object.keys(answers).length;

    if (answeredCount < exam.questions.length) {
      alert("Please answer all questions before submitting.");
      return;
    }

    const submission = submissionService.submitExam(
      exam,
      currentUser.id,
      answers
    );

    if (submission) {
      onSubmitted(submission);
    }
  }

  return (
    <section className="page-container">
      <div className="page-header">
        <h1>Take Exam: {exam.title}</h1>
        <p>Answer all questions and submit your exam.</p>
      </div>

      <form className="take-exam-form" onSubmit={handleSubmit}>
        {exam.questions.map((question, questionIndex) => (
          <div className="question-box" key={question.id}>
            <h3>Question {questionIndex + 1}</h3>
            <p>{question.text}</p>

            <div className="options-list">
              {question.options.map((option, optionIndex) => (
                <label className="option-row" key={optionIndex}>
                  <input
                    type="radio"
                    name={`question-${question.id}`}
                    value={option}
                    checked={answers[question.id] === option}
                    onChange={(event) =>
                      handleAnswerChange(question.id, event.target.value)
                    }
                  />
                  {option}
                </label>
              ))}
            </div>
          </div>
        ))}

        <div className="action-row">
          <button type="submit">Submit Exam</button>

          <button type="button" className="light-button" onClick={onCancel}>
            Cancel
          </button>
        </div>
      </form>
    </section>
  );
}

export default TakeExam;
