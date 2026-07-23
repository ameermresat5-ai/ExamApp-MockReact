import pool from './connect.js';

async function initDb() {
  try {
    console.log('Creating database schema...');

    await pool.query(`
      CREATE EXTENSION IF NOT EXISTS pgcrypto;

      DROP TABLE IF EXISTS submissions;
      DROP TABLE IF EXISTS exams;
      DROP TABLE IF EXISTS users;

      CREATE TABLE users (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        username VARCHAR UNIQUE NOT NULL,
        password VARCHAR NOT NULL,
        role VARCHAR NOT NULL CHECK (role IN ('LECTURER', 'STUDENT')),
        name VARCHAR NOT NULL,
        created_at TIMESTAMP DEFAULT NOW()
      );

      CREATE TABLE exams (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        title VARCHAR NOT NULL,
        time_limit INTEGER NOT NULL,
        passing_grade INTEGER NOT NULL,
        questions JSONB NOT NULL,
        created_at TIMESTAMP DEFAULT NOW()
      );

      CREATE TABLE submissions (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        exam_id UUID REFERENCES exams(id) ON DELETE CASCADE,
        student_id UUID REFERENCES users(id) ON DELETE CASCADE,
        score INTEGER,
        answers JSONB NOT NULL,
        submitted_at TIMESTAMP DEFAULT NOW()
      );
    `);

    console.log('Database schema created successfully.');
  } catch (err) {
    console.error('Error creating schema:', err.message);
  } finally {
    await pool.end();
  }
}

initDb();
