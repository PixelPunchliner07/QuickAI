import pool from './configs/db.js';

async function testDB() {
  try {
    const res = await pool.query('SELECT 1');
    console.log('DB RESULT:', res.rows);
  } catch (err) {
    console.error('DB ERROR:', err);
  } finally {
    await pool.end();
  }
}

testDB();
