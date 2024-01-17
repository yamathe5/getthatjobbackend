const express = require('express');
const jobController = require('../controllers/jobController');
const router = express.Router();

router.get('/jobs', jobController.getJobs);
router.post('/jobs', jobController.createJob);
router.put('/jobs/:id', jobController.updateJob);

// Otras rutas...

module.exports = router;
