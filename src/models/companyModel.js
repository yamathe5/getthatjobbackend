// companyModel.js
// This is a mock model with a fake user for demonstration purposes.
const faker = require("faker");
const pool = require("../db"); // Importa el archivo de configuración de la base de datos

const getCompanys = async () => {
  try {
    const { rows } = await pool.query("SELECT *  FROM companys");
    return rows;
  } catch (error) {
    console.error(error);
    throw error; // Rethrow the error to handle it in the calling function
  }
};

const findCompanyByEmail = async (email) => {
  try {
    const companys = await getCompanys(); // Await the Promise from getCompanys
    return companys.find((company) => company.email === email);
  } catch (error) {
    console.error(error);
    return null; // In case of error, return null or handle accordingly
  }
};

const createCompany = async (data) => {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    const insertQuery = "INSERT INTO companys (company, email, password, website, about) VALUES ($1, $2, $3, $4, $5) RETURNING *";
    const values = [
      data.company,
      data.email,
      data.password,
      data.website,
      data.about,
    ];
    const { rows } = await client.query(insertQuery, values);
    await client.query("COMMIT");
    client.release();
    return rows[0];
  } catch (error) {
    await client.query("ROLLBACK");
    client.release();
    console.error(error);
    throw error;
  }
};

module.exports = { findCompanyByEmail, createCompany };
