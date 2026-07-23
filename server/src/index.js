import express from "express";
import cors from "cors";

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

app.use((req, res, next) => {
  console.log(`[SERVER] ${req.method} ${req.url}`);
  next();
});

let users = [
  {
    id: 1,
    name: "Teacher Demo",
    email: "teacher@example.com",
    password: "123456",
    role: "teacher"
  },
  {
    id: 2,
    name: "Student Demo",
    email: "student@example.com",
    password: "123456",
    role: "student"
  }
];

let exams = [
  {
    id: 1,
    title: "JavaScript Basics Exam",
    description: "Basic questions about JavaScript variables, functions, and arrays.",
    status: "published",
    teacherId: 1,
    questions: [
      {
        id: 1,
        text: "Which keyword is used to declare a constant in JavaScript?",
        options: ["var", "let", "const", "static"],
        correctAnswer: "const"
      },
      {
        id: 2,
        text: "Which method adds an item to the end of an array?",
        options: ["push", "pop", "shift", "map"],
        correctAnswer: "push"
      }
    ]
  },
  {
    id: 2,
    title: "React Introduction Exam",
    description: "Basic questions about React components and props.",
    status: "draft",
    teacherId: 1,
    questions: [
      {
        id: 1,
        text: "React components return what?",
        options: ["SQL", "HTML-like JSX", "CSS only", "JSON only"],
        correctAnswer: "HTML-like JSX"
      }
    ]
  }
];

let submissions = [];

app.get("/", (req, res) => {
  res.json({ message: "Exam API server is running" });
});

app.get("/api/users", (req, res) => {
  res.json(users);
});

app.get("/api/exams", (req, res) => {
  res.json(exams);
});

app.get("/api/exams/:id", (req, res) => {
  const exam = exams.find((exam) => exam.id === Number(req.params.id));

  if (!exam) {
    return res.status(404).json({ error: "Exam not found" });
  }

  res.json(exam);
});

app.post("/api/exams", (req, res) => {
  const newExam = {
    ...req.body,
    id: req.body.id || Date.now(),
    submissions: undefined
  };

  exams.push(newExam);

  console.log("[SERVER] Exam created:", newExam);

  res.status(201).json(newExam);
});

app.put("/api/exams/:id", (req, res) => {
  const examIndex = exams.findIndex((exam) => exam.id === Number(req.params.id));

  if (examIndex === -1) {
    return res.status(404).json({ error: "Exam not found" });
  }

  exams[examIndex] = {
    ...exams[examIndex],
    ...req.body
  };

  console.log("[SERVER] Exam updated:", exams[examIndex]);

  res.json(exams[examIndex]);
});

app.delete("/api/exams/:id", (req, res) => {
  const oldLength = exams.length;

  exams = exams.filter((exam) => exam.id !== Number(req.params.id));
  submissions = submissions.filter(
    (submission) => submission.examId !== Number(req.params.id)
  );

  if (exams.length === oldLength) {
    return res.status(404).json({ error: "Exam not found" });
  }

  console.log("[SERVER] Exam deleted:", req.params.id);

  res.json({ message: "Exam deleted" });
});

app.post("/api/exams/:id/submit", (req, res) => {
  const exam = exams.find((exam) => exam.id === Number(req.params.id));

  if (!exam) {
    return res.status(404).json({ error: "Exam not found" });
  }

  const submission = {
    ...req.body,
    id: req.body.id || Date.now(),
    examId: Number(req.params.id),
    examTitle: req.body.examTitle || exam.title,
    studentId: req.body.studentId || 2,
    answers: req.body.answers || {},
    grade: req.body.grade ?? 0,
    totalQuestions: req.body.totalQuestions ?? exam.questions.length,
    submittedAt: req.body.submittedAt || new Date().toISOString()
  };

  submissions.push(submission);

  console.log("[SERVER] Exam submitted:", submission);

  res.status(201).json(submission);
});

app.get("/api/submissions", (req, res) => {
  res.json(submissions);
});

app.get("/api/students/:studentId/submissions", (req, res) => {
  const studentSubmissions = submissions.filter(
    (submission) => submission.studentId === Number(req.params.studentId)
  );

  res.json(studentSubmissions);
});

app.get("/api/exams/:id/grades", (req, res) => {
  const examSubmissions = submissions.filter(
    (submission) => submission.examId === Number(req.params.id)
  );

  res.json(examSubmissions);
});

app.listen(PORT, () => {
  console.log(`[SERVER] Server running on http://localhost:${PORT}`);
});
