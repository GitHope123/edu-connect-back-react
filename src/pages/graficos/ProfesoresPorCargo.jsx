import React from 'react';
import { Box, Typography, Paper, useTheme, useMediaQuery } from '@mui/material';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';

const ProfesoresPorCargo = ({ profesores = [] }) => {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const isMediumScreen = useMediaQuery(theme.breakpoints.between('sm', 'md'));

  const getData = () => {
    const countByCargo = profesores.reduce((acc, { cargo }) => {
      if (cargo) {
        acc[cargo] = (acc[cargo] || 0) + 1;
      }
      return acc;
    }, {});

    return Object.entries(countByCargo).map(([name, value]) => ({
      name,
      value
    }));
  };

  const data = getData();

  // Ajustes responsivos
  const chartHeight = isSmallScreen ? 300 : isMediumScreen ? 350 : 400;
  const yAxisWidth = isSmallScreen ? 120 : isMediumScreen ? 150 : 180;
  const marginLeft = isSmallScreen ? 80 : isMediumScreen ? 100 : 120;
  const barSize = isSmallScreen ? 20 : 24;

  return (
    <Paper 
      elevation={3} 
      sx={{ 
        p: 2, 
        height: '100%', 
        minHeight: 300, 
        display: 'flex', 
        flexDirection: 'column',
        overflow: 'hidden' // Evita desbordamientos
      }}
    >
      <Typography 
        variant="subtitle1" 
        gutterBottom 
        sx={{ 
          fontWeight: 'bold',
          fontSize: isSmallScreen ? '1rem' : '1.1rem'
        }}
      >
        Profesores por Cargo
      </Typography>

      {data.length > 0 ? (
        <Box sx={{ flex: 1, width: '100%' }}>
          <ResponsiveContainer width="100%" height={chartHeight}>
            <BarChart
              data={data}
              layout="vertical"
              margin={{ 
                top: 20, 
                right: 20, 
                left: marginLeft, 
                bottom: 20 
              }}
            >
              <CartesianGrid 
                strokeDasharray="3 3" 
                stroke={theme.palette.divider} 
              />
              <XAxis 
                type="number" 
                tick={{ fontSize: theme.typography.body2.fontSize }}
              />
              <YAxis
                dataKey="name"
                type="category"
                width={yAxisWidth}
                tick={{ 
                  fontSize: isSmallScreen 
                    ? theme.typography.caption.fontSize 
                    : theme.typography.body2.fontSize 
                }}
              />
              <Tooltip 
                formatter={(value) => [`${value} profesor${value !== 1 ? 'es' : ''}`, 'Total']}
                labelFormatter={(label) => `Cargo: ${label}`}
                contentStyle={{
                  backgroundColor: theme.palette.background.paper,
                  borderColor: theme.palette.divider,
                  borderRadius: theme.shape.borderRadius
                }}
              />
              <Bar
                dataKey="value"
                fill={theme.palette.success.main}
                name="Profesores"
                barSize={barSize}
                radius={[0, 4, 4, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </Box>
      ) : (
        <Box 
          sx={{ 
            flex: 1, 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center' 
          }}
        >
          <Typography 
            variant="body2" 
            color="text.secondary" 
            sx={{ textAlign: 'center' }}
          >
            No hay datos de profesores disponibles
          </Typography>
        </Box>
      )}
    </Paper>
  );
};

export default ProfesoresPorCargo;