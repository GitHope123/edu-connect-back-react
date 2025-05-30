import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  MenuItem,
  FormControl,
  FormLabel,
  FormGroup,
  FormControlLabel,
  Switch,
  Grid,
  InputAdornment,
  IconButton
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';

const EditProfesorModal = ({
  open,
  onClose,
  onSave,
  profesor,
  cargosValidos = [] // Valor por defecto
}) => {
  const [profesorData, setProfesorData] = useState({
    nombres: '',
    apellidos: '',
    cargo: '',
    correo: '',
    celular: '',
    password: '',
    tutor: false
  });

  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (profesor) {
      setProfesorData({
        nombres: profesor.nombres || '',
        apellidos: profesor.apellidos || '',
        cargo: profesor.cargo || '',
        correo: profesor.correo || '',
        celular: profesor.celular || '',
        password: profesor.password || '',
        tutor: profesor.tutor || false
      });
    }
  }, [profesor]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setProfesorData((prevData) => ({
      ...prevData,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleClickShowPassword = () => {
    setShowPassword((show) => !show);
  };

  const validate = () => {
    const newErrors = {};
    if (!profesorData.nombres) newErrors.nombres = 'Nombres es requerido';
    if (!profesorData.apellidos) newErrors.apellidos = 'Apellidos es requerido';
    if (!profesorData.cargo) newErrors.cargo = 'Cargo es requerido';
    if (!profesorData.correo) newErrors.correo = 'Correo es requerido';
    if (!profesorData.password) newErrors.password = 'Contraseña es requerida';
    return newErrors;
  };

  const handleSubmit = () => {
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    onSave(profesorData);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Editar Profesor</DialogTitle>
      <DialogContent dividers>
        <Grid container spacing={2} sx={{ mt: 1 }}>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Nombres"
              name="nombres"
              value={profesorData.nombres}
              onChange={handleChange}
              error={!!errors.nombres}
              helperText={errors.nombres}
              required
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Apellidos"
              name="apellidos"
              value={profesorData.apellidos}
              onChange={handleChange}
              error={!!errors.apellidos}
              helperText={errors.apellidos}
              required
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              select
              fullWidth
              label="Cargo"
              name="cargo"
              value={profesorData.cargo}
              onChange={handleChange}
              error={!!errors.cargo}
              helperText={errors.cargo}
              required
            >
              {Array.isArray(cargosValidos) &&
                cargosValidos.map((cargo) => (
                  <MenuItem key={cargo} value={cargo}>
                    {cargo}
                  </MenuItem>
                ))}
            </TextField>
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Correo Electrónico"
              name="correo"
              type="email"
              value={profesorData.correo}
              onChange={handleChange}
              error={!!errors.correo}
              helperText={errors.correo}
              required
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Celular"
              name="celular"
              value={profesorData.celular}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Contraseña"
              name="password"
              type={showPassword ? 'text' : 'password'}
              value={profesorData.password}
              onChange={handleChange}
              error={!!errors.password}
              helperText={errors.password}
              required
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                      onClick={handleClickShowPassword}
                      edge="end"
                      size="large"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                )
              }}
            />
          </Grid>
          <Grid item xs={12}>
            <FormControl component="fieldset">
              <FormLabel component="legend">¿Es tutor?</FormLabel>
              <FormGroup>
                <FormControlLabel
                  control={
                    <Switch
                      checked={profesorData.tutor}
                      onChange={handleChange}
                      name="tutor"
                    />
                  }
                  label={profesorData.tutor ? 'Sí' : 'No'}
                />
              </FormGroup>
            </FormControl>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="secondary">
          Cancelar
        </Button>
        <Button onClick={handleSubmit} color="primary" variant="contained">
          Guardar Cambios
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditProfesorModal;
