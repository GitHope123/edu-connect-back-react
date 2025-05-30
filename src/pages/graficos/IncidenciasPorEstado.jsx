import React from 'react';
import { Box, Typography, Paper, useTheme } from '@mui/material';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const IncidenciasPorEstado = ({ incidencias }) => {
  const theme = useTheme();

  const getData = () => {
    const countByStatus = incidencias.reduce((acc, { estado }) => {
      if (estado) {
        acc[estado] = (acc[estado] || 0) + 1;
      }
      return acc;
    }, {});

    return Object.entries(countByStatus)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);
  };

  const data = getData();

  return (
    <Paper elevation={3} sx={{
      p: 2,
      height: '100%',
      minHeight: 350,
      maxHeight: 400,
      display: 'flex',
      flexDirection: 'column',
    }}>
      <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'bold' }}>
        Distribución de Incidencias por Estado
      </Typography>

      {data.length > 0 ? (
        <Box sx={{
          flex: 1,
          width: '100%',
          height: '100%',
        }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              margin={{
                top: 20,
                right: 30,
                left: 20,
                bottom: 40,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke={theme.palette.divider} />
              <XAxis 
                dataKey="name" 
                tick={{ fontSize: theme.typography.body2.fontSize }}
              />
              <YAxis 
                tick={{ fontSize: theme.typography.body2.fontSize }} 
              />
              <Tooltip 
                contentStyle={{
                  backgroundColor: theme.palette.background.paper,
                  borderRadius: theme.shape.borderRadius,
                  boxShadow: theme.shadows[3],
                  border: 'none'
                }}
              />
              <Legend />
              <Bar 
                dataKey="value" 
                fill={theme.palette.secondary.main} 
                name="Número de Incidencias"
                radius={[4, 4, 0, 0]} 
                barSize={70}
              />
            </BarChart>
          </ResponsiveContainer>
        </Box>
      ) : (
        <Box sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          flex: 1,
          color: theme.palette.text.secondary
        }}>
          <Typography variant="body2">
            No hay datos de incidencias disponibles
          </Typography>
        </Box>
      )}
    </Paper>
  );
};

export default IncidenciasPorEstado;