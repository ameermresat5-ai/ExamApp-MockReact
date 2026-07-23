import pool from "./connect.js";

const demoUsers = [
  [1, "Teacher Demo", "teacher@example.com", "123456", "teacher"],
  [2, "Student Demo", "student@example.com", "123456", "student"]
];

const demoExams = [
  {
    id: 1,
    title: "JavaScript Basics Exam",
    description:
      "Basic questions about JavaScript variables, functions, and arrays.",
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

async function initDb() {
  const client = await pool.connect();

  try {
    console.log("Creating PostgreSQL schema...");
    await client.query("BEGIN");

    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id BIGINT PRIMARY KEY,
        name VARCHAR(120) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        role VARCHAR(20) NOT NULL
          CHECK (role IN ('teacher', 'student')),
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS exams (
        id BIGINT PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description TEXT NOT NULL DEFAULT '',
        status VARCHAR(20) NOT NULL
          CHECK (status IN ('draft', 'published', 'closed')),
        teacher_id BIGINT NOT NULL REFERENCES users(id),
        questions JSONB NOT NULL DEFAULT '[]'::jsonb,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS submissions (
        id BIGINT PRIMARY KEY,
        exam_id BIGINT NOT NULL
          REFERENCES exams(id) ON DELETE CASCADE,
        exam_title VARCHAR(255) NOT NULL,
        student_id BIGINT NOT NULL
          REFERENCES users(id) ON DELETE CASCADE,
        answers JSONB NOT NULL DEFAULT '{}'::jsonb,
        grade INTEGER NOT NULL CHECK (grade BETWEEN 0 AND 100),
        total_questions INTEGER NOT NULL CHECK (total_questions >= 0),
        submitted_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        UNIQUE (exam_id, student_id)
      );

      CREATE INDEX IF NOT EXISTS idx_exams_teacher
        ON exams(teacher_id);

      CREATE INDEX IF NOT EXISTS idx_exams_status
        ON exams(status);

      CREATE INDEX IF NOT EXISTS idx_submissions_student
        ON submissions(student_id);
    `);

    for (const user of demoUsers) {
      await client.query(
        `INSERT INTO users (id, name, email, password, role)
         VALUES ($1, $2, $3, $4, $5)
         ON CONFLICT (id) DO NOTHING`,
        user
      );
    }

    for (const exam of demoExams) {
      await client.query(
        `INSERT INTO exams
          (id, title, description, status, teacher_id, questions)
         VALUES ($1, $2, $3, $4, $5, $6::jsonb)
         ON CONFLICT (id) DO NOTHING`,
        [
          exam.id,
          exam.title,
          exam.description,
          exam.status,
          exam.teacherId,
          JSON.stringify(exam.questions)
        ]
      );
    }

    await client.query("COMMIT");
    console.log("Schema and demo data created successfully.");
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("Database initialization failed:", error.message);
    process.exitCode = 1;
  } finally {
    client.release();
    await pool.end();
  }
}

initDb();
