import { mockDbService } from "./MockDbService";
import { loggerService } from "./LoggerService";
import { notifyService } from "./NotifyService";

class ExamService {
  getAllExams() {
    return mockDbService.getExams();
  }

  getTeacherExams(teacherId) {
    return this.getAllExams().filter((exam) => exam.teacherId === teacherId);
  }

  getPublishedExams() {
    return this.getAllExams().filter((exam) => exam.status === "published");
  }

  getExamById(id) {
    return mockDbService.getExamById(id);
  }

  createExam(examData, teacherId) {
    const newExam = mockDbService.addExam({
      title: examData.title,
      description: examData.description,
      status: examData.status || "draft",
      teacherId,
      questions: examData.questions || []
    });

    loggerService.info("Exam created", newExam);
    notifyService.success("Exam created successfully");

    return newExam;
  }

  updateExam(id, examData) {
    const updatedExam = mockDbService.updateExam(id, examData);

    if (!updatedExam) {
      notifyService.error("Exam not found");
      return null;
    }

    loggerService.info("Exam updated", updatedExam);
    notifyService.success("Exam updated successfully");

    return updatedExam;
  }

  changeExamStatus(id, status) {
    const updatedExam = mockDbService.updateExam(id, { status });

    if (!updatedExam) {
      notifyService.error("Exam not found");
      return null;
    }

    loggerService.info("Exam status changed", { id, status });
    notifyService.success("Exam status changed");

    return updatedExam;
  }

  deleteExam(id) {
    const deleted = mockDbService.deleteExam(id);

    if (deleted) {
      loggerService.info("Exam deleted", { id });
      notifyService.success("Exam deleted");
    } else {
      notifyService.error("Exam not found");
    }

    return deleted;
  }
}

export const examService = new ExamService();
export default ExamService;
