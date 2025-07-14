import React from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation, Navigate, NavLink } from 'react-router-dom';
import { Box, CssBaseline, Breadcrumbs, Typography } from '@mui/material';
import { styled, useTheme, ThemeProvider } from '@mui/material/styles';

import theme from './theme/theme'; // Importamos el tema personalizado
import { AuthProvider, useAuth } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import ExpertSystemInterface from './expertSystem/components/ExpertSystemInterface';

// Importaciones condicionales para el panel de administración
const Sidebar = React.lazy(() => import('./components/Sidebar'));
const Navbar = React.lazy(() => import('./components/Navbar'));
const Footer = React.lazy(() => import('./components/Footer'));
const Login = React.lazy(() => import('./pages/Login'));
const Perfil = React.lazy(() => import('./pages/Perfil'));
const Dashboard = React.lazy(() => import('./pages/Dashboard'));
const Estudiantes = React.lazy(() => import('./pages/Estudiantes'));
const Profesores = React.lazy(() => import('./pages/Profesores'));
const Incidencias = React.lazy(() => import('./pages/Incidencias'));

// Componentes estilizados utilizando el tema importado
const MainContent = styled(Box)(({ theme }) => ({
  flexGrow: 1,
  marginLeft: 0,
  width: `calc(100% - 240px)`,
  background: theme.palette.background.default,
  minHeight: '100vh',
  display: 'flex',
  flexDirection: 'column',
}));

const ContentWrapper = styled(Box)(({ theme }) => ({
  flex: 1,
  padding: theme.spacing(3),
  background: theme.palette.background.paper,
  borderRadius: theme.shape.borderRadius,
  boxShadow: theme.shadows[2],
  margin: theme.spacing(4, 3),
  backdropFilter: 'blur(8px)',
  border: '1px solid rgba(255, 255, 255, 0.3)'
}));

// Layout específico para el sistema experto (completamente independiente)
const ExpertSystemLayout = () => {
  return (
    <Box 
      sx={{
        width: '100vw',
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <CssBaseline />
      <ExpertSystemInterface />
    </Box>
  );
};

// Componente para proteger la ruta del sistema experto
const ExpertSystemProtectedRoute = ({ children }) => {
  const { user } = useAuth();
  
  // Verificar si el usuario está autenticado y tiene el correo autorizado
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  if (user.email !== 'rsantos@colegiosparroquiales.com') {
    return <Navigate to="/" replace />;
  }
  
  return children;
};

// Componente para proteger las rutas del panel de administración
const AdminProtectedRoute = ({ children }) => {
  const { user } = useAuth();
  
  // Si no hay usuario, redirigir al login
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  // Si es el psicólogo, redirigir al sistema experto
  if (user.email === 'rsantos@colegiosparroquiales.com') {
    return <Navigate to="/expert-system" replace />;
  }
  
  return children;
};

// Componente para manejar la redirección después del login
const LoginSuccessHandler = () => {
  const { user } = useAuth();
  
  // Si es el psicólogo, redirigir al sistema experto
  if (user?.email === 'rsantos@colegiosparroquiales.com') {
    return <Navigate to="/expert-system" replace />;
  }
  
  // Para otros usuarios, redirigir al dashboard
  return <Navigate to="/" replace />;
};

const App = () => {
  return (
    <ThemeProvider theme={theme}>
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/login" element={<LoginLayout />} />
            <Route path="/login-success" element={<LoginSuccessHandler />} />
            <Route 
              path="/expert-system" 
              element={
                <ExpertSystemProtectedRoute>
                  <ExpertSystemLayout />
                </ExpertSystemProtectedRoute>
              } 
            />
            <Route path="*" element={
              <AdminProtectedRoute>
                <React.Suspense fallback={<div>Cargando...</div>}>
                  <MainLayout />
                </React.Suspense>
              </AdminProtectedRoute>
            } />
          </Routes>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
};

// Layout para la página de login con estilos del tema
const LoginLayout = () => {
  const { user } = useAuth();
  const theme = useTheme();
  
  // Si ya hay un usuario autenticado, redirigir a la página de éxito
  if (user) {
    return <Navigate to="/login-success" replace />;
  }

  return (
    <Box 
      sx={{
        width: '100vw',
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #1a73e8 0%, #0d47a1 100%)',
        backgroundSize: 'cover',
      }}
    >
      <CssBaseline />
      <Box
        sx={{
          width: '100%',
          maxWidth: { xs: '90%', sm: '400px' },
          padding: 3,
          background: theme.palette.background.paper,
          borderRadius: theme.shape.borderRadius,
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.3)'
        }}
      >
        <React.Suspense fallback={<div>Cargando...</div>}>
          <Login />
        </React.Suspense>
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
            <Route path="/perfil" element={<Perfil />} />
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