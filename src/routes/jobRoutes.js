const express = require('express');
const jobController = require('../controllers/jobController');
const router = express.Router();

router.get('/jobs', jobController.getJobs);
router.post('/jobs', jobController.createJob);

// Otras rutas...

module.exports = router;
