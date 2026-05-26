// שירות המדמה בסיס נתונים בצד הלקוח.
// במקום שרת אמיתי, הנתונים נשמרים ונקראים מתוך localStorage.

import { mockExams, mockSubmissions, mockUsers } from "../data/mockData";
import { loggerService } from "./LoggerService";
import { storageService } from "./StorageService";

class MockDbService {
  constructor() {
    this.usersKey = "users";
    this.examsKey = "exams";
    this.submissionsKey = "submissions";
    this.initialize();
  }

  initialize() {
    const users = storageService.get(this.usersKey);
    const exams = storageService.get(this.examsKey);
    const submissions = storageService.get(this.submissionsKey);

    if (!users) {
      storageService.set(this.usersKey, mockUsers);
    }

    if (!exams) {
      storageService.set(this.examsKey, mockExams);
    }

    if (!submissions) {
      storageService.set(this.submissionsKey, mockSubmissions);
    }

    loggerService.info("Mock database initialized");
  }

  getCollection(collectionKey) {
    return storageService.get(collectionKey, []);
  }

  saveCollection(collectionKey, data) {
    storageService.set(collectionKey, data);
  }

  getUsers() {
    return this.getCollection(this.usersKey);
  }

  addUser(user) {
    const users = this.getUsers();
    const newUser = {
      ...user,
      id: Date.now()
    };

    users.push(newUser);
    this.saveCollection(this.usersKey, users);

    return newUser;
  }

  findUserByEmail(email) {
    return this.getUsers().find((user) => user.email === email) || null;
  }

  getExams() {
    return this.getCollection(this.examsKey);
  }

  getExamById(id) {
    return this.getExams().find((exam) => exam.id === Number(id)) || null;
  }

  addExam(exam) {
    const exams = this.getExams();
    const newExam = {
      ...exam,
      id: Date.now()
    };

    exams.push(newExam);
    this.saveCollection(this.examsKey, exams);

    return newExam;
  }

  updateExam(id, updatedExam) {
    const exams = this.getExams();
    const examIndex = exams.findIndex((exam) => exam.id === Number(id));

    if (examIndex === -1) {
      return null;
    }

    exams[examIndex] = {
      ...exams[examIndex],
      ...updatedExam
    };

    this.saveCollection(this.examsKey, exams);

    return exams[examIndex];
  }

  deleteExam(id) {
    const exams = this.getExams();
    const filteredExams = exams.filter((exam) => exam.id !== Number(id));

    this.saveCollection(this.examsKey, filteredExams);

    return filteredExams.length !== exams.length;
  }

  getSubmissions() {
    return this.getCollection(this.submissionsKey);
  }

  addSubmission(submission) {
    const submissions = this.getSubmissions();
    const newSubmission = {
      ...submission,
      id: Date.now(),
      submittedAt: new Date().toISOString()
    };

    submissions.push(newSubmission);
    this.saveCollection(this.submissionsKey, submissions);

    return newSubmission;
  }
}

export const mockDbService = new MockDbService();
export default MockDbService;
