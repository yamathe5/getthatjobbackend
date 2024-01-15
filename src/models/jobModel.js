const pool = require('../db'); // Importa el archivo de configuración de la base de datos

const getJobs = async () => {
  const { rows } = await pool.query('SELECT * FROM jobs');
  return rows;
};

const createJob = async (jobData) => {
  const { title, company, type, salaryRange } = jobData;
  const { rows } = await pool.query(
    'INSERT INTO jobs (title, company, type, salary_range) VALUES ($1, $2, $3, $4) RETURNING *',
    [title, company, type, salaryRange]
  );
  return rows[0];
};

module.exports = {
  getJobs,
  createJob
};
