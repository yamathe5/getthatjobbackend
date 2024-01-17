const jobModel = require('../models/jobModel');

exports.getJobs = async (req, res) => {
  try {
    const jobs = await jobModel.getJobs();
    res.status(200).json(jobs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.createJob = async (req, res) => {
  try {
    const newJob = await jobModel.createJob(req.body);
    res.status(201).json(newJob);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateJob = async (req, res) => {
  const id = req.params.id; // Extraer el ID del trabajo de los parámetros de la ruta
  const jobData = req.body; // Datos del trabajo que quieres actualizar

  try {
    const updatedJob = await jobModel.updateJob(id, jobData); // Pasar tanto el ID como los datos del trabajo al modelo
    res.status(200).json(updatedJob); // Usa 200 para indicar una actualización exitosa
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Otros métodos de controlador...
