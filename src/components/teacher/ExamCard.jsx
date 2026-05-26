function ExamCard({ exam, onEdit, onDelete, onChangeStatus }) {
  return (
    <article className="exam-card">
      <div className="exam-card-header">
        <div>
          <h3>{exam.title}</h3>
          <p>{exam.description}</p>
        </div>

        <span className={`status-badge status-${exam.status}`}>
          {exam.status}
        </span>
      </div>

      <div className="exam-meta">
        <span>Questions: {exam.questions.length}</span>
        <span>Exam ID: {exam.id}</span>
      </div>

      <div className="exam-actions">
        <button onClick={() => onEdit(exam)}>Edit</button>

        <select
          value={exam.status}
          onChange={(event) => onChangeStatus(exam.id, event.target.value)}
        >
          <option value="draft">Draft</option>
          <option value="published">Published</option>
          <option value="closed">Closed</option>
        </select>

        <button className="danger-button" onClick={() => onDelete(exam.id)}>
          Delete
        </button>
      </div>
    </article>
  );
}

export default ExamCard;
