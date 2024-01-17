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

module.exports = { findProfessionalByEmail };
