import pool from './connect.js';

async function checkConnection() {
  try {
    console.log('Checking database connection...');

    const result = await pool.query(`
      SELECT 
        NOW() AS connected_at,
        current_database() AS database_name,
        current_user AS user_name
    `);

    console.log('Database connected successfully.');
    console.table(result.rows);
  } catch (err) {
    console.error('Database connection failed:', err.message);
  } finally {
    await pool.end();
  }
}

checkConnection();
