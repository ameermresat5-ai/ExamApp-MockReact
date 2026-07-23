import pool from './connect.js';

async function queryUsersAndExams() {
  try {
    console.log('Users in database:');
    const users = await pool.query(`
      SELECT id, username, role, name, created_at
      FROM users
      ORDER BY created_at
    `);
    console.table(users.rows);

    console.log('Exams in database:');
    const exams = await pool.query(`
      SELECT 
        id,
        title,
        time_limit,
        passing_grade,
        jsonb_array_length(questions) AS questions_count,
        created_at
      FROM exams
      ORDER BY created_at
    `);
    console.table(exams.rows);
  } catch (err) {
    console.error('Query error:', err.message);
  } finally {
    await pool.end();
  }
}

queryUsersAndExams();
