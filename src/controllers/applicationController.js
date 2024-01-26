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

getCandidatesByJob = async (req, res) => {
  const { jobId } = req.params;
  try {
    const applications = await applicationModel.getCandidatesByJob(
      jobId
    );
    res.status(200).json(applications);
  } catch (error) {
    res.status(500).json({ error: err.message });
  }
}

createApplication = async (req, res) => {
  // Lógica para crear una nueva aplicación
  const { professionalId } = req.params;
  try {
    const applicationExist = await applicationModel.checkIfExistApplication(
      req.body
    );

    if (applicationExist) {
      return res.status(409).json({ message: "Applicatio nalready exist." });
    }
    const application = await applicationModel.createApplication(req.body);
    res.status(200).json(application);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};



deleteApplication = async (req, res) => {
  const { professionalId, applicationId } = req.params;
  try {
    const rowCount = await applicationModel.deleteApplication(
      professionalId,
      applicationId
    );
    if (rowCount > 0) {
      res
        .status(200)
        .json({
          message: `Application ${applicationId} deleted successfully.`,
        });
    } else {
      res
        .status(404)
        .json({
          message: `Application ${applicationId} not found or you do not have permission to delete it.`,
        });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

updateApplication = async (req, res) => {
  const { applicationId } = req.params;
  const { status } = req.body; // Asumimos que el cuerpo de la solicitud solo tiene el estado a actualizar

  try {
    const updatedApplication = await applicationModel.updateApplication(applicationId, status);
    if (updatedApplication) {
      return res.status(200).json(updatedApplication);
    } else {
      return res.status(404).json({ message: "Application not found." });
    }
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};


module.exports = {
  getApplicationsByProfessional,
  getApplicationsByCompany,
  createApplication,
  updateApplication,
  deleteApplication,
  getCandidatesByJob,
};

// Otros métodos de controlador...
