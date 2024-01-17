// professionalRoutes.js
const express = require('express');
const { loginCompany, signupCompany } = require('../controllers/companyController');
const router = express.Router();

router.post('/login', loginCompany);
router.post('/signup', signupCompany);

module.exports = router;
