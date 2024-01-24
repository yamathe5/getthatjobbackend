const express = require('express');
const jobController = require('../controllers/jobController');
const router = express.Router();

router.get('/professionals/:professionalId/jobs', jobController.getJobs);
router.get('/professionals/:professionalId/jobs/:jobId', jobController.getJobById);
router.get('/jobs', jobController.getJobs);
router.get('/companys/:companyId/jobs', jobController.getJobsByCompany);
router.post('/jobs', jobController.createJob);
router.put('/jobs/:id', jobController.updateJob);

// Otras rutas...

module.exports = router;
