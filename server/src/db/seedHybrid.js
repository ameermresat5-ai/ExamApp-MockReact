import pool from './connect.js';

async function seedDb() {
  try {
    console.log('Seeding database with JSONB hybrid data...');

    const lecturer = await pool.query(
      `INSERT INTO users (username, password, role, name)
       VALUES ($1, $2, $3, $4)
       RETURNING id, username, role, name`,
      ['teacher1', '123456', 'LECTURER', 'Teacher One']
    );

    const student = await pool.query(
      `INSERT INTO users (username, password, role, name)
       VALUES ($1, $2, $3, $4)
       RETURNING id, username, role, name`,
      ['student1', '123456', 'STUDENT', 'Student One']
    );

    const questions = [
      {
        id: 'q1',
        text: 'What is typeof null?',
        type: 'MULTIPLE_CHOICE',
        options: ['object', 'null', 'undefined'],
        answer: 'object'
      },
      {
        id: 'q2',
        text: 'Explain closures in JavaScript.',
        type: 'OPEN_ENDED'
      },
      {
        id: 'q3',
        text: 'Which command starts a Node project?',
        type: 'MULTIPLE_CHOICE',
        options: ['npm init', 'node start', 'git init'],
        answer: 'npm init'
      }
    ];

    const exam = await pool.query(
      `INSERT INTO exams (title, time_limit, passing_grade, questions)
       VALUES ($1, $2, $3, $4::jsonb)
       RETURNING id, title, time_limit, passing_grade, questions`,
      ['JavaScript Basics', 60, 60, JSON.stringify(questions)]
    );

    const answers = {
      q1: 'object',
      q2: 'A closure is a function that remembers variables from its outer scope.',
      q3: 'npm init'
    };

    await pool.query(
      `INSERT INTO submissions (exam_id, student_id, score, answers)
       VALUES ($1, $2, $3, $4::jsonb)`,
      [
        exam.rows[0].id,
        student.rows[0].id,
        95,
        JSON.stringify(answers)
      ]
    );

    console.log('Seed completed successfully.');
    console.log('Lecturer:', lecturer.rows[0]);
    console.log('Student:', student.rows[0]);
    console.log('Exam:', exam.rows[0].title);
  } catch (err) {
    console.error('Seed error:', err.message);
  } finally {
    await pool.end();
  }
}

seedDb();
