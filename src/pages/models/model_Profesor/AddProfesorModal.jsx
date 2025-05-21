import React, { useState } from 'react';
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
  Alert
} from '@mui/material';

const AddProfesorModal = ({ open, onClose, onSave, cargosValidos }) => {
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

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setProfesorData({
      ...profesorData,
      [name]: type === 'checkbox' ? checked : value
    });
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
      <DialogTitle>Añadir Nuevo Profesor</DialogTitle>
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
              {cargosValidos.map((cargo) => (
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
              type="password"
              value={profesorData.password}
              onChange={handleChange}
              error={!!errors.password}
              helperText={errors.password}
              required
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
          Guardar
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddProfesorModal;