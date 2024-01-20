const applicationModel = require("../models/applicationModel");

getApplicationsByProfessional = async (req, res) => {
  // Lógica para obtener todas las aplicaciones de un profesional
  const { professionalId } = req.params;
  try {
    const applications = await applicationModel.getApplicationsByProfessional(
      professionalId
    );
    res.status(200).json(applications);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

getApplicationsByCompany = async (req, res) => {
  const { companyId } = req.params;
  try {
    const applications = await applicationModel.getApplicationsByCompany(
      companyId
    );
    res.status(200).json(applications);
  } catch (error) {
    res.status(500).json({ error: err.message });
  }

  // Lógica para obtener todas las aplicaciones para una compañía
};

createApplication = async (req, res) => {
  // Lógica para crear una nueva aplicación
};

updateApplication = async (req, res) => {
  // Lógica para actualizar una aplicación
};

deleteApplication = async (req, res) => {
  // Lógica para eliminar una aplicación
};

module.exports = {
  getApplicationsByProfessional,
  getApplicationsByCompany,
  createApplication,
  updateApplication,
  deleteApplication,
};

// Otros métodos de controlador...
