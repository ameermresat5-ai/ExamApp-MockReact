import pool from "../db/connect.js";

class PostgresRepository {
  mapExam(row) {
    if (!row) return null;

    return {
      id: Number(row.id),
      title: row.title,
      description: row.description,
      status: row.status,
      teacherId: Number(row.teacher_id),
      questions: row.questions || []
    };
  }

  mapSubmission(row) {
    if (!row) return null;

    return {
      id: Number(row.id),
      examId: Number(row.exam_id),
      examTitle: row.exam_title,
      studentId: Number(row.student_id),
      answers: row.answers || {},
      grade: row.grade,
      totalQuestions: row.total_questions,
      submittedAt: new Date(row.submitted_at).toISOString()
    };
  }

  async getUsers() {
    const result = await pool.query(`
      SELECT id, name, email, password, role
      FROM users
      ORDER BY id
    `);

    return result.rows.map((row) => ({
      ...row,
      id: Number(row.id)
    }));
  }

  async getExams() {
    const result = await pool.query(`
      SELECT id, title, description, status, teacher_id, questions
      FROM exams
      ORDER BY id
    `);

    return result.rows.map((row) => this.mapExam(row));
  }

  async getExamById(id) {
    const result = await pool.query(
      `SELECT id, title, description, status, teacher_id, questions
       FROM exams
       WHERE id = $1`,
      [id]
    );

    return this.mapExam(result.rows[0]);
  }

  async createExam(exam) {
    const result = await pool.query(
      `INSERT INTO exams
        (id, title, description, status, teacher_id, questions)
       VALUES ($1, $2, $3, $4, $5, $6::jsonb)
       RETURNING id, title, description, status, teacher_id, questions`,
      [
        exam.id || Date.now(),
        exam.title,
        exam.description || "",
        exam.status || "draft",
        exam.teacherId,
        JSON.stringify(exam.questions || [])
      ]
    );

    return this.mapExam(result.rows[0]);
  }

  async updateExam(id, exam) {
    const result = await pool.query(
      `UPDATE exams
       SET title = $2,
           description = $3,
           status = $4,
           teacher_id = $5,
           questions = $6::jsonb,
           updated_at = NOW()
       WHERE id = $1
       RETURNING id, title, description, status, teacher_id, questions`,
      [
        id,
        exam.title,
        exam.description || "",
        exam.status || "draft",
        exam.teacherId,
        JSON.stringify(exam.questions || [])
      ]
    );

    return this.mapExam(result.rows[0]);
  }

  async deleteExam(id) {
    const result = await pool.query(
      `DELETE FROM exams
       WHERE id = $1`,
      [id]
    );

    return result.rowCount > 0;
  }

  async getSubmissions() {
    const result = await pool.query(`
      SELECT
        id,
        exam_id,
        exam_title,
        student_id,
        answers,
        grade,
        total_questions,
        submitted_at
      FROM submissions
      ORDER BY submitted_at DESC
    `);

    return result.rows.map((row) => this.mapSubmission(row));
  }

  async getStudentSubmissions(studentId) {
    const result = await pool.query(
      `SELECT
        id,
        exam_id,
        exam_title,
        student_id,
        answers,
        grade,
        total_questions,
        submitted_at
       FROM submissions
       WHERE student_id = $1
       ORDER BY submitted_at DESC`,
      [studentId]
    );

    return result.rows.map((row) => this.mapSubmission(row));
  }

  async getExamGrades(examId) {
    const result = await pool.query(
      `SELECT
        id,
        exam_id,
        exam_title,
        student_id,
        answers,
        grade,
        total_questions,
        submitted_at
       FROM submissions
       WHERE exam_id = $1
       ORDER BY submitted_at DESC`,
      [examId]
    );

    return result.rows.map((row) => this.mapSubmission(row));
  }

  async createSubmission(examId, submission) {
    const exam = await this.getExamById(examId);

    if (!exam) {
      return null;
    }

    const result = await pool.query(
      `INSERT INTO submissions
        (
          id,
          exam_id,
          exam_title,
          student_id,
          answers,
          grade,
          total_questions,
          submitted_at
        )
       VALUES ($1, $2, $3, $4, $5::jsonb, $6, $7, $8)
       RETURNING
         id,
         exam_id,
         exam_title,
         student_id,
         answers,
         grade,
         total_questions,
         submitted_at`,
      [
        submission.id || Date.now(),
        examId,
        submission.examTitle || exam.title,
        submission.studentId,
        JSON.stringify(submission.answers || {}),
        submission.grade ?? 0,
        submission.totalQuestions ?? exam.questions.length,
        submission.submittedAt || new Date().toISOString()
      ]
    );

    return this.mapSubmission(result.rows[0]);
  }
}

export const postgresRepository = new PostgresRepository();
export default PostgresRepository;
