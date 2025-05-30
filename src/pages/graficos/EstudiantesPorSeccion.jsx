import React from 'react';
import { Box, Typography, Paper, useTheme } from '@mui/material';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const EstudiantesPorSeccion = ({ estudiantes }) => {
  const theme = useTheme();

  const getData = () => {
    const countBySeccion = estudiantes.reduce((acc, { seccion }) => {
      if (seccion) {
        acc[seccion] = (acc[seccion] || 0) + 1;
      }
      return acc;
    }, {});

    return Object.entries(countBySeccion).map(([name, value]) => ({
      name,
      value
    }));
  };

  const data = getData();

  return (
    <Paper elevation={3} sx={{
      p: 2,
      height: '100%',
      minHeight: 300,
      maxHeight: 400,
      display: 'flex',
      flexDirection: 'column',
    }}>
      <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'bold' }}>
        Distribución de Estudiantes por Sección
      </Typography>

      {data.length > 0 ? (
        <Box sx={{
          flex: 1,
          width: '100%',
          height: '100%',
          overflowY: 'auto',
        }}>
          <ResponsiveContainer width="100%" height={Math.max(300, Math.min(400, data.length * 40))}>
            <BarChart
              data={data}
              layout="vertical"
              margin={{
                top: 20,
                right: 30,
                left: 40,
                bottom: 20,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis
                dataKey="name"
                type="category"
                width={100}
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
                barSize={40}
                radius={[0, 4, 4, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </Box>
      ) : (
        <Box sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: 300,
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

export default EstudiantesPorSeccion;