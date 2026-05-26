import { useState } from "react";
import { examService } from "../../services/ExamService";

function createEmptyQuestion() {
  return {
    id: Date.now(),
    text: "",
    options: ["", "", "", ""],
    correctAnswer: ""
  };
}

function ExamForm({ currentUser, examToEdit, onSaved, onCancel }) {
  const isEditMode = Boolean(examToEdit);

  const [title, setTitle] = useState(examToEdit?.title || "");
  const [description, setDescription] = useState(examToEdit?.description || "");
  const [status, setStatus] = useState(examToEdit?.status || "draft");
  const [questions, setQuestions] = useState(
    examToEdit?.questions?.length ? examToEdit.questions : [createEmptyQuestion()]
  );

  function updateQuestionText(questionIndex, value) {
    const updatedQuestions = [...questions];
    updatedQuestions[questionIndex] = {
      ...updatedQuestions[questionIndex],
      text: value
    };

    setQuestions(updatedQuestions);
  }

  function updateQuestionOption(questionIndex, optionIndex, value) {
    const updatedQuestions = [...questions];
    const updatedOptions = [...updatedQuestions[questionIndex].options];

    updatedOptions[optionIndex] = value;

    updatedQuestions[questionIndex] = {
      ...updatedQuestions[questionIndex],
      options: updatedOptions
    };

    setQuestions(updatedQuestions);
  }

  function updateCorrectAnswer(questionIndex, value) {
    const updatedQuestions = [...questions];

    updatedQuestions[questionIndex] = {
      ...updatedQuestions[questionIndex],
      correctAnswer: value
    };

    setQuestions(updatedQuestions);
  }

  function addQuestion() {
    setQuestions([...questions, createEmptyQuestion()]);
  }

  function removeQuestion(questionIndex) {
    if (questions.length === 1) {
      return;
    }

    setQuestions(questions.filter((question, index) => index !== questionIndex));
  }

  function cleanQuestions() {
    return questions.map((question, index) => ({
      id: question.id || index + 1,
      text: question.text,
      options: question.options.filter((option) => option.trim() !== ""),
      correctAnswer: question.correctAnswer
    }));
  }

  function handleSubmit(event) {
    event.preventDefault();

    const examData = {
      title,
      description,
      status,
      questions: cleanQuestions()
    };

    if (isEditMode) {
      examService.updateExam(examToEdit.id, examData);
    } else {
      examService.createExam(examData, currentUser.id);
    }

    onSaved();
  }

  return (
    <section className="page-container">
      <div className="page-header">
        <h1>{isEditMode ? "Edit Exam" : "Create Exam"}</h1>
        <p>Build an exam with questions, options, and a correct answer.</p>
      </div>

      <form className="exam-form" onSubmit={handleSubmit}>
        <label>Exam Title</label>
        <input
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          required
        />

        <label>Description</label>
        <textarea
          value={description}
          onChange={(event) => setDescription(event.target.value)}
          required
        />

        <label>Status</label>
        <select value={status} onChange={(event) => setStatus(event.target.value)}>
          <option value="draft">Draft</option>
          <option value="published">Published</option>
          <option value="closed">Closed</option>
        </select>

        <h2>Questions</h2>

        {questions.map((question, questionIndex) => (
          <div className="question-box" key={question.id}>
            <div className="question-header">
              <h3>Question {questionIndex + 1}</h3>
              <button
                type="button"
                className="danger-button small-button"
                onClick={() => removeQuestion(questionIndex)}
              >
                Remove
              </button>
            </div>

            <label>Question Text</label>
            <input
              value={question.text}
              onChange={(event) => updateQuestionText(questionIndex, event.target.value)}
              required
            />

            <label>Options</label>
            {question.options.map((option, optionIndex) => (
              <input
                key={optionIndex}
                value={option}
                placeholder={`Option ${optionIndex + 1}`}
                onChange={(event) =>
                  updateQuestionOption(questionIndex, optionIndex, event.target.value)
                }
                required
              />
            ))}

            <label>Correct Answer</label>
            <input
              value={question.correctAnswer}
              onChange={(event) => updateCorrectAnswer(questionIndex, event.target.value)}
              placeholder="Write the exact correct option"
              required
            />
          </div>
        ))}

        <div className="action-row">
          <button type="button" className="secondary-button" onClick={addQuestion}>
            Add Question
          </button>

          <button type="submit">
            {isEditMode ? "Save Changes" : "Create Exam"}
          </button>

          <button type="button" className="light-button" onClick={onCancel}>
            Cancel
          </button>
        </div>
      </form>
    </section>
  );
}

export default ExamForm;
