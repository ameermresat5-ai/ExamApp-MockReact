import { mockDbService } from "./MockDbService";
import { loggerService } from "./LoggerService";
import { notifyService } from "./NotifyService";

class SubmissionService {
  getAllSubmissions() {
    return mockDbService.getSubmissions();
  }

  getStudentSubmissions(studentId) {
    return this.getAllSubmissions().filter(
      (submission) => submission.studentId === studentId
    );
  }

  getSubmissionForExam(studentId, examId) {
    return this.getAllSubmissions().find(
      (submission) =>
        submission.studentId === studentId &&
        submission.examId === Number(examId)
    ) || null;
  }

  hasStudentSubmitted(studentId, examId) {
    return this.getSubmissionForExam(studentId, examId) !== null;
  }

  calculateGrade(exam, answers) {
    let correctCount = 0;

    exam.questions.forEach((question) => {
      const studentAnswer = answers[question.id];

      if (studentAnswer === question.correctAnswer) {
        correctCount += 1;
      }
    });

    const totalQuestions = exam.questions.length;

    if (totalQuestions === 0) {
      return 0;
    }

    return Math.round((correctCount / totalQuestions) * 100);
  }

  submitExam(exam, studentId, answers) {
    const existingSubmission = this.getSubmissionForExam(studentId, exam.id);

    if (existingSubmission) {
      notifyService.error("You already submitted this exam");
      return null;
    }

    const grade = this.calculateGrade(exam, answers);

    const submission = mockDbService.addSubmission({
      examId: exam.id,
      examTitle: exam.title,
      studentId,
      answers,
      grade,
      totalQuestions: exam.questions.length
    });

    loggerService.info("Exam submitted", submission);
    notifyService.success("Exam submitted successfully");

    return submission;
  }
}

export const submissionService = new SubmissionService();
export default SubmissionService;
