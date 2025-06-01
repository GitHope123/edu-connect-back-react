import React from "react";
import { Box, Typography, Paper, useTheme } from "@mui/material";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

// Definimos los gradientes que usaremos para las barras
const GRADIENTS = [
  { id: "blue", from: "#0070f3", to: "#0047ab" },
  { id: "green", from: "#00c49f", to: "#008060" },
  { id: "yellow", from: "#ffc107", to: "#d4a005" },
  { id: "orange", from: "#ff6d00", to: "#cc5800" },
  { id: "purple", from: "#8884d8", to: "#665fd1" },
  { id: "teal", from: "#82ca9d", to: "#5cb874" },
];

const EstudiantesPorSeccion = ({ estudiantes }) => {
  const theme = useTheme();

  const getData = () => {
    const countBySeccion = estudiantes.reduce((acc, { seccion }) => {
      if (seccion) {
        acc[seccion] = (acc[seccion] || 0) + 1;
      }
      return acc;
    }, {});

    // Ordenamos alfabéticamente las secciones (A, B, C, D...)
    return Object.entries(countBySeccion)
      .sort(([a], [b]) => a.localeCompare(b)) // Orden alfabético
      .map(([name, value]) => ({
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
        Distribución de Estudiantes por Sección
      </Typography>

      {data.length > 0 ? (
        <Box sx={{ flex: 1, width: "100%", minHeight: "350px" }}>
          <ResponsiveContainer>
            <BarChart
              data={data}
              layout="vertical"
              margin={{
                top: 20,
                right: 30,
                bottom: 20,
              }}
            >
              {/* Definición de gradientes */}
              <defs>
                {GRADIENTS.map((gradient, index) => (
                  <linearGradient
                    key={gradient.id}
                    id={`barGradient-${index}`}
                    x1="0%"
                    y1="0%"
                    x2="100%"
                    y2="0%"
                  >
                    <stop offset="0%" stopColor={gradient.from} />
                    <stop offset="100%" stopColor={gradient.to} />
                  </linearGradient>
                ))}
              </defs>

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
                width={120}
                tick={{
                  fontSize: theme.typography.body2.fontSize,
                  fill: theme.palette.text.primary,
                }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: theme.palette.background.paper,
                  borderRadius: theme.shape.borderRadius,
                  boxShadow: theme.shadows[3],
                  border: "none",
                  color: theme.palette.text.primary,
                }}
              />
              <Legend
                wrapperStyle={{
                  color: theme.palette.text.primary,
                  fontSize: theme.typography.body2.fontSize,
                }}
                formatter={() => (
                  <span
                    style={{
                      color: theme.palette.text.primary,
                      fontWeight: 500,
                    }}
                  >
                    Cantidad de Estudiantes
                  </span>
                )}
              />

              {/* Barra con color dinámico basado en posición */}
              <Bar
                dataKey="value"
                name="Cantidad de Estudiantes"
                barSize={30}
                radius={[0, 4, 4, 0]}
                shape={({ x, y, width, height, index }) => {
                  const gradientId = `barGradient-${index % GRADIENTS.length}`;
                  return (
                    <rect
                      x={x}
                      y={y}
                      width={width}
                      height={height}
                      fill={`url(#${gradientId})`}
                      rx={4}
                      ry={4}
                    />
                  );
                }}
              />
            </BarChart>
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

export default EstudiantesPorSeccion;