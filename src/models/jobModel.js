const pool = require("../db"); // Importa el archivo de configuración de la base de datos

const getJobWithFollowing = async (professionalId, jobId) => {
  console.log(professionalId, jobId);
  const query = `
    SELECT 
      j.*, 
      f.id as followingid,
      CASE 
        WHEN f.id IS NOT NULL THEN TRUE
        ELSE FALSE
      END as following
    FROM 
      jobs j
    LEFT JOIN 
      followings f ON j.id = f.jobid AND f.professionalid = $2
    WHERE 
      j.id = $1;
  `;
  const { rows } = await pool.query(query, [jobId, professionalId]);
  return rows;
};
const getJobs = async () => {
  const { rows } = await pool.query("SELECT * FROM jobs ORDER BY id ASC");
  return rows;
};

const getJobsWithFollowing = async (professionalId) => {
  // const { rows } = await pool.query("SELECT * FROM jobs ORDER BY id ASC");
  const query = `
  SELECT 
    j.*, 
    f.id as followingid,
    a.id as appliedid,
    CASE 
      WHEN f.jobid IS NOT NULL THEN TRUE
      ELSE FALSE
    END as following,
    CASE 
      WHEN a.jobid IS NOT NULL THEN TRUE
      ELSE FALSE
    END as applied
  FROM 
    jobs j
  LEFT JOIN 
    followings f ON f.jobid = j.id AND f.professionalid = $1
    LEFT JOIN 
    applications a ON j.id = a.jobid AND a.professionalid = $1
  ORDER BY 
    j.id ASC;
`;

  const { rows } = await pool.query(query, [professionalId]);

  return rows;
};
const getJobsByCompany = async (companyId) => {
  try {
    const { rows } = await pool.query(
      // "SELECT * FROM jobs WHERE companyid = $1 ORDER BY id ASC",
      `SELECT 
      jobs.*,
      COUNT(applications.professionalid) AS count_candidates
    FROM 
      jobs 
    LEFT JOIN 
      applications ON applications.jobid = jobs.id
    WHERE 
      jobs.companyid = $1
    GROUP BY 
      jobs.id
    ORDER BY 
      jobs.id ASC;
    `,
      [companyId]
    );
    console.log(rows)
    return rows;
  } catch (error) {
    console.error("Error al obtener trabajos por compañía:", error);
    throw error;
  }
};

const getJobsByCompanyAndId = async (companyId, jobId) => {
  try {
    const { rows } = await pool.query(
      `SELECT 
        jobs.*, 
        companys.company, 
        companys.email, 
        companys.website, 
        companys.about,
        COUNT(applications.id) AS candidate_count
      FROM 
        jobs
      JOIN 
        companys ON jobs.companyid = companys.id
      LEFT JOIN 
        applications ON applications.jobid = jobs.id
      WHERE 
        jobs.companyid = $1 AND jobs.id = $2
      GROUP BY 
        jobs.id, companys.id
      ORDER BY 
        jobs.id ASC`,
      [companyId, jobId]
    );
    return rows[0];
  } catch (error) {
    console.error("Error al obtener trabajos por compañía y ID:", error);
    throw error;
  }
}

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
      companyid,
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
  getJobWithFollowing,
  getJobsByCompanyAndId,
  getJobs,
  getJobsWithFollowing,
  getJobsByCompany,
  createJob,
  updateJob,
};
