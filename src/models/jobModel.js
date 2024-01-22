const pool = require("../db"); // Importa el archivo de configuración de la base de datos

const getJobs = async () => {
  const { rows } = await pool.query("SELECT * FROM jobs ORDER BY id ASC");
  return rows;
};
const getJobsByCompany = async (companyId) => {
  try {
    const { rows } = await pool.query("SELECT * FROM jobs WHERE companyid = $1 ORDER BY id ASC", [companyId]);
    return rows;
  } catch (error) {
    console.error('Error al obtener trabajos por compañía:', error);
    throw error;
  }
};

const createJob = async (jobData) => {
  const {
    title,
    category,
    type,
    aboutjob,
    mandatoryrequirements,
    optionalrequirements,
    minsalary,
    maxsalary,
    company,
    aboutcompany,
    posteddate,
    candidates,
    track,
    close,
    companyid,
  } = jobData;
  const { rows } = await pool.query(
    "INSERT INTO jobs (title, category, type, aboutjob, mandatoryrequirements,optionalrequirements,minsalary,maxsalary,company,aboutcompany,posteddate,candidates,track,close, companyid) VALUES ($1, $2, $3, $4, $5,$6,$7,$8,$9,$10,$11,$12,$13,$14, $15) RETURNING *",
    [
      title,
      category,
      type,
      aboutjob,
      mandatoryrequirements,
      optionalrequirements,
      minsalary,
      maxsalary,
      company,
      aboutcompany,
      posteddate,
      candidates,
      track,
      close,
      companyid
    ]
  );
  return rows[0];
};

const updateJob = async (id, jobData) => {
  const {
    title,
    category,
    type,
    aboutjob,
    mandatoryrequirements,
    optionalrequirements,
    minsalary,
    maxsalary,
    company,
    aboutcompany,
    posteddate,
    candidates,
    track,
    close,
  } = jobData;
  const { rows } = await pool.query(
    "UPDATE jobs SET title = $1, category = $2, type = $3, aboutjob = $4, mandatoryrequirements = $5, optionalrequirements = $6, minsalary = $7,maxsalary = $8,  company = $9, aboutcompany = $10, posteddate = $11, candidates = $12, track = $13, close = $14 WHERE id = $15 RETURNING *",
    [
      title,
      category,
      type,
      aboutjob,
      mandatoryrequirements,
      optionalrequirements,
      minsalary,
      maxsalary,
      company,
      aboutcompany,
      new Date(posteddate), // Asegúrate de que posteddate sea una fecha ISO válida o conviértela a objeto Date
      candidates,
      track,
      close,
      id, // Asegúrate de pasar el ID del trabajo como parte de la solicitud para actualizar el registro correcto
    ]
  );

  return rows[0];
};

module.exports = {
  getJobs,
  getJobsByCompany,
  createJob,
  updateJob
};
