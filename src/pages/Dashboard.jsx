import React, { useEffect, useState } from "react";
import { Box, Typography, Grid, Paper, useTheme, CircularProgress, Alert } from "@mui/material";
import ResumenGeneral from "./graficos/ResumenGeneral";
import {
  People as PeopleIcon,
  School as SchoolIcon,
  Warning as WarningIcon
} from "@mui/icons-material";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";

const Dashboard = () => {
  const theme = useTheme();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totals, setTotals] = useState({
    estudiantes: 0,
    profesores: 0,
    incidencias: 0,
    estudiantesData: [],
    profesoresData: [],
    incidenciasData: [],
  });

  useEffect(() => {
    const fetchCounts = async () => {
      try {
        setLoading(true);
        const [estudiantesSnap, profesoresSnap, incidenciasSnap] = await Promise.all([
          getDocs(collection(db, "Estudiante")),
          getDocs(collection(db, "Profesor")),
          getDocs(collection(db, "Incidencia")),
        ]);
        setTotals({
          estudiantes: estudiantesSnap.size,
          profesores: profesoresSnap.size,
          incidencias: incidenciasSnap.size,
          estudiantesData: estudiantesSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })),
          profesoresData: profesoresSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })),
          incidenciasData: incidenciasSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })),
        });
      } catch {
        setError("Error al cargar los datos.");
      } finally {
        setLoading(false);
      }
    };
    fetchCounts();
  }, []);

  const cardData = [
    {
      title: "Estudiantes",
      description: "Gestión de estudiantes registrados",
      icon: <PeopleIcon fontSize="large" />,
      bgColor: 'linear-gradient(135deg, rgba(66, 165, 245, 0.2) 0%, rgba(21, 101, 192, 0.2) 100%)',
      borderColor: theme.palette.primary.main,
      iconColor: theme.palette.primary.main,
      path: "/estudiantes",
      count: totals.estudiantes,
    },
    {
      title: "Miembros", // miembros de la institución
      description: "Administración de miembros de la institución",
      icon: <SchoolIcon fontSize="large" />,
      bgColor: 'linear-gradient(135deg, rgba(102, 187, 106, 0.2) 0%, rgba(27, 94, 32, 0.2) 100%)',
      borderColor: theme.palette.success.main,
      iconColor: theme.palette.success.main,
      path: "/profesores",
      count: totals.profesores,
    },
    {
      title: "Incidencias",
      description: "Reportes y seguimiento",
      icon: <WarningIcon fontSize="large" />,
      bgColor: 'linear-gradient(135deg, rgba(239, 83, 80, 0.2) 0%, rgba(183, 28, 28, 0.2) 100%)',
      borderColor: theme.palette.error.main,
      iconColor: theme.palette.error.main,
      path: "/incidencias",
      count: totals.incidencias,
    },
  ];

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" py={8}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box py={4}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

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
          Visión general del Centro Educativo "San Jose de Cerro Alegre"
        </Typography>
      </Box>

      {/* Cards de acceso rápido */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {cardData.map(({ title, description, icon, bgColor, borderColor, iconColor, count }) => (
          <Grid
            item
            xs={12}
            sm={6}
            md={4}
            width={400}
            key={title}
            sx={{
              display: "flex",
              justifyContent: "center",
            }}
          >
            <Paper
              elevation={0}
              sx={{
                p: 3,
                width: "100%",
                maxWidth: "100%",
                background: `rgba(255, 255, 255, 0.7)`,
                backdropFilter: 'blur(10px)',
                border: `1px solid rgba(255, 255, 255, 0.3)`,
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)',
                position: 'relative',
                overflow: 'hidden',
                '&:before': {
                  content: '""',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  height: '4px',
                  background: borderColor,
                },
                '&:hover': {
                  transform: 'translateY(-5px)',
                  boxShadow: '0 8px 30px rgba(0, 0, 0, 0.1)',
                  '& .card-icon': {
                    transform: 'scale(1.1)',
                  }
                },
                transition: 'all 0.3s ease',
              }}
            >
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'flex-start',
                  textAlign: 'left',
                  height: '100%',
                  justifyContent: 'center'
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <Box
                    className="card-icon"
                    sx={{
                      width: 48,
                      height: 48,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      borderRadius: '50%',
                      background: bgColor,
                      color: iconColor,
                      transition: 'all 0.3s ease',
                      mr: 2,
                      fontSize: 32,
                    }}
                  >
                    {icon}
                  </Box>
                  <Typography variant="h4" fontWeight="bold" color={iconColor}>
                    {count}
                  </Typography>
                </Box>
                <Typography variant="h6" fontWeight="600" mb={0.5}>
                  {title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {description}
                </Typography>
              </Box>
            </Paper>
          </Grid>
        ))}
      </Grid>

      {/* Gráficos */}
      <Box
        sx={{
          width: "100%",
          maxWidth: "100%",
          borderRadius: theme.shape.borderRadius,
        }}
      >
        <ResumenGeneral
          estudiantes={totals.estudiantesData}
          profesores={totals.profesoresData}
          incidencias={totals.incidenciasData}
        />
      </Box>
    </Box>
  );
};

export default Dashboard;