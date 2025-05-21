import React from 'react';
import { Box, Typography, Paper } from '@mui/material';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

const ProfesoresPorCargo = ({ profesores }) => {
  const getData = () => {
    const countByRole = profesores.reduce((acc, { cargo }) => {
      acc[cargo] = (acc[cargo] || 0) + 1;
      return acc;
    }, {});

    return Object.entries(countByRole).map(([name, value]) => ({
      name,
      value
    }));
  };

  const data = getData();

  return (
    <Paper elevation={3} sx={{ p: 2, height: '100%' }}>
      <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'bold' }}>
        Profesores por Cargo
      </Typography>
      
      {data.length > 0 ? (
        <Box
          sx={{
            width: '100%',
            minWidth: 500,        // Asegura que el gráfico no se corte
            height: 300,
            overflowX: 'auto'     // Scroll horizontal si es necesario
          }}
        >
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </Box>
      ) : (
        <Typography variant="body2" color="textSecondary" align="center" py={4}>
          No hay datos de profesores disponibles
        </Typography>
      )}
    </Paper>
  );
};

export default ProfesoresPorCargo;
