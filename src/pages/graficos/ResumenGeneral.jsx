import React, { useState, useMemo } from 'react';
import { Box, Grid } from '@mui/material';
import IncidenciasPorTipo from './IncidenciasPorTipo';
import IncidenciasPorEstado from './IncidenciasPorEstado';
import EstudiantesPorSeccion from './EstudiantesPorSeccion';
import TopEstudiantesIncidenciasNivo from './TopEstudiantesIncidenciasNivo';
import IncidenciasPorFecha from './IncidenciasPorFecha';
import IncidenciasCalendar from './IncidenciasCalendar';
import FiltrosResumenGeneral from './FiltrosResumenGeneral';

// Utilidad para normalizar fechas a YYYY-MM-DD
const formatFecha = (fecha) => {
  if (!fecha) return "";
  if (fecha.includes("-")) return fecha;
  const [d, m, y] = fecha.split("/");
  if (d && m && y) return `${y}-${m.padStart(2, "0")}-${d.padStart(2, "0")}`;
  return fecha;
};

// Convierte fecha YYYY-MM-DD a timestamp
const fechaToTs = (fecha) => fecha ? new Date(fecha).getTime() : 0;
// Convierte timestamp a fecha YYYY-MM-DD
const tsToFecha = (ts) => new Date(ts).toISOString().slice(0, 10);

const ResumenGeneral = ({ estudiantes = [], incidencias = [] }) => {
  // Obtener todas las fechas normalizadas y ordenadas
  const fechas = useMemo(() => {
    const arr = incidencias
      .map(i => formatFecha(i.fecha))
      .filter(Boolean)
      .sort();
    return Array.from(new Set(arr));
  }, [incidencias]);

  const minFecha = fechas[0];
  const maxFecha = fechas[fechas.length - 1];

  // Estado del slider: [timestampInicio, timestampFin]
  const [rango, setRango] = useState([
    fechaToTs(minFecha),
    fechaToTs(maxFecha)
  ]);

  // Filtro de tipo de incidencia
  const [tipo, setTipo] = useState("todos");

  // Actualiza el slider si cambian las fechas mínimas/máximas
  React.useEffect(() => {
    setRango([fechaToTs(minFecha), fechaToTs(maxFecha)]);
  }, [minFecha, maxFecha]);


  // Filtra incidencias por rango de fechas y tipo
  const incidenciasFiltradas = useMemo(() => {
    return incidencias.filter(i => {
      const fecha = formatFecha(i.fecha);
      const ts = fechaToTs(fecha);
      const tipoInc = i.tipo?.toLowerCase?.() || "desconocido";
      const tipoMatch = tipo === "todos" || tipoInc === tipo;
      return ts >= rango[0] && ts <= rango[1] && tipoMatch;
    });
  }, [incidencias, rango, tipo]);

  return (
    <Box sx={{ width: '100%' }}>
      {/* Contenedor de filtros */}
      <FiltrosResumenGeneral
        tipo={tipo}
        setTipo={setTipo}
        rango={rango}
        setRango={setRango}
        minFecha={minFecha}
        maxFecha={maxFecha}
        fechaToTs={fechaToTs}
        tsToFecha={tsToFecha}
      />

      {/* Grilla de gráficos */}
      <Grid container spacing={2} sx={{ width: '100%' }}>
        <Grid item xs={12} md={6}>
          <Box sx={{ height: 450, width: '100%' }}>
            <IncidenciasPorTipo incidencias={incidenciasFiltradas} />
          </Box>
        </Grid>
        <Grid item xs={12} md={6}>
          <Box sx={{ height: 450, width: '100%' }}>
            <IncidenciasPorEstado incidencias={incidenciasFiltradas} />
          </Box>
        </Grid>
        <Grid item xs={12} md={6}>
          <Box sx={{ height: 450, width: '100%' }}>
            <EstudiantesPorSeccion estudiantes={estudiantes} />
          </Box>
        </Grid>
        <Grid item xs={12}>
          <Box sx={{ height: 450, width: '100%' }}>
            <TopEstudiantesIncidenciasNivo incidencias={incidenciasFiltradas} top={10} />
          </Box>
        </Grid>
        <Grid item xs={12}>
          <Box sx={{ height: 450, width: '100%' }}>
            <IncidenciasPorFecha incidencias={incidenciasFiltradas} />
          </Box>
        </Grid>
        <Grid item xs={12}>
          <Box sx={{ height: 450, width: '100%' }}>
            <IncidenciasCalendar incidencias={incidenciasFiltradas} />
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ResumenGeneral;