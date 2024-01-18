const jobModel = require('../models/jobModel');

const getJobs = async (req, res) => {
  try {
    console.log("xd")
    const jobs = await jobModel.getJobs();
    res.status(200).json(jobs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getJobsByCompany = async (req, res) => {

  try {
    // console.log(antes)
    console.log("============",req.params)
    const jobs = await jobModel.getJobsByCompany(req.params.companyId);
    res.status(200).json(jobs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const createJob = async (req, res) => {
  try {
    const newJob = await jobModel.createJob(req.body);
    res.status(201).json(newJob);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const updateJob = async (req, res) => {
  const id = req.params.id; // Extraer el ID del trabajo de los parámetros de la ruta
  const jobData = req.body; // Datos del trabajo que quieres actualizar

  try {
    const updatedJob = await jobModel.updateJob(id, jobData); // Pasar tanto el ID como los datos del trabajo al modelo
    res.status(200).json(updatedJob); // Usa 200 para indicar una actualización exitosa
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


module.exports = { getJobs, getJobsByCompany, createJob, updateJob };

// Otros métodos de controlador...
