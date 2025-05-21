import React from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation, Navigate, NavLink } from 'react-router-dom';
import { Box, CssBaseline, Breadcrumbs, Typography } from '@mui/material';
import { styled, useTheme, ThemeProvider, createTheme } from '@mui/material/styles';

import { AuthProvider, useAuth } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Estudiantes from './pages/Estudiantes';
import Profesores from './pages/Profesores';
import Incidencias from './pages/Incidencias';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
    background: {
      default: '#f5f5f5',
      paper: '#ffffff',
    },
  },
  shape: {
    borderRadius: 8,
  },
});

const MainContent = styled(Box)(() => ({
  flexGrow: 1,
  marginLeft: 0,
  width: `calc(100% - 240px)`,
  backgroundColor: '#f5f5f5',
  minHeight: '100vh',
  display: 'flex',
  flexDirection: 'column',
}));

const ContentWrapper = styled(Box)(({ theme }) => ({
  flex: 1,
  padding: theme.spacing(3),
  backgroundColor: '#fff',
  borderRadius: theme.shape.borderRadius,
  boxShadow: theme.shadows[2],
  margin: theme.spacing(4, 3),
}));

const App = () => {
  return (
    <ThemeProvider theme={theme}>
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/login" element={<LoginLayout />} />
            <Route path="*" element={
              <ProtectedRoute>
                <MainLayout />
              </ProtectedRoute>
            } />
          </Routes>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
};

// Layout para la página de login (versión corregida)
const LoginLayout = () => {
  const { user } = useAuth();
  
  if (user) {
    return <Navigate to="/" replace />;
  }

  return (
    <Box 
      sx={{
        width: '100vw',
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #1976d2 0%, #0d47a1 100%)',
        backgroundSize: 'cover',
      }}
    >
      <CssBaseline />
      <Box
        sx={{
          width: '100%',
          maxWidth: { xs: '90%', sm: '400px' },
          padding: 3
        }}
      >
        <Login />
      </Box>
    </Box>
  );
};

// Layout principal para las rutas protegidas
const MainLayout = () => {
  return (
    <Box display="flex" minHeight="100vh">
      <CssBaseline />
      <Sidebar />
      <MainContent component="main">
        <Navbar />
        <ContentWrapper>
          <DynamicBreadcrumbs />
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/estudiantes" element={<Estudiantes />} />
            <Route path="/profesores" element={<Profesores />} />
            <Route path="/incidencias" element={<Incidencias />} />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </ContentWrapper>
        <Footer />
      </MainContent>
    </Box>
  );
};

const DynamicBreadcrumbs = () => {
  const theme = useTheme();
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter(Boolean);

  return (
    <Breadcrumbs aria-label="breadcrumb" sx={{ mb: theme.spacing(3) }}>
      <NavLink
        to="/"
        style={({ isActive }) => ({
          color: isActive ? theme.palette.text.primary : theme.palette.primary.main,
          textDecoration: 'none',
          fontWeight: '500',
        })}
      >
        Inicio
      </NavLink>
      {pathnames.map((value, index) => {
        const last = index === pathnames.length - 1;
        const to = `/${pathnames.slice(0, index + 1).join('/')}`;
        const label = value.charAt(0).toUpperCase() + value.slice(1);

        return last ? (
          <Typography color="text.primary" key={to}>
            {label}
          </Typography>
        ) : (
          <NavLink
            to={to}
            key={to}
            style={({ isActive }) => ({
              color: isActive ? theme.palette.text.primary : theme.palette.primary.main,
              textDecoration: 'none',
              fontWeight: '500',
            })}
          >
            {label}
          </NavLink>
        );
      })}
    </Breadcrumbs>
  );
};

export default App;