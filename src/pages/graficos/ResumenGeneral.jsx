import React from 'react';
import { Box, Grid } from '@mui/material';
import IncidenciasPorTipo from './IncidenciasPorTipo';
import IncidenciasPorEstado from './IncidenciasPorEstado';
import EstudiantesPorSeccion from './EstudiantesPorSeccion';
import TopEstudiantesIncidenciasNivo from './TopEstudiantesIncidenciasNivo';
import IncidenciasPorFecha from './IncidenciasPorFecha';
import IncidenciasCalendar from './IncidenciasCalendar'; // <-- Importa el nuevo gráfico de calendario

const ResumenGeneral = ({ estudiantes = [], incidencias = [] }) => (
  <Grid container spacing={1} sx={{ width: '100%' }}>
    <Grid item xs={12} md={6} lg={6}>
      <Box sx={{ height: 450, width: '100%'}}>
        <IncidenciasPorTipo incidencias={incidencias} />
      </Box>
    </Grid>
    <Grid item xs={12} md={6} lg={6}>
      <Box sx={{ height: 450, width: '100%' }}>
        <IncidenciasPorEstado incidencias={incidencias} />
      </Box>
    </Grid>
    <Grid item xs={12} md={6} lg={6}>
      <Box sx={{ height: 450, width: '100%' }}>
        <EstudiantesPorSeccion estudiantes={estudiantes} />
      </Box>
    </Grid>
    <Grid item xs={12}>
      <Box sx={{ height: 450, width: '100%' }}>
        <TopEstudiantesIncidenciasNivo incidencias={incidencias} top={10} />
      </Box>
    </Grid>
  
    <Grid item xs={12}>
      <Box sx={{ height: 450, width: '100%' }}>
        <IncidenciasPorFecha incidencias={incidencias} />
      </Box>
    </Grid>
    <Grid item xs={12}>
      <Box sx={{ height: 450, width: '100%' }}>
        <IncidenciasCalendar incidencias={incidencias} />
      </Box>
    </Grid>
  </Grid>
);

export default ResumenGeneral;