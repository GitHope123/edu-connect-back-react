import React, { useMemo, useState } from "react";
import {
  Paper,
  Typography,
  Box,
  useTheme,
  TextField,
  Button,
} from "@mui/material";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  LabelList,
} from "recharts";

// Gradientes modernos tipo glass
const GRADIENTS = [
  { id: "blue", from: "#4f8cff", to: "#1a73e8" },
  { id: "violet", from: "#a18cd1", to: "#fbc2eb" },
  { id: "cyan", from: "#43e97b", to: "#38f9d7" },
  { id: "pink", from: "#ff6a88", to: "#ff99ac" },
  { id: "orange", from: "#ffb347", to: "#ffcc33" },
];

// Utilidad para formatear fechas a YYYY-MM-DD
const formatFecha = (fecha) => {
  if (!fecha || fecha.includes("-")) return fecha;

  const [d, m, y] = fecha.split("/");
  if (d && m && y)
    return `${y}-${m.padStart(2, "0")}-${d.padStart(2, "0")}`;
  return "";
};

// Genera un mapa de fechas relativas para los últimos 10 días
const getRelativeLabels = () => {
  const today = new Date();
  const pad = (n) => String(n).padStart(2, "0");
  const relativeMap = {};

  for (let i = 0; i <= 10; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    const key = `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(
      d.getDate()
    )}`;
    relativeMap[key] =
      i === 0 ? "Hoy" : i === 1 ? "Ayer" : `Hace ${i} días`;
  }

  return relativeMap;
};

const IncidenciasPorFecha = ({ incidencias = [] }) => {
  const theme = useTheme();
  const [inicio, setInicio] = useState("");
  const [fin, setFin] = useState("");

  const relativeMap = useMemo(() => getRelativeLabels(), []);

  // Filtros de fecha y agrupación
  const dataFiltrada = useMemo(() => {
    let data = incidencias.map((item) => ({
      ...item,
      fecha: formatFecha(item.fecha),
    }));

    if (inicio) data = data.filter((item) => item.fecha >= inicio);
    if (fin) data = data.filter((item) => item.fecha <= fin);

    // Agrupa por fecha
    const counts = {};
    data.forEach((item) => {
      counts[item.fecha] = (counts[item.fecha] || 0) + 1;
    });

    // Etiquetas relativas
    const result = Object.entries(counts)
      .map(([fecha, value]) => ({
        fecha: relativeMap[fecha] || fecha,
        value,
        rawFecha: fecha,
      }))
      .sort((a, b) => a.rawFecha.localeCompare(b.rawFecha));

    // Solo mostramos los últimos 10 días (los más recientes)
    return result.slice(-10); // Últimas 10 entradas (las más nuevas)
  }, [incidencias, inicio, fin, relativeMap]);

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
        Incidencias por Fecha
      </Typography>

      <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
        <TextField
          label="Fecha inicio"
          type="date"
          size="small"
          value={inicio}
          onChange={(e) => setInicio(e.target.value)}
          InputLabelProps={{ shrink: true }}
          inputProps={{ placeholder: "YYYY-MM-DD" }}
        />
        <TextField
          label="Fecha fin"
          type="date"
          size="small"
          value={fin}
          onChange={(e) => setFin(e.target.value)}
          InputLabelProps={{ shrink: true }}
          inputProps={{ placeholder: "YYYY-MM-DD" }}
        />
        <Button
          variant="outlined"
          color="primary"
          onClick={() => {
            setInicio("");
            setFin("");
          }}
          aria-label="Limpiar filtros de fecha"
        >
          Limpiar
        </Button>
      </Box>

      <Box sx={{ flex: 1, width: "100%", minHeight: 0 }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={dataFiltrada}
            margin={{ top: 20, right: 30, left: 30, bottom: 40 }}
          >
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
              vertical={false}
            />

            <XAxis
              dataKey="fecha"
              tick={{
                fontSize: 13,
                fill: theme.palette.text.primary,
                fontWeight: 600,
              }}
              height={40}
              interval={0}
            />

            <YAxis
              tick={{
                fontSize: 13,
                fill: theme.palette.text.primary,
                fontWeight: 600,
              }}
              allowDecimals={false}
            />

            <Tooltip
              cursor={{ fill: "rgba(26,115,232,0.07)" }}
              contentStyle={{
                background: theme.palette.background.paper,
                borderRadius: 10,
                boxShadow: theme.shadows[4],
                border: `1px solid ${theme.palette.divider}`,
                fontWeight: 500,
              }}
              itemStyle={{
                color: theme.palette.text.primary,
              }}
              formatter={(value) => [`${value}`, "Incidencias"]}
              labelFormatter={(label) => label}
            />

            <Bar
              dataKey="value"
              name="Cantidad de Incidencias"
              barSize={32}
              radius={[8, 8, 0, 0]}
              isAnimationActive={true}
              animationDuration={900}
              fillOpacity={1}
            >
              <LabelList
                dataKey="value"
                position="top"
                style={{
                  fill: "#232946",
                  fontWeight: 700,
                  fontSize: 15,
                  textShadow: "0 2px 8px rgba(35,41,70,0.10)",
                }}
              />
              {dataFiltrada.map((_, index) => (
                <Cell
                  key={index}
                  fill={`url(#barGradient-${index % GRADIENTS.length})`}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </Box>
    </Paper>
  );
};

export default IncidenciasPorFecha;