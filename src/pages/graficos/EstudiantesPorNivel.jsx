import React from 'react';
import { Box, Typography, Paper, useTheme } from '@mui/material';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const EstudiantesPorNivel = ({ estudiantes }) => {
  const theme = useTheme();

  const getData = () => {
    const countByLevel = estudiantes.reduce((acc, { nivel }) => {
      if (nivel) { // Solo contar si existe el nivel
        acc[nivel] = (acc[nivel] || 0) + 1;
      }
      return acc;
    }, {});

    return Object.entries(countByLevel).map(([name, value]) => ({
      name,
      value
    }));
  };

  const data = getData();

  return (
    <Paper elevation={3} sx={{ 
      p: 2, 
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      minHeight: '400px' // Altura mínima garantizada
    }}>
      <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'bold' }}>
        Distribución de Estudiantes por Nivel Educativo
      </Typography>
      
      {data.length > 0 ? (
        <Box sx={{
          flex: 1,
          width: '100%',
          minWidth: 500,
          height: '100%',
          minHeight: '350px'
        }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              layout="vertical" // Cambiado a vertical para mejor uso del espacio
              margin={{
                top: 20,
                right: 30,
                left: 40, // Más espacio para etiquetas
                bottom: 20,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis 
                dataKey="name" 
                type="category" 
                width={100} // Más espacio para nombres de niveles
                tick={{ fontSize: theme.typography.body2.fontSize }}
              />
              <Tooltip 
                contentStyle={{
                  borderRadius: theme.shape.borderRadius,
                  boxShadow: theme.shadows[3],
                  border: 'none'
                }}
              />
              <Legend />
              <Bar 
                dataKey="value" 
                fill={theme.palette.primary.main} 
                name="Cantidad de Estudiantes"
                //el ancho de la barra se ajusta automáticamente
                // pero puedes establecer un valor fijo si lo prefieres
                barSize={70}
                radius={[0, 4, 4, 0]} // Bordes redondeados solo a la derecha
              />
            </BarChart>
          </ResponsiveContainer>
        </Box>
      ) : (
        <Box sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '350px',
          color: theme.palette.text.secondary
        }}>
          <Typography variant="body2">
            No hay datos de estudiantes disponibles
          </Typography>
        </Box>
      )}
    </Paper>
  );
};

export default EstudiantesPorNivel;