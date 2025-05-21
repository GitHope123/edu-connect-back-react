// src/api/routes/estudiantes.js
import express from 'express';
import db from '../firebaseAdmin.js';

const router = express.Router();

// Obtener todos los estudiantes
router.get('/', async (req, res) => {
  try {
    const snapshot = await db.collection('Estudiante').get();
    const estudiantes = snapshot.docs.map((doc) => ({
      idEstudiante: doc.id,
      ...doc.data(),
    }));
    res.json(estudiantes);
  } catch (error) {
    console.error('Error al obtener estudiantes:', error);
    res.status(500).json({ error: 'Error al obtener estudiantes' });
  }
});

// Crear un nuevo estudiante
router.post('/', async (req, res) => {
  try {
    const nuevoEstudiante = req.body;
    const docRef = await db.collection('Estudiante').add(nuevoEstudiante);
    res.status(201).json({ idEstudiante: docRef.id, ...nuevoEstudiante });
  } catch (error) {
    console.error('Error al crear estudiante:', error);
    res.status(500).json({ error: 'Error al crear estudiante' });
  }
});

// Eliminar un estudiante
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await db.collection('Estudiante').doc(id).delete();
    res.status(200).json({ message: 'Estudiante eliminado correctamente' });
  } catch (error) {
    console.error('Error al eliminar estudiante:', error);
    res.status(500).json({ error: 'Error al eliminar estudiante' });
  }
});

export default router;
