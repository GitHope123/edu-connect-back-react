import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  MenuItem,
  Grid,
  FormControl,
  InputLabel,
  Select,
  Alert,
  Typography,
  Divider,
  Box,
  IconButton,
  Tooltip
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { Info as InfoIcon, Close as CloseIcon } from '@mui/icons-material';

const AddIncidenciaModal = ({ open, onClose, onSave }) => {
  // Estados del formulario
  const [incidenciaData, setIncidenciaData] = useState({
    nombreEstudiante: '',
    apellidoEstudiante: '',
    celularApoderado: '',
    grado: '',
    nivel: '',
    detalle: '',
    fecha: new Date().toLocaleDateString('es-ES'),
    hora: new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }),
    tipo: '',
    estado: 'Pendiente',
    atencion: 'Por revisar',
    urlImagen: '',
    nombreProfesor: '',
    apellidoProfesor: '',
    cargo: ''
  });

  const [errors, setErrors] = useState({});
  const [dateValue, setDateValue] = useState(new Date());
  const [timeValue, setTimeValue] = useState(new Date());

  // Opciones para los selectores
  const tiposIncidencia = [
    { value: 'Comportamiento', label: 'Comportamiento' },
    { value: 'Académico', label: 'Académico' },
    { value: 'Disciplinario', label: 'Disciplinario' },
    { value: 'Salud', label: 'Salud' },
    { value: 'Seguridad', label: 'Seguridad' },
    { value: 'Otro', label: 'Otro' }
  ];

  const niveles = ['Primaria', 'Secundaria'];
  const grados = [1, 2, 3, 4, 5, 6];
  const estados = ['Pendiente', 'En proceso', 'Resuelto'];

  // Manejadores de cambios
  const handleChange = (e) => {
    const { name, value } = e.target;
    setIncidenciaData(prev => ({
      ...prev,
      [name]: value
    }));
    // Limpiar error al escribir
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleDateChange = (newValue) => {
    setDateValue(newValue);
    const formattedDate = newValue.toLocaleDateString('es-ES');
    setIncidenciaData(prev => ({
      ...prev,
      fecha: formattedDate
    }));
  };

  const handleTimeChange = (newValue) => {
    setTimeValue(newValue);
    const formattedTime = newValue.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
    setIncidenciaData(prev => ({
      ...prev,
      hora: formattedTime
    }));
  };

  // Validación del formulario
  const validate = () => {
    const newErrors = {};
    if (!incidenciaData.nombreEstudiante.trim()) newErrors.nombreEstudiante = 'Nombre es requerido';
    if (!incidenciaData.apellidoEstudiante.trim()) newErrors.apellidoEstudiante = 'Apellido es requerido';
    if (!incidenciaData.grado) newErrors.grado = 'Grado es requerido';
    if (!incidenciaData.nivel) newErrors.nivel = 'Nivel es requerido';
    if (!incidenciaData.tipo) newErrors.tipo = 'Tipo es requerido';
    if (!incidenciaData.detalle.trim()) newErrors.detalle = 'Detalle es requerido';
    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validate();
    
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    
    onSave(incidenciaData);
    onClose();
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      maxWidth="md" 
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.1)'
        }
      }}
    >
      <DialogTitle sx={{ 
        backgroundColor: 'primary.main', 
        color: 'white',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        py: 2
      }}>
        <Typography variant="h6" fontWeight="bold">
          Registrar Nueva Incidencia
        </Typography>
        <IconButton onClick={onClose} sx={{ color: 'white' }}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers sx={{ py: 3 }}>
        <form onSubmit={handleSubmit}>
          {/* Sección Estudiante */}
          <Box mb={4}>
            <Typography variant="subtitle1" fontWeight="bold" gutterBottom sx={{ 
              color: 'primary.main',
              display: 'flex',
              alignItems: 'center',
              gap: 1
            }}>
              Información del Estudiante
              <Tooltip title="Datos del estudiante involucrado">
                <InfoIcon fontSize="small" />
              </Tooltip>
            </Typography>
            <Divider sx={{ mb: 3 }} />

            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Nombres del Estudiante *"
                  name="nombreEstudiante"
                  value={incidenciaData.nombreEstudiante}
                  onChange={handleChange}
                  error={!!errors.nombreEstudiante}
                  helperText={errors.nombreEstudiante}
                  variant="outlined"
                  size="small"
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Apellidos del Estudiante *"
                  name="apellidoEstudiante"
                  value={incidenciaData.apellidoEstudiante}
                  onChange={handleChange}
                  error={!!errors.apellidoEstudiante}
                  helperText={errors.apellidoEstudiante}
                  variant="outlined"
                  size="small"
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <FormControl fullWidth size="small">
                  <InputLabel>Nivel *</InputLabel>
                  <Select
                    name="nivel"
                    value={incidenciaData.nivel}
                    onChange={handleChange}
                    error={!!errors.nivel}
                    label="Nivel *"
                  >
                    {niveles.map((nivel) => (
                      <MenuItem key={nivel} value={nivel}>
                        {nivel}
                      </MenuItem>
                    ))}
                  </Select>
                  {errors.nivel && (
                    <Typography variant="caption" color="error" sx={{ mt: 1, display: 'block' }}>
                      {errors.nivel}
                    </Typography>
                  )}
                </FormControl>
              </Grid>
              <Grid item xs={12} md={4}>
                <FormControl fullWidth size="small">
                  <InputLabel>Grado *</InputLabel>
                  <Select
                    name="grado"
                    value={incidenciaData.grado}
                    onChange={handleChange}
                    error={!!errors.grado}
                    label="Grado *"
                  >
                    {grados.map((grado) => (
                      <MenuItem key={grado} value={grado}>
                        {grado}
                      </MenuItem>
                    ))}
                  </Select>
                  {errors.grado && (
                    <Typography variant="caption" color="error" sx={{ mt: 1, display: 'block' }}>
                      {errors.grado}
                    </Typography>
                  )}
                </FormControl>
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label="Celular del Apoderado"
                  name="celularApoderado"
                  value={incidenciaData.celularApoderado}
                  onChange={handleChange}
                  variant="outlined"
                  size="small"
                  type="tel"
                />
              </Grid>
            </Grid>
          </Box>

          {/* Sección Incidencia */}
          <Box mb={4}>
            <Typography variant="subtitle1" fontWeight="bold" gutterBottom sx={{ 
              color: 'primary.main',
              display: 'flex',
              alignItems: 'center',
              gap: 1
            }}>
              Detalles de la Incidencia
              <Tooltip title="Describe completamente lo ocurrido">
                <InfoIcon fontSize="small" />
              </Tooltip>
            </Typography>
            <Divider sx={{ mb: 3 }} />

            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth size="small">
                  <InputLabel>Tipo de Incidencia *</InputLabel>
                  <Select
                    name="tipo"
                    value={incidenciaData.tipo}
                    onChange={handleChange}
                    error={!!errors.tipo}
                    label="Tipo de Incidencia *"
                  >
                    {tiposIncidencia.map((tipo) => (
                      <MenuItem key={tipo.value} value={tipo.value}>
                        {tipo.label}
                      </MenuItem>
                    ))}
                  </Select>
                  {errors.tipo && (
                    <Typography variant="caption" color="error" sx={{ mt: 1, display: 'block' }}>
                      {errors.tipo}
                    </Typography>
                  )}
                </FormControl>
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth size="small">
                  <InputLabel>Estado</InputLabel>
                  <Select
                    name="estado"
                    value={incidenciaData.estado}
                    onChange={handleChange}
                    label="Estado"
                  >
                    {estados.map((estado) => (
                      <MenuItem key={estado} value={estado}>
                        {estado}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={6}>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <DatePicker
                    label="Fecha *"
                    value={dateValue}
                    onChange={handleDateChange}
                    renderInput={(params) => (
                      <TextField 
                        {...params} 
                        fullWidth 
                        size="small"
                      />
                    )}
                  />
                </LocalizationProvider>
              </Grid>
              <Grid item xs={12} md={6}>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <TimePicker
                    label="Hora *"
                    value={timeValue}
                    onChange={handleTimeChange}
                    renderInput={(params) => (
                      <TextField 
                        {...params} 
                        fullWidth 
                        size="small"
                      />
                    )}
                  />
                </LocalizationProvider>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Descripción detallada *"
                  name="detalle"
                  value={incidenciaData.detalle}
                  onChange={handleChange}
                  multiline
                  rows={4}
                  error={!!errors.detalle}
                  helperText={errors.detalle || "Describe con precisión lo ocurrido"}
                  variant="outlined"
                  size="small"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="URL de la Imagen (opcional)"
                  name="urlImagen"
                  value={incidenciaData.urlImagen}
                  onChange={handleChange}
                  variant="outlined"
                  size="small"
                  helperText="Pega el enlace de la imagen si es necesario"
                />
              </Grid>
            </Grid>
          </Box>

          {/* Sección Profesor */}
          <Box>
            <Typography variant="subtitle1" fontWeight="bold" gutterBottom sx={{ 
              color: 'primary.main',
              display: 'flex',
              alignItems: 'center',
              gap: 1
            }}>
              Información del Profesor Reportante
              <Tooltip title="Datos del profesor que registra la incidencia">
                <InfoIcon fontSize="small" />
              </Tooltip>
            </Typography>
            <Divider sx={{ mb: 3 }} />

            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Nombres del Profesor"
                  name="nombreProfesor"
                  value={incidenciaData.nombreProfesor}
                  onChange={handleChange}
                  variant="outlined"
                  size="small"
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Apellidos del Profesor"
                  name="apellidoProfesor"
                  value={incidenciaData.apellidoProfesor}
                  onChange={handleChange}
                  variant="outlined"
                  size="small"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Cargo del Profesor"
                  name="cargo"
                  value={incidenciaData.cargo}
                  onChange={handleChange}
                  variant="outlined"
                  size="small"
                />
              </Grid>
            </Grid>
          </Box>
        </form>
      </DialogContent>

      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button 
          onClick={onClose} 
          variant="outlined" 
          color="secondary"
          sx={{ borderRadius: 2 }}
        >
          Cancelar
        </Button>
        <Button 
          onClick={handleSubmit} 
          variant="contained" 
          color="primary"
          sx={{ borderRadius: 2 }}
          disableElevation
        >
          Guardar Incidencia
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddIncidenciaModal;