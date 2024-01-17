// professionalModel.js
// This is a mock model with a fake user for demonstration purposes.
const faker = require('faker');
const pool = require('../db'); // Importa el archivo de configuración de la base de datos


const getProfessionals = async () => {
  try {
    const { rows } = await pool.query('SELECT *  FROM professionals');
    return rows;
  } catch (error) {
    console.error(error);
    throw error; // Rethrow the error to handle it in the calling function
  }
};


const findProfessionalByEmail = async (email) => {
  try {
    const professionals = await getProfessionals(); // Await the Promise from getProfessionals
    return professionals.find((professional) => professional.email === email);
  } catch (error) {
    console.error(error);
    return null; // In case of error, return null or handle accordingly
  }
};

const createProfessional = async (data) => {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    const insertQuery = "INSERT INTO professionals (email, password, name, phone, birthdate, linkedin, title, experience, education) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *";
    const values = [
      data.email, 
      data.password, 
      data.name, 
      data.phone, 
      data.birthdate, 
      data.linkedin, 
      data.title, 
      data.experience, 
      data.education,
      
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


module.exports = { findProfessionalByEmail,  createProfessional};
