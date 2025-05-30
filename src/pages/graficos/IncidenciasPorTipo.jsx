import React from 'react';
import { Box, Typography, Paper, useTheme } from '@mui/material';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D'];

const IncidenciasPorTipo = ({ incidencias }) => {
  const theme = useTheme();

  const getData = () => {
    const countByType = incidencias.reduce((acc, { tipo }) => {
      if (tipo) {
        acc[tipo] = (acc[tipo] || 0) + 1;
      }
      return acc;
    }, {});

    return Object.entries(countByType).map(([name, value]) => ({
      name,
      value
    }));
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
        Distribución de Incidencias por Tipo
      </Typography>

      {data.length > 0 ? (
        <Box sx={{
          flex: 1,
          width: '100%',
          height: '100%',
        }}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={100}
                fill={theme.palette.primary.main}
                dataKey="value"
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: theme.palette.background.paper,
                  borderRadius: theme.shape.borderRadius,
                  boxShadow: theme.shadows[3],
                  border: 'none'
                }}
              />
              <Legend />
            </PieChart>
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

export default IncidenciasPorTipo;