import React from 'react';
import { Box, Typography, Paper } from '@mui/material';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';

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
            minWidth: 500,
            height: 300,
            overflowX: 'auto'
          }}
        >
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              layout="vertical"
              margin={{ top: 20, right: 30, left: 80, bottom: 20 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis dataKey="name" type="category" width={120} />
              <Tooltip />
              <Legend />
              <Bar dataKey="value" name="Cantidad de Profesores">
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
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