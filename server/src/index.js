import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import {
  activeDataSource,
  repository
} from "./repositories/RepositoryFactory.js";

dotenv.config();

const app = express();
const port = Number(process.env.PORT || 5000);

app.use(cors());
app.use(express.json());

app.use((req, res, next) => {
  console.log(`[SERVER] ${req.method} ${req.url}`);
  next();
});

function asyncRoute(handler) {
  return (req, res, next) => {
    Promise.resolve(handler(req, res, next)).catch(next);
  };
}

function parseId(value) {
  const id = Number(value);

  if (!Number.isFinite(id)) {
    const error = new Error("Invalid numeric ID");
    error.status = 400;
    throw error;
  }

  return id;
}

app.get("/", (req, res) => {
  res.json({
    message: "Exam API server is running",
    dataSource: activeDataSource
  });
});

app.get(
  "/api/health",
  asyncRoute(async (req, res) => {
    const exams = await repository.getExams();

    res.json({
      status: "ok",
      dataSource: activeDataSource,
      databaseConnected: true,
      examCount: exams.length
    });
  })
);

app.get(
  "/api/users",
  asyncRoute(async (req, res) => {
    const users = await repository.getUsers();
    res.json(users);
  })
);

app.get(
  "/api/exams",
  asyncRoute(async (req, res) => {
    const exams = await repository.getExams();
    res.json(exams);
  })
);

app.get(
  "/api/exams/:id",
  asyncRoute(async (req, res) => {
    const exam = await repository.getExamById(
      parseId(req.params.id)
    );

    if (!exam) {
      return res.status(404).json({
        error: "Exam not found"
      });
    }

    res.json(exam);
  })
);

app.post(
  "/api/exams",
  asyncRoute(async (req, res) => {
    const exam = await repository.createExam(req.body);
    res.status(201).json(exam);
  })
);

app.put(
  "/api/exams/:id",
  asyncRoute(async (req, res) => {
    const exam = await repository.updateExam(
      parseId(req.params.id),
      req.body
    );

    if (!exam) {
      return res.status(404).json({
        error: "Exam not found"
      });
    }

    res.json(exam);
  })
);

app.delete(
  "/api/exams/:id",
  asyncRoute(async (req, res) => {
    const deleted = await repository.deleteExam(
      parseId(req.params.id)
    );

    if (!deleted) {
      return res.status(404).json({
        error: "Exam not found"
      });
    }

    res.json({
      message: "Exam deleted"
    });
  })
);

app.get(
  "/api/submissions",
  asyncRoute(async (req, res) => {
    const submissions =
      await repository.getSubmissions();

    res.json(submissions);
  })
);

app.get(
  "/api/students/:studentId/submissions",
  asyncRoute(async (req, res) => {
    const submissions =
      await repository.getStudentSubmissions(
        parseId(req.params.studentId)
      );

    res.json(submissions);
  })
);

app.get(
  "/api/exams/:id/grades",
  asyncRoute(async (req, res) => {
    const submissions =
      await repository.getExamGrades(
        parseId(req.params.id)
      );

    res.json(submissions);
  })
);

app.post(
  "/api/exams/:id/submit",
  asyncRoute(async (req, res) => {
    const submission =
      await repository.createSubmission(
        parseId(req.params.id),
        req.body
      );

    if (!submission) {
      return res.status(404).json({
        error: "Exam not found"
      });
    }

    res.status(201).json(submission);
  })
);

app.use((error, req, res, next) => {
  console.error("[SERVER ERROR]", error);

  if (
    error.code === "23505" ||
    error.code === "DUPLICATE_SUBMISSION"
  ) {
    return res.status(409).json({
      error: "Student already submitted this exam"
    });
  }

  res.status(error.status || 500).json({
    error: error.message || "Internal server error"
  });
});

app.listen(port, () => {
  console.log(
    `[SERVER] Running on http://localhost:${port}`
  );
  console.log(
    `[SERVER] Active data source: ${activeDataSource}`
  );
});
