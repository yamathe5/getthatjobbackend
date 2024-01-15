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

// Otros métodos de controlador...
