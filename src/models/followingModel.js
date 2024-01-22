// professionalModel.js
// This is a mock model with a fake user for demonstration purposes.
const faker = require("faker");
const pool = require("../db"); // Importa el archivo de configuración de la base de datos

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

const createFollow = async ( professionalid, body) => {
  const client = await pool.connect()
  try {
    await client.query("BEGIN")
    const query = `INSERT INTO followings (professionalid, companyid, jobid, following) VALUES ($1, $2, $3, $4) RETURNING *`;
    const values = [
      professionalid,
      body.companyid,
      body.jobid,
      body.following
    ]
    const {rows}=await client.query(query, values)
    await client.query("COMMIT")
    client.release();
    
    return rows
  } catch (error) {
    console.error(error);
    await client.query("ROLLBACK")
    client.release();
    return null; // In case of error, return null or handle accordingly
  }
};
const deleteFollow = async (id) => {
  try {
    const query = `DELETE FROM followings WHERE id = $1`;
    const result = await pool.query(query, [id]);
    console.log("result: ", result)
    return result.rowCount; // Retorna la cantidad de filas eliminadas
  } catch (error) {
    console.error(error);
    throw error; // Es mejor lanzar el error y manejarlo más arriba en el stack de llamadas
  }
};

// const createProfessional = async (data) => {
//   const client = await pool.connect();
//   try {
//     await client.query("BEGIN");
//     const insertQuery = "INSERT INTO professionals (email, password, name, phone, birthdate, linkedin, title, experience, education) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *";
//     const values = [
//       data.email,
//       data.password,
//       data.name,
//       data.phone,
//       data.birthdate,
//       data.linkedin,
//       data.title,
//       data.experience,
//       data.education,

//     ];
//     const { rows } = await client.query(insertQuery, values);
//     await client.query("COMMIT");
//     client.release();
//     return rows[0];
//   } catch (error) {
//     await client.query("ROLLBACK");
//     client.release();
//     console.error(error);
//     throw error;
//   }
// };

module.exports = { getFollowings, createFollow, deleteFollow };
