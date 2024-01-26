const pool = require("../db"); // Importa el archivo de configuración de la base de datos

const checkIfExistApplication = async (body) => {
  try {
    const applications = await getApplicationsByProfessional(body.professionalid);
    return applications.find(
      (application) =>
        (application.professionalid == body.professionalid &&
        application.jobid == body.jobid)
    );
  } catch (error) {
    console.error(error);
    return null; // In case of error, return null or handle accordingly
  }
};
const getCandidatesByJob = async (jobId) => {
  console.log(jobId);
  try {
    const query = `
    SELECT 
    applications.*, 
    applications.id AS application_id,
    professionals.id AS professional_id,
    professionals.* 
  FROM 
    applications 
  JOIN 
    professionals ON professionals.id = applications.professionalid 
  WHERE 
    applications.jobid = $1 
  ORDER BY 
    applications.id ASC;
  
    `;
    const { rows } = await pool.query(query, [jobId]);
    return rows;
  } catch (error) {
    console.error("Error al obtener aplicaciones por trabajo:", error);
    throw error;
  }
};
const getApplicationsByProfessional = async (id) => {
  try {
    const { rows } = await pool.query(
      "SELECT applications.id as applicationsid, *  FROM applications JOIN jobs ON jobid = jobs.id WHERE professionalid = $1 ORDER BY applications.id ASC ",
      [id]
    );
    return rows;
  } catch (error) {
    console.error("Error al obtener aplicaciones por professional:", error);
    throw error;
  }
};

const getApplicationsByCompany = async (id) => {
  try {
    const { rows } = await pool.query(
      "SELECT * FROM applications WHERE companyId = $1 ORDER BY id ASC",
      [id]
    );
    return rows;
  } catch (error) {
    console.error("Error al obtener aplicaciones por professional:", error);
    throw error;
  }
};

const createApplication = async (body) => {
  const client = await pool.connect();
  try {
    console.log(body);
    await client.query("BEGIN");
    const query = `INSERT INTO applications (jobid, professionalid, professionalexperience, whyareyouinterested, date, status) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`;
    const values = [
      body.jobid,
      body.professionalid,
      body.professionalexperience,
      body.whyareyouinterested,
      body.date,
      body.status,
    ];
    const { rows } = await client.query(query, values);
    await client.query("COMMIT");
    client.release();

    return rows;
  } catch (error) {
    console.error(error);
    await client.query("ROLLBACK");
    client.release();
    return null; // In case of error, return null or handle accordingly
  }
};

const getJobsByCompany = async (companyId) => {
  try {
    const { rows } = await pool.query(
      "SELECT * FROM jobs WHERE companyid = $1 ORDER BY id ASC",
      [companyId]
    );
    return rows;
  } catch (error) {
    console.error("Error al obtener trabajos por compañía:", error);
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
    "INSERT INTO jobs (title, category, type, aboutjob, mandatoryrequirements,optionalrequirements,minasalary,maxsalary,company,aboutcompany,posteddate,candidates,track,close, companyid) VALUES ($1, $2, $3, $4, $5,$6,$7,$8,$9,$10,$11,$12,$13,$14) RETURNING *",
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
    "UPDATE jobs SET title = $1, category = $2, type = $3, aboutjob = $4, mandatoryrequirements = $5, optionalrequirements = $6, minsalary = $7, maxsalary = $9, company = $9, aboutcompany = $10, posteddate = $11, candidates = $12, track = $13, close = $14 WHERE id = $15 RETURNING *",
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

const deleteApplication = async (professionalId, applicationId) => {
  try {
    const query = `DELETE FROM applications WHERE id = $1`;
    const result = await pool.query(query, [applicationId]);
    return result.rowCount; // Retorna la cantidad de filas eliminadas
  } catch (error) {
    console.error(error);
    throw error; // Es mejor lanzar el error y manejarlo más arriba en el stack de llamadas
  }
};

const updateApplication = async (applicationId, status) => {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    const updateQuery = `UPDATE applications SET status = $2 WHERE id = $1 RETURNING *`;
    const values = [applicationId, status];
    const { rows } = await client.query(updateQuery, values);
    await client.query("COMMIT");
    client.release();
    return rows[0]; // Retorna la aplicación actualizada
  } catch (error) {
    await client.query("ROLLBACK");
    client.release();
    throw error; // Propaga el error para manejarlo en el controlador
  }
};


module.exports = {
  checkIfExistApplication,
  createApplication,
  getApplicationsByProfessional,
  getApplicationsByCompany,
  getCandidatesByJob,
  deleteApplication,
  getJobsByCompany,
  createJob,
  updateJob,
  updateApplication
};
