const express = require('express');
const app = express();
const cors = require('cors');
const jobRoutes = require('./src/routes/jobRoutes');
const professionalRoutes = require('./src/routes/professionalRoutes');
const companyRoutes = require("./src/routes/companyRoutes")
const followingRoutes = require('./src/routes/followingRoutes');
const port = process.env.PORT || 3000;
require('dotenv').config();

// Habilitar CORS para todas las rutas
app.use(cors());


// Middlewares para parsear body/request
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rutas
// TODO: Definir tus rutas y middlewares aquí

app.use('/api', jobRoutes);
app.use('/api/following', followingRoutes);
app.use('/api/professionals', professionalRoutes);
app.use('/api/companys', companyRoutes);


// Iniciar servidor
app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});
