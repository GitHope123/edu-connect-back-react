// src/api/routes/incidencias.js
import express from 'express';
import db from '../firebaseAdmin.js';

const router = express.Router();

// Obtener todas las incidencias
router.get('/', async (req, res) => {
  try {
    const snapshot = await db.collection('Incidencia').get();
    const incidencias = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    res.json(incidencias);
  } catch (error) {
    console.error('Error al obtener incidencias:', error);
    res.status(500).json({ error: 'Error al obtener incidencias' });
  }
});

// Crear una nueva incidencia
router.post('/', async (req, res) => {
  try {
    const nuevaIncidencia = req.body;
    const docRef = await db.collection('Incidencia').add(nuevaIncidencia);
    res.status(201).json({ id: docRef.id, ...nuevaIncidencia });
  } catch (error) {
    console.error('Error al crear incidencia:', error);
    res.status(500).json({ error: 'Error al crear incidencia' });
  }
});

// Eliminar una incidencia
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await db.collection('Incidencia').doc(id).delete();
    res.status(200).json({ message: 'Incidencia eliminada correctamente' });
  } catch (error) {
    console.error('Error al eliminar incidencia:', error);
    res.status(500).json({ error: 'Error al eliminar incidencia' });
  }
});

export default router;
