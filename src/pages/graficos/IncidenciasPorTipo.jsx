import React from "react";
import { Box, Typography, Paper, useTheme } from "@mui/material";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";

// Definimos los colores base para crear gradientes dinámicos
const GRADIENTS = [
  { id: "blue", from: "#0070f3", to: "#0047ab" },
  { id: "green", from: "#00c49f", to: "#008060" },
  { id: "yellow", from: "#ffc107", to: "#d4a005" },
  { id: "orange", from: "#ff6d00", to: "#cc5800" },
  { id: "purple", from: "#8884d8", to: "#665fd1" },
  { id: "teal", from: "#82ca9d", to: "#5cb874" },
];

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
      value,
    }));
  };

  const data = getData();

  return (
    <Paper
      elevation={0}
      sx={{
        p: 3,
        width: 620,
        height: "100%",
        display: "flex",
        flexDirection: "column",
        minHeight: "400px",
        background: theme.palette.background.paper,
        borderRadius: theme.shape.borderRadius,
        border: `1px solid ${theme.palette.divider}`,
        boxShadow: theme.shadows[1],
        transition: "transform 0.3s ease, box-shadow 0.3s ease",
        "&:hover": {
          transform: "translateY(-5px)",
          boxShadow: theme.shadows[3],
        },
      }}
    >
      <Typography
        variant="h6"
        gutterBottom
        sx={{
          fontWeight: 600,
          background: "linear-gradient(90deg, #232946 0%, #3a506b 100%)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          mb: 3,
          letterSpacing: 1,
          textShadow: "0 2px 8px rgba(35,41,70,0.10)",
        }}
      >
        Distribución de Incidencias por Tipo
      </Typography>

      {data.length > 0 ? (
        <Box
          sx={{ flex: 1, width: "100%", height: "100%", minHeight: "350px" }}
        >
          <ResponsiveContainer>
            <PieChart>
              {/* Aquí insertamos los gradientes */}
              <defs>
                {GRADIENTS.map((gradient, index) => (
                  <linearGradient
                    key={gradient.id}
                    id={`gradient-${index}`}
                    x1="0%"
                    y1="0%"
                    x2="100%"
                    y2="100%"
                  >
                    <stop offset="0%" stopColor={gradient.from} />
                    <stop offset="100%" stopColor={gradient.to} />
                  </linearGradient>
                ))}
              </defs>

              <Pie
                data={data}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={110}
                innerRadius={60}
                paddingAngle={2}
                cornerRadius={8}
                dataKey="value"
                label={({ name, percent }) =>
                  `${name}: ${(percent * 100).toFixed(0)}%`
                }
              >
                {data.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={`url(#gradient-${index % GRADIENTS.length})`}
                    stroke={theme.palette.background.paper}
                    strokeWidth={2}
                  />
                ))}
              </Pie>

              <Tooltip
                contentStyle={{
                  backgroundColor: theme.palette.background.paper,
                  borderRadius: theme.shape.borderRadius,
                  boxShadow: theme.shadows[2],
                  border: `1px solid ${theme.palette.divider}`,
                  padding: theme.spacing(1),
                  fontWeight: 500,
                }}
                itemStyle={{
                  color: theme.palette.text.primary,
                }}
                formatter={(value, name) => [value, name]}
              />

              <Legend
                wrapperStyle={{
                  paddingTop: theme.spacing(2),
                }}
                formatter={(value) => (
                  <span
                    style={{
                      color: theme.palette.text.primary,
                      fontWeight: 500,
                      fontSize: "0.8rem",
                    }}
                  >
                    {value}
                  </span>
                )}
              />
            </PieChart>
          </ResponsiveContainer>
        </Box>
      ) : (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "350px",
            color: theme.palette.text.secondary,
            background: theme.palette.action.hover,
            borderRadius: theme.shape.borderRadius,
          }}
        >
          <Typography variant="body1" fontWeight={500}>
            No hay datos disponibles
          </Typography>
        </Box>
      )}
    </Paper>
  );
};

export default IncidenciasPorTipo;
