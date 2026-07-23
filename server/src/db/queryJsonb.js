import pool from './connect.js';

async function queryJsonb() {
  try {
    console.log('Querying JSONB values from exams.questions...');

    const result = await pool.query(`
      SELECT
        e.title AS exam_title,
        question ->> 'id' AS question_id,
        question ->> 'text' AS question_text,
        question ->> 'type' AS question_type,
        question -> 'options' AS options
      FROM exams e,
           jsonb_array_elements(e.questions) AS question
      WHERE e.title = $1
      ORDER BY question_id
    `, ['JavaScript Basics']);

    console.table(result.rows);
  } catch (err) {
    console.error('JSONB query error:', err.message);
  } finally {
    await pool.end();
  }
}

queryJsonb();
