import pool from './connect.js';

async function readExamQuestions() {
  try {
    console.log('Reading exam questions from JSONB column...');

    const result = await pool.query(`
      SELECT id, title, time_limit, passing_grade, questions
      FROM exams
      WHERE title = $1
      LIMIT 1
    `, ['JavaScript Basics']);

    if (result.rows.length === 0) {
      console.log('No exam found.');
      return;
    }

    const exam = result.rows[0];

    console.log('Exam retrieved successfully:');
    console.log('ID:', exam.id);
    console.log('Title:', exam.title);
    console.log('Time Limit:', exam.time_limit, 'minutes');
    console.log('Passing Grade:', exam.passing_grade);

    console.log('\nQuestions from JSONB:');

    exam.questions.forEach((question, index) => {
      console.log('--------------------------');
      console.log(`Question ${index + 1}`);
      console.log('ID:', question.id);
      console.log('Text:', question.text);
      console.log('Type:', question.type);

      if (question.options) {
        console.log('Options:', question.options);
      }

      if (question.answer) {
        console.log('Answer:', question.answer);
      }
    });
  } catch (err) {
    console.error('Read exam error:', err.message);
  } finally {
    await pool.end();
  }
}

readExamQuestions();
