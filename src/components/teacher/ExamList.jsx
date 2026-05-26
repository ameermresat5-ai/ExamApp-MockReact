import { useState } from "react";
import { examService } from "../../services/ExamService";
import ExamCard from "./ExamCard";

function ExamList({ currentUser, onEditExam }) {
  const [exams, setExams] = useState(examService.getTeacherExams(currentUser.id));

  function refreshExams() {
    setExams(examService.getTeacherExams(currentUser.id));
  }

  function handleChangeStatus(id, status) {
    examService.changeExamStatus(id, status);
    refreshExams();
  }

  function handleDelete(id) {
    const confirmDelete = window.confirm("Are you sure you want to delete this exam?");

    if (!confirmDelete) {
      return;
    }

    examService.deleteExam(id);
    refreshExams();
  }

  return (
    <section className="page-container">
      <div className="page-header">
        <h1>My Exams</h1>
        <p>View, edit, delete, and change the status of your exams.</p>
      </div>

      {exams.length === 0 ? (
        <div className="empty-box">
          <p>No exams yet. Create your first exam.</p>
        </div>
      ) : (
        <div className="exam-list">
          {exams.map((exam) => (
            <ExamCard
              key={exam.id}
              exam={exam}
              onEdit={onEditExam}
              onDelete={handleDelete}
              onChangeStatus={handleChangeStatus}
            />
          ))}
        </div>
      )}
    </section>
  );
}

export default ExamList;
