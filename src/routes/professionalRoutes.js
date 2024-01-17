// professionalRoutes.js
const express = require('express');
const { loginProfessional } = require('../controllers/professionalController');
const router = express.Router();

router.post('/login', loginProfessional);

module.exports = router;
