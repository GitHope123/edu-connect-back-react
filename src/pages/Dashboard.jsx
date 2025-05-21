import React from "react";
import { Box, Typography, Grid, Paper, useTheme } from "@mui/material";
import ResumenGeneral from "./graficos/ResumenGeneral";

const Dashboard = () => {
  const theme = useTheme();

  const cardData = [
    {
      title: "Estudiantes",
      description: "Gestión de estudiantes registrados",
      bgColor: theme.palette.primary.light,
      textColor: theme.palette.primary.dark,
      path: "/estudiantes",
    },
    {
      title: "Profesores",
      description: "Administración de profesores",
      bgColor: theme.palette.success.light,
      textColor: theme.palette.success.dark,
      path: "/profesores",
    },
    {
      title: "Incidencias",
      description: "Reportes y seguimiento",
      bgColor: theme.palette.error.light,
      textColor: theme.palette.error.dark,
      path: "/incidencias",
    },
  ];

  return (
    <Box
      sx={{
        p: { xs: 2, md: 4 },
        width: "100%",
        mx: "auto",
        maxWidth: "100%",
      }}
    >
      {/* Encabezado */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" fontWeight="bold" gutterBottom>
          Panel de Control Escolar
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Visión general del sistema educativo
        </Typography>
      </Box>

      {/* Cards de acceso rápido */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {cardData.map(({ title, description, textColor, bgColor }) => (
          <Grid
            item
            xs={12}
            width={"27%"}
            key={title}
            sx={{
              display: "flex",
              justifyContent: "center",
            }}
          >
            <Paper
              variant="outlined"
              elevation={0}
              sx={{
                p: 2.5,
                width: "100%",
                maxWidth: "100%",
                color: textColor,
                borderRadius: 2,
                border: `2px solid ${textColor}`,
                backgroundColor: "transparent",
                transition:
                  "transform 0.2s, box-shadow 0.2s, border-color 0.2s",
                "&:hover": {
                  transform: "translateY(-4px)",
                  borderColor: bgColor,
                  boxShadow: 3,
                },
              }}
            >
              <Typography variant="h6" fontWeight="600" mb={1}>
                {title}
              </Typography>
              <Typography variant="body2">{description}</Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>

      {/* Gráficos */}
      <Box
        sx={{
          backgroundColor: theme.palette.background.paper,
          borderRadius: 3,
          p: 2,
          boxShadow: "none",
          width: "100%",
          minHeight: "950px",
        }}
      >
        <ResumenGeneral />
      </Box>
    </Box>
  );
};

export default Dashboard;
