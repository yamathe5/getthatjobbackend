const express = require('express');
const app = express();
const jobRoutes = require('./src/routes/jobRoutes');
const port = process.env.PORT || 3000;
require('dotenv').config();

// Middlewares para parsear body/request
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rutas
// TODO: Definir tus rutas y middlewares aquí

app.use('/api', jobRoutes);


// Iniciar servidor
app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});
