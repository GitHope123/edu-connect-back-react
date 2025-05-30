import React, { useEffect, useState } from 'react';
import { Box, CircularProgress, Alert, Grid } from '@mui/material';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../firebase/firebaseConfig';
import IncidenciasPorTipo from './IncidenciasPorTipo';
import IncidenciasPorEstado from './IncidenciasPorEstado';
import EstudiantesPorSeccion from './EstudiantesPorSeccion';
import ProfesoresPorCargo from './ProfesoresPorCargo';

const ResumenGeneral = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [data, setData] = useState({
    estudiantes: [],
    profesores: [],
    incidencias: []
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const [estudiantesSnapshot, profesoresSnapshot, incidenciasSnapshot] = await Promise.all([
          getDocs(collection(db, 'Estudiante')),
          getDocs(collection(db, 'Profesor')),
          getDocs(collection(db, 'Incidencia'))
        ]);

        setData({
          estudiantes: estudiantesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })),
          profesores: profesoresSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })),
          incidencias: incidenciasSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
        });

      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Error al cargar los datos. Intente nuevamente.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" py={4}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box py={2}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  return (
    <Grid container spacing={3} sx={{ width: '100%' }}>
      <Grid item xs={12} md={6} lg={6}>
        <Box sx={{ height: 450, width: '100%' }}>
          <IncidenciasPorTipo incidencias={data.incidencias} />
        </Box>
      </Grid>

      <Grid item xs={12} md={6} lg={6}>
        <Box sx={{ height: 450, width: '100%' }}>
          <IncidenciasPorEstado incidencias={data.incidencias} />
        </Box>
      </Grid>

      <Grid item xs={12} md={6} lg={6}>
        <Box sx={{ height: 450, width: '100%' }}>
          <EstudiantesPorSeccion estudiantes={data.estudiantes} />
        </Box>
      </Grid>

      <Grid item xs={12} md={6} lg={6}>
        <Box sx={{ height: 450, width: '100%' }}>
          <ProfesoresPorCargo profesores={data.profesores} />
        </Box>
      </Grid>
    </Grid>
  );
};

export default ResumenGeneral;