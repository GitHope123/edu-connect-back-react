import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase/firebaseConfig';
import {
  TextField,
  Button,
  Box,
  Typography,
  Container,
} from '@mui/material';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate('/');
    } catch {
      setError('Credenciales incorrectas');
    }
  };

  return (
    <Container maxWidth="xs">
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
          padding: 0,
          alignItems: 'center',
          textAlign: 'center',
          mt: 8,
        }}
      >
        {/* Logo */}
        <Box sx={{ mb: 2 }}>
          <img src="/logo_login_pro.svg" alt="Logo EduConnet" style={{ height: 60 }} />
        </Box>

        {/* Título */}
        <Typography variant="h5" fontWeight="bold">
          Iniciar Sesión
        </Typography>

        {/* Mensaje de bienvenida */}
        <Typography variant="body2" color="textSecondary">
          Complete sus credenciales para continuar
        </Typography>

        {/* Mensaje de error */}
        {error && (
          <Typography color="error" fontWeight="500">
            {error}
          </Typography>
        )}

        {/* Campos de formulario */}
        <TextField
          label="Correo electrónico"
          type="email"
          required
          fullWidth
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          variant="outlined"
        />

        <TextField
          label="Contraseña"
          type="password"
          required
          fullWidth
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          variant="outlined"
        />

        <Button type="submit" variant="contained" fullWidth sx={{ mt: 1 }}>
          Ingresar
        </Button>

        {/* Pie de página con nombre de empresa */}
        <Typography variant="caption" color="textSecondary" sx={{ mt: 3 }}>
          &copy; {new Date().getFullYear()} @EduConnet. Todos los derechos reservados.
        </Typography>
      </Box>
    </Container>
  );
};

export default Login;