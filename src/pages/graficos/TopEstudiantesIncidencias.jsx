import React from 'react';
import PropTypes from 'prop-types';
import { Box, Typography, Paper, useTheme, useMediaQuery } from '@mui/material';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const TopEstudiantesIncidencias = ({ estudiantes = [] }) => {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const isMediumScreen = useMediaQuery(theme.breakpoints.between('sm', 'md'));

  // Normaliza incidencias a número
  const data = estudiantes.map(est => ({
    ...est,
    nombre: est.nombre.length > 20 ? `${est.nombre.substring(0, 20)}...` : est.nombre,
    incidencias: Array.isArray(est.incidencias)
      ? est.incidencias.length
      : Number(est.incidencias) || 0,
  }));

  // Colores para las barras (gradiente del primario)
  const colors = [
    theme.palette.primary.light,
    theme.palette.primary.main,
    theme.palette.primary.dark,
    theme.palette.secondary.main,
    theme.palette.error.main,
    theme.palette.warning.main,
  ];

  // Ajustar márgenes según el tamaño de pantalla
  const chartMargins = isSmallScreen 
    ? { top: 10, right: 10, left: 60, bottom: 10 }
    : isMediumScreen
    ? { top: 15, right: 20, left: 80, bottom: 15 }
    : { top: 20, right: 30, left: 100, bottom: 20 };

  return (
    <Paper
      elevation={3}
      sx={{
        p: 2,
        height: '100%',
        minHeight: 400,
        maxHeight: 500,
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {data.length > 0 ? (
        <Box sx={{ 
          flex: 1, 
          width: '100%', 
          height: '100%',
          overflow: 'hidden' // Previene desbordamiento
        }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              layout="vertical"
              margin={chartMargins}
              barSize={isSmallScreen ? 12 : 18} // Barras más delgadas en móviles
            >
              <CartesianGrid strokeDasharray="3 3" stroke={theme.palette.divider} />
              <XAxis 
                type="number" 
                tick={{ fontSize: isSmallScreen ? 10 : 12 }}
                tickFormatter={(value) => Math.floor(value) === value ? value : ''}
              />
              <YAxis
                dataKey="nombre"
                type="category"
                width={isSmallScreen ? 80 : isMediumScreen ? 100 : 120}
                tick={{ fontSize: isSmallScreen ? 10 : 12 }}
              />
              <Tooltip
                formatter={(value) => [`${value} incidencia${value !== 1 ? 's' : ''}`, 'Total']}
                labelFormatter={(value) => `Estudiante: ${value}`}
                contentStyle={{
                  backgroundColor: theme.palette.background.paper,
                  borderColor: theme.palette.divider,
                  borderRadius: theme.shape.borderRadius
                }}
              />
              <Bar 
                dataKey="incidencias" 
                name="Incidencias"
                radius={[0, 4, 4, 0]} // Bordes redondeados solo a la derecha
              >
                {data.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={colors[index % colors.length]} 
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </Box>
      ) : (
        <Typography variant="body2" color="text.secondary" sx={{ 
          textAlign: 'center', 
          mt: 4,
          alignSelf: 'center',
          flex: 1,
          display: 'flex',
          alignItems: 'center'
        }}>
          No hay datos de estudiantes disponibles
        </Typography>
      )}
    </Paper>
  );
};

TopEstudiantesIncidencias.propTypes = {
  estudiantes: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      nombre: PropTypes.string.isRequired,
      incidencias: PropTypes.oneOfType([
        PropTypes.number,
        PropTypes.array,
      ]).isRequired,
    })
  ),
};

export default TopEstudiantesIncidencias;