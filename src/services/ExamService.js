import { mockDbService } from "./MockDbService";
import { loggerService } from "./LoggerService";
import { notifyService } from "./NotifyService";
import { configService } from "./ConfigService";
import { apiService } from "./ApiService";

class ExamService {
  constructor() {
    this.syncInProgress = false;
    this.lastSyncTime = 0;
  }

  isServerMode() {
    return configService.get("dataMode") === "server";
  }

  syncExamsFromServer() {
    if (!this.isServerMode()) return;

    const now = Date.now();

    if (this.syncInProgress || now - this.lastSyncTime < 2000) {
      return;
    }

    this.syncInProgress = true;

    apiService
      .get("/exams")
      .then((serverExams) => {
        mockDbService.saveCollection(mockDbService.examsKey, serverExams);
        this.lastSyncTime = Date.now();
        loggerService.info("Exams synced from server", serverExams);
      })
      .catch((error) => {
        console.error("[CLIENT API] Failed to sync exams", error);
      })
      .finally(() => {
        this.syncInProgress = false;
      });
  }

  getAllExams() {
    this.syncExamsFromServer();
    return mockDbService.getExams();
  }

  getTeacherExams(teacherId) {
    return this.getAllExams().filter((exam) => exam.teacherId === teacherId);
  }

  getPublishedExams() {
    return this.getAllExams().filter((exam) => exam.status === "published");
  }

  getExamById(id) {
    this.syncExamsFromServer();
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

    if (this.isServerMode()) {
      apiService
        .post("/exams", newExam)
        .then((serverExam) => {
          loggerService.info("Exam created on server", serverExam);
        })
        .catch((error) => {
          console.error("[CLIENT API] Failed to create exam on server", error);
        });
    }

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

    if (this.isServerMode()) {
      apiService
        .put(`/exams/${id}`, updatedExam)
        .then((serverExam) => {
          loggerService.info("Exam updated on server", serverExam);
        })
        .catch((error) => {
          console.error("[CLIENT API] Failed to update exam on server", error);
        });
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

    if (this.isServerMode()) {
      apiService
        .put(`/exams/${id}`, updatedExam)
        .then((serverExam) => {
          loggerService.info("Exam status changed on server", serverExam);
        })
        .catch((error) => {
          console.error("[CLIENT API] Failed to change exam status on server", error);
        });
    }

    loggerService.info("Exam status changed", { id, status });
    notifyService.success("Exam status changed");

    return updatedExam;
  }

  deleteExam(id) {
    const deleted = mockDbService.deleteExam(id);

    if (deleted) {
      if (this.isServerMode()) {
        apiService
          .delete(`/exams/${id}`)
          .then((result) => {
            loggerService.info("Exam deleted on server", result);
          })
          .catch((error) => {
            console.error("[CLIENT API] Failed to delete exam on server", error);
          });
      }

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
