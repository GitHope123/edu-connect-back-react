import React, { useEffect, useState } from 'react';
import { Box, CircularProgress, Alert, Grid, Typography, useTheme, useMediaQuery } from '@mui/material';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../firebase/firebaseConfig';
import IncidenciasPorTipo from './IncidenciasPorTipo';
import IncidenciasPorEstado from './IncidenciasPorEstado';
import EstudiantesPorNivel from './EstudiantesPorSeccion';
import TopEstudiantesIncidencias from './TopEstudiantesIncidencias';
import ProfesoresPorCargo from './ProfesoresPorCargo';

const ResumenGeneral = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [data, setData] = useState({
    estudiantes: [],
    profesores: [],
    incidencias: []
  });

  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const isMediumScreen = useMediaQuery(theme.breakpoints.between('sm', 'md'));

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        const [estudiantesSnapshot, profesoresSnapshot, incidenciasSnapshot] = await Promise.all([
          getDocs(collection(db, 'Estudiante')),
          getDocs(collection(db, 'Profesor')),
          getDocs(collection(db, 'Incidencia'))
        ]);

        const estudiantesData = estudiantesSnapshot.docs.map(doc => {
          const estudiante = doc.data();
          return {
            id: doc.id,
            nombre: `${estudiante.nombres} ${estudiante.apellidos}`,
            grado: estudiante.grado,
            seccion: estudiante.seccion,
            incidencias: Number(estudiante.cantidadIncidencias) || 0
          };
        });

        setData({
          estudiantes: estudiantesData,
          profesores: profesoresSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })),
          incidencias: incidenciasSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
        });

      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Error al cargar los datos. Por favor, intente nuevamente más tarde.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress size={60} />
        <Typography variant="h6" sx={{ ml: 2 }}>Cargando dashboard...</Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box py={4} px={2}>
        <Alert severity="error" sx={{ fontSize: '1.1rem' }}>
          {error}
          <Box mt={1}>
            <Typography variant="body2">Si el problema persiste, contacte al administrador.</Typography>
          </Box>
        </Alert>
      </Box>
    );
  }

  // Ordenar estudiantes por incidencias para el top
  const topEstudiantes = [...data.estudiantes]
    .sort((a, b) => b.incidencias - a.incidencias)
    .slice(0, 10);

  return (
    <Box sx={{ p: isSmallScreen ? 1 : 3 }}>
      <Typography variant="h4" gutterBottom sx={{ 
        mb: 3, 
        fontWeight: 'bold', 
        color: 'primary.main',
        fontSize: isSmallScreen ? '1.8rem' : '2.125rem'
      }}>
        Resumen General
      </Typography>

      {/* Primera fila - 2 columnas */}
      <Grid container spacing={isSmallScreen ? 2 : 3} sx={{ mb: 3 }}>
        <Grid item xs={12} md={6}>
          <Box sx={{ 
            height: 400, 
            bgcolor: 'background.paper', 
            borderRadius: 2, 
            boxShadow: 1, 
            p: 2
          }}>
            <IncidenciasPorTipo incidencias={data.incidencias} />
          </Box>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <Box sx={{
            height: 400,
            bgcolor: 'background.paper',
            borderRadius: 2,
            boxShadow: 1,
            p: 2
          }}>
            {/* Gráfico */}
          </Box>
        </Grid>
      </Grid>

      {/* Segunda fila - 2 columnas */}
      <Grid container spacing={isSmallScreen ? 2 : 3} sx={{ mb: 3 }}>
        <Grid item xs={12} md={6}>
          <Box sx={{ 
            height: 400, 
            bgcolor: 'background.paper', 
            borderRadius: 2, 
            boxShadow: 1, 
            p: 2
          }}>
            <EstudiantesPorNivel
              estudiantes={data.estudiantes}
              niveles={Array.from({ length: 6 }, (_, i) => i + 1)}
            />
          </Box>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <Box sx={{ 
            height: 400, 
            bgcolor: 'background.paper', 
            borderRadius: 2, 
            boxShadow: 1, 
            p: 2
          }}>
            <ProfesoresPorCargo profesores={data.profesores} />
          </Box>
        </Grid>
      </Grid>

      {/* Tercera fila - 1 columna ancha */}
      <Grid container spacing={isSmallScreen ? 2 : 3}>
        <Grid item xs={12}>
          <Box sx={{ 
            height: isSmallScreen ? 450 : isMediumScreen ? 500 : 550,
            bgcolor: 'background.paper', 
            borderRadius: 2, 
            boxShadow: 3, // Sombra más pronunciada para destacar
            p: 2,
            position: 'relative',
            overflow: 'hidden' // Evita desbordamientos
          }}>
            {topEstudiantes.length > 0 ? (
              <>
                <Box sx={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  p: 2,
                  display: 'flex',
                  flexDirection: 'column'
                }}>
                  <Typography variant="h6" sx={{ 
                    mb: 1, 
                    fontWeight: 'bold',
                    color: 'text.primary'
                  }}>
                    Top 10 Estudiantes con más Incidencias
                  </Typography>
                  <Box sx={{ flex: 1, width: '100%' }}>
                    <TopEstudiantesIncidencias estudiantes={topEstudiantes} />
                  </Box>
                </Box>
                {topEstudiantes[0] && (
                  <Box sx={{
                    position: 'absolute',
                    top: 16,
                    right: 16,
                    bgcolor: 'error.main',
                    color: 'white',
                    px: 2,
                    py: 1,
                    borderRadius: 1,
                    fontSize: isSmallScreen ? '0.75rem' : '0.875rem',
                    fontWeight: 'bold',
                    zIndex: 1,
                    boxShadow: 2
                  }}>
                    Mayor incidencia: {topEstudiantes[0].nombre} ({topEstudiantes[0].incidencias})
                  </Box>
                )}
              </>
            ) : (
              <Box sx={{ 
                display: 'flex', 
                justifyContent: 'center', 
                alignItems: 'center', 
                height: '100%'
              }}>
                <Typography variant="body1" color="text.secondary">
                  No hay datos de estudiantes disponibles
                </Typography>
              </Box>
            )}
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ResumenGeneral;