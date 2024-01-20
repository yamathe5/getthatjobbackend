// applicationRoutes.js
const express = require('express');
const applicationsController = require('../controllers/applicationController');
const router = express.Router();

// Obtener todas las aplicaciones de un profesional
router.get('/professionals/:professionalId/applications', applicationsController.getApplicationsByProfessional);

// Obtener todas las aplicaciones para una compañía
router.get('/companys/:companyId/applications', applicationsController.getApplicationsByCompany);

// Crear una nueva aplicación
router.post('/jobs/:jobId/apply', applicationsController.createApplication);

// Actualizar una aplicación
router.put('/applications/:applicationId', applicationsController.updateApplication);

// Eliminar una aplicación
router.delete('/applications/:applicationId', applicationsController.deleteApplication);

module.exports = router;
