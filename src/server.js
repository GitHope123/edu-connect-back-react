// src/server.js
/* global process */
import express from 'express';
import cors from 'cors';
import estudiantesRoutes from './api/routes/estudiantes.js';
import profesoresRoutes from './api/routes/profesores.js';
import incidenciasRoutes from './api/routes/incidencias.js';

const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(cors());
app.use(express.json());

// Rutas
app.use('/estudiantes', estudiantesRoutes);
app.use('/profesores', profesoresRoutes);
app.use('/incidencias', incidenciasRoutes);

// Iniciar servidor
app.listen(PORT, () => console.log(`Servidor corriendo en http://localhost:${PORT}`));
