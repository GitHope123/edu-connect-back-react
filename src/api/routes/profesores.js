// src/api/routes/profesores.js
import express from 'express';
import db from '../firebaseAdmin.js';

const router = express.Router();

// Obtener todos los profesores
router.get('/', async (req, res) => {
  try {
    const snapshot = await db.collection('Profesor').get();
    const profesores = snapshot.docs.map((doc) => ({
      idProfesor: doc.id,
      ...doc.data(),
    }));
    res.json(profesores);
  } catch (error) {
    console.error('Error al obtener profesores:', error);
    res.status(500).json({ error: 'Error al obtener profesores' });
  }
});

// Crear un nuevo profesor
router.post('/', async (req, res) => {
  try {
    const nuevoProfesor = req.body;
    const docRef = await db.collection('Profesor').add(nuevoProfesor);
    res.status(201).json({ idProfesor: docRef.id, ...nuevoProfesor });
  } catch (error) {
    console.error('Error al crear profesor:', error);
    res.status(500).json({ error: 'Error al crear profesor' });
  }
});

// Eliminar un profesor
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await db.collection('Profesor').doc(id).delete();
    res.status(200).json({ message: 'Profesor eliminado correctamente' });
  } catch (error) {
    console.error('Error al eliminar profesor:', error);
    res.status(500).json({ error: 'Error al eliminar profesor' });
  }
});

export default router;
