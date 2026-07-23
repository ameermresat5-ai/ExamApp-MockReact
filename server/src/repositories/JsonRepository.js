import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const currentFile = fileURLToPath(import.meta.url);
const currentDirectory = path.dirname(currentFile);
const databasePath = path.resolve(currentDirectory, "../../data/db.json");

class JsonRepository {
  async readData() {
    const content = await fs.readFile(databasePath, "utf8");
    return JSON.parse(content);
  }

  async writeData(data) {
    await fs.writeFile(
      databasePath,
      `${JSON.stringify(data, null, 2)}\n`,
      "utf8"
    );
  }

  async getUsers() {
    const data = await this.readData();
    return data.users;
  }

  async getExams() {
    const data = await this.readData();
    return data.exams;
  }

  async getExamById(id) {
    const data = await this.readData();

    return (
      data.exams.find((exam) => exam.id === Number(id)) ||
      null
    );
  }

  async createExam(exam) {
    const data = await this.readData();

    const newExam = {
      ...exam,
      id: Number(exam.id || Date.now()),
      description: exam.description || "",
      status: exam.status || "draft",
      questions: exam.questions || []
    };

    data.exams.push(newExam);
    await this.writeData(data);

    return newExam;
  }

  async updateExam(id, exam) {
    const data = await this.readData();
    const numericId = Number(id);

    const index = data.exams.findIndex(
      (currentExam) => currentExam.id === numericId
    );

    if (index === -1) {
      return null;
    }

    data.exams[index] = {
      ...data.exams[index],
      ...exam,
      id: numericId
    };

    await this.writeData(data);
    return data.exams[index];
  }

  async deleteExam(id) {
    const data = await this.readData();
    const numericId = Number(id);
    const previousLength = data.exams.length;

    data.exams = data.exams.filter(
      (exam) => exam.id !== numericId
    );

    data.submissions = data.submissions.filter(
      (submission) => submission.examId !== numericId
    );

    if (data.exams.length === previousLength) {
      return false;
    }

    await this.writeData(data);
    return true;
  }

  async getSubmissions() {
    const data = await this.readData();
    return data.submissions;
  }

  async getStudentSubmissions(studentId) {
    const data = await this.readData();
    const numericStudentId = Number(studentId);

    return data.submissions.filter(
      (submission) =>
        submission.studentId === numericStudentId
    );
  }

  async getExamGrades(examId) {
    const data = await this.readData();
    const numericExamId = Number(examId);

    return data.submissions.filter(
      (submission) =>
        submission.examId === numericExamId
    );
  }

  async createSubmission(examId, submission) {
    const data = await this.readData();
    const numericExamId = Number(examId);

    const exam = data.exams.find(
      (currentExam) => currentExam.id === numericExamId
    );

    if (!exam) {
      return null;
    }

    const duplicate = data.submissions.find(
      (currentSubmission) =>
        currentSubmission.examId === numericExamId &&
        currentSubmission.studentId === Number(submission.studentId)
    );

    if (duplicate) {
      const error = new Error(
        "Student already submitted this exam"
      );
      error.code = "DUPLICATE_SUBMISSION";
      throw error;
    }

    const newSubmission = {
      ...submission,
      id: Number(submission.id || Date.now()),
      examId: numericExamId,
      examTitle: submission.examTitle || exam.title,
      studentId: Number(submission.studentId),
      answers: submission.answers || {},
      grade: submission.grade ?? 0,
      totalQuestions:
        submission.totalQuestions ?? exam.questions.length,
      submittedAt:
        submission.submittedAt || new Date().toISOString()
    };

    data.submissions.push(newSubmission);
    await this.writeData(data);

    return newSubmission;
  }
}

export const jsonRepository = new JsonRepository();
export default JsonRepository;
