import React from "react";
import { Paper, Typography, Box, useTheme } from "@mui/material";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LabelList,
  Cell,
} from "recharts";

// Gradientes modernos tipo glass
const GRADIENTS = [
  { id: "blue", from: "rgba(79, 140, 255, 0.8)", to: "rgba(26, 115, 232, 0.8)" },
  { id: "violet", from: "rgba(161, 140, 209, 0.8)", to: "rgba(251, 194, 235, 0.8)" },
  { id: "cyan", from: "rgba(67, 233, 123, 0.8)", to: "rgba(56, 249, 215, 0.8)" },
  { id: "pink", from: "rgba(255, 106, 136, 0.8)", to: "rgba(255, 153, 172, 0.8)" },
  { id: "orange", from: "rgba(255, 179, 71, 0.8)", to: "rgba(255, 204, 51, 0.8)" },
];

const TopEstudiantesIncidenciasNivo = ({ incidencias = [] }) => {
  const theme = useTheme();
  const top = 5;

  // Agrupar por nombre y apellido
  const counts = {};
  incidencias.forEach((inc) => {
    const key = `${inc.nombreEstudiante} ${inc.apellidoEstudiante}`.trim();
    if (!counts[key]) {
      counts[key] = {
        nombreCompleto: key,
        incidencias: 0,
      };
    }
    counts[key].incidencias += 1;
  });

  // Ordenar y tomar top 5
  const data = Object.values(counts)
    .sort((a, b) => b.incidencias - a.incidencias)
    .slice(0, top);

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
        Top Estudiantes con Más Incidencias
      </Typography>

      <Box sx={{ flex: 1, width: "100%", minHeight: "350px" }}>
        <ResponsiveContainer>
          <BarChart
            data={data}
            layout="vertical"
            margin={{
              top: 10,
              right: 30,
              bottom: 10,
            }}
            barCategoryGap="15%"
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
              horizontal
              vertical={false}
            />

            <XAxis
              type="number"
              tick={{
                fontSize: theme.typography.body2.fontSize,
                fill: theme.palette.text.secondary,
                fontWeight: 500,
              }}
              axisLine={false}
              tickLine={false}
            />

            <YAxis
              dataKey="nombreCompleto"
              type="category"
              width={150}
              tick={{
                fontSize: theme.typography.body2.fontSize,
                fill: theme.palette.text.primary,
                fontWeight: 600,
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
                maxWidth: "120px",
              }}
              axisLine={false}
              tickLine={false}
              interval={0}
            />

            <Tooltip
              cursor={{ fill: "rgba(26, 115, 232, 0.05)" }}
              contentStyle={{
                backgroundColor: theme.palette.background.paper,
                borderRadius: theme.shape.borderRadius,
                boxShadow: theme.shadows[3],
                border: "none",
                color: theme.palette.text.primary,
                fontWeight: 500,
              }}
              itemStyle={{
                color: theme.palette.text.primary,
              }}
              formatter={(value) => [`${value}`, "Incidencias"]}
              labelFormatter={(label) => `Estudiante: ${label}`}
            />

            <Bar
              dataKey="incidencias"
              name="Incidencias"
              barSize={30}
              radius={[0, 4, 4, 0]}
              animationDuration={800}
            >
              <LabelList
                dataKey="incidencias"
                position="right"
                style={{
                  fill: theme.palette.text.primary,
                  fontWeight: 600,
                  fontSize: 13,
                }}
              />
              {data.map((_, index) => (
                <Cell
                  key={index}
                  fill={`url(#barGradient-${index % GRADIENTS.length})`}
                  stroke="rgba(255, 255, 255, 0.5)"
                  strokeWidth={1}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </Box>
    </Paper>
  );
};

export default TopEstudiantesIncidenciasNivo;