// professionalRoutes.js
const express = require('express');
const { loginProfessional, signupProfessional } = require('../controllers/professionalController');
const router = express.Router();

router.post('/login', loginProfessional);
router.post('/signup', signupProfessional);

module.exports = router;
