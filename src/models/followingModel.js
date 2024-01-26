// professionalModel.js
// This is a mock model with a fake user for demonstration purposes.
const faker = require("faker");
const pool = require("../db"); // Importa el archivo de configuración de la base de datos

const findExistingFollowing = async (professionalId, body) => {
  try {
    const followings = await getFollowings(professionalId); // Await the Promise from getProfessionals
    return followings.find(
      (following) =>
         (following.companyid === body.companyid ||
          following.jobid === body.jobid)
    );
  } catch (error) {
    console.error(error);
    return null; // In case of error, return null or handle accordingly
  }
};

const getFollowings = async (id) => {
  try {
    const query = `
    SELECT 
    f.*,
    j.title,
    j.company AS jobCompanyName,
    j.category,
    j.type,
    j.minsalary,
    j.maxsalary,
    c.company AS companyName,
    (SELECT COUNT(*) FROM jobs WHERE companyid = f.companyid) AS jobCount
FROM 
    followings f
    LEFT JOIN companys c ON f.companyid = c.id
    LEFT JOIN jobs j ON f.jobid = j.id
WHERE 
    f.professionalid = $1;
    `;
    const { rows } = await pool.query(query, [id]);
    return rows;
  } catch (error) {
    console.error(error);
    throw error; // Rethrow the error to handle it in the calling function
  }
};

const createFollow = async (professionalid, body) => {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    const query = `INSERT INTO followings (professionalid, companyid, jobid, following) VALUES ($1, $2, $3, $4) RETURNING *`;
    const values = [professionalid, body.companyid, body.jobid, body.following];
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
const deleteFollow = async (id) => {
  try {
    const query = `DELETE FROM followings WHERE id = $1`;
    const result = await pool.query(query, [id]);
    return result.rowCount; // Retorna la cantidad de filas eliminadas
  } catch (error) {
    console.error(error);
    throw error; // Es mejor lanzar el error y manejarlo más arriba en el stack de llamadas
  }
};


module.exports = {
  findExistingFollowing,
  getFollowings,
  createFollow,
  deleteFollow,
};
