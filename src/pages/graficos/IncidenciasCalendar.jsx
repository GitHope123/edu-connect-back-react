import React, { useMemo } from "react";
import { Paper, Typography, Box, useTheme, Stack } from "@mui/material";
import { ResponsiveCalendar } from "@nivo/calendar";

// Convierte incidencias a formato de Nivo Calendar
function incidenciasToCalendarData(incidencias = []) {
  const counts = {};
  incidencias.forEach((inc) => {
    let fecha = inc.fecha;
    if (fecha && fecha.includes("/")) {
      const [d, m, y] = fecha.split("/");
      fecha = `${y}-${m.padStart(2, "0")}-${d.padStart(2, "0")}`;
    }
    if (fecha) counts[fecha] = (counts[fecha] || 0) + 1;
  });
  return Object.entries(counts).map(([day, value]) => ({ day, value }));
}

// Escala de colores rojo-naranja para incidencias

const COLOR_SCALE = [
  "#f3e5f5", // Muy claro - Mínimo (0-1 incidencias)
  "#e1bee7",
  "#ce93d8",
  "#ba68c8",
  "#ab47bc",
  "#9c27b0", // Medio
  "#8e24aa",
  "#7b1fa2",
  "#6a1b9a",
  "#4a148c", // Máximo (más incidencias)
];


const IncidenciasCalendar = ({ incidencias = [] }) => {
  const theme = useTheme();
  const data = useMemo(() => incidenciasToCalendarData(incidencias), [incidencias]);

  // Encuentra el rango de fechas
  const allDates = data.map(d => d.day).sort();
  const from = allDates[0] || new Date().toISOString().split('T')[0];
  const to = allDates[allDates.length - 1] || from;

  // Calcular valores para la leyenda
  const values = data.map(d => d.value);
  const maxValue = Math.max(...values, 1);
  const legendThresholds = [
    0,
    Math.ceil(maxValue * 0.2),
    Math.ceil(maxValue * 0.4),
    Math.ceil(maxValue * 0.6),
    Math.ceil(maxValue * 0.8),
    maxValue
  ];

  return (
    <Paper
      elevation={0}
      sx={{
        p: 3,
        width: 1243,
        maxWidth: "100%",
        height: 400,
        minHeight: 400,
        background: "rgba(255, 255, 255, 0.7)",
        backdropFilter: "blur(12px)",
        borderRadius: theme.shape.borderRadius,
        boxShadow: "0 4px 30px rgba(0, 0, 0, 0.1)",
        border: "1px solid rgba(255, 255, 255, 0.3)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        transition: "transform 0.3s ease, box-shadow 0.3s ease",
        "&:hover": {
          transform: "translateY(-5px)",
          boxShadow: "0 8px 32px rgba(0, 0, 0, 0.15)",
        },
      }}
    >
      <Typography
              variant="h6"
              gutterBottom
              sx={{
                fontWeight: 700,
                background: "linear-gradient(90deg, #232946 0%, #3a506b 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                mb: 2,
                letterSpacing: 1,
                textShadow: "0 2px 8px rgba(35,41,70,0.10)",
                textAlign: "center",
              }}
            >
              Panorama de Incidencias por Fecha
            </Typography>

      {/* Leyenda personalizada */}
      <Stack direction="row" alignItems="center" justifyContent="center" spacing={1} sx={{ mb: 2 }}>
        {legendThresholds.map((value, i) => (
          <Box key={i} sx={{ display: "flex", alignItems: "center" }}>
            <Box
              sx={{
                width: 24,
                height: 16,
                background: COLOR_SCALE[Math.floor(i * (COLOR_SCALE.length / legendThresholds.length))],
                border: "1px solid rgba(255,255,255,0.5)",
                mr: 0.5,
              }}
            />
            <Typography variant="caption" sx={{ color: theme.palette.text.secondary }}>
              {i === 0 ? `${value}` : i === legendThresholds.length - 1 ? `+${value}` : value}
            </Typography>
          </Box>
        ))}
      </Stack>

      <Box sx={{ flex: 1, width: "100%", height: 300 }}>
        <ResponsiveCalendar
          data={data}
          from={from}
          to={to}
          emptyColor="#f5f5f5"
          colors={COLOR_SCALE}
          margin={{ top: 0, right: 20, bottom: 0, left: 20 }}
          yearSpacing={30}
          monthBorderColor="#ffffff"
          dayBorderWidth={1}
          dayBorderColor="#ffffff"
          theme={{
            textColor: theme.palette.text.primary,
            tooltip: {
              container: {
                background: "rgba(255, 255, 255, 0.9)",
                backdropFilter: "blur(4px)",
                color: theme.palette.text.primary,
                borderRadius: theme.shape.borderRadius,
                boxShadow: theme.shadows[2],
                border: "1px solid rgba(255, 255, 255, 0.3)",
                fontWeight: 500,
              },
            },
          }}
          legends={[]}
          tooltip={({ day, value }) => (
            <Box sx={{ p: 1.5 }}>
              <Typography variant="subtitle2" fontWeight={600}>
                {new Date(day).toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' })}
              </Typography>
              <Typography variant="body2" sx={{ mt: 0.5 }}>
                <Box component="span" sx={{ fontWeight: 500, color: theme.palette.error.main }}>
                  {value || 0}
                </Box> incidencia{value !== 1 ? 's' : ''}
              </Typography>
            </Box>
          )}
        />
      </Box>
    </Paper>
  );
};

export default IncidenciasCalendar;