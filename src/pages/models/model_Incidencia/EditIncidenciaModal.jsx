import React, { useState, useEffect } from 'react';
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
  Typography
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

const EditIncidenciaModal = ({ open, onClose, onSave, incidencia }) => {
  const [incidenciaData, setIncidenciaData] = useState({
    nombreEstudiante: '',
    apellidoEstudiante: '',
    celularApoderado: '',
    grado: '',
    nivel: '',
    detalle: '',
    fecha: '',
    hora: '',
    tipo: '',
    estado: '',
    atencion: '',
    urlImagen: '',
    nombreProfesor: '',
    apellidoProfesor: '',
    cargo: ''
  });

  const [errors, setErrors] = useState({});
  const [dateValue, setDateValue] = useState(new Date());
  const [timeValue, setTimeValue] = useState(new Date());

  const tiposIncidencia = [
    'Comportamiento',
    'Académico',
    'Disciplinario',
    'Salud',
    'Seguridad',
    'Otro'
  ];

  const niveles = ['Primaria', 'Secundaria'];
  const grados = [1, 2, 3, 4, 5, 6];

  useEffect(() => {
    if (incidencia) {
      setIncidenciaData({
        nombreEstudiante: incidencia.nombreEstudiante || '',
        apellidoEstudiante: incidencia.apellidoEstudiante || '',
        celularApoderado: incidencia.celularApoderado || '',
        grado: incidencia.grado || '',
        nivel: incidencia.nivel || '',
        detalle: incidencia.detalle || '',
        fecha: incidencia.fecha || new Date().toLocaleDateString('es-ES'),
        hora: incidencia.hora || new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }),
        tipo: incidencia.tipo || '',
        estado: incidencia.estado || 'Pendiente',
        atencion: incidencia.atencion || 'Por revisar',
        urlImagen: incidencia.urlImagen || '',
        nombreProfesor: incidencia.nombreProfesor || '',
        apellidoProfesor: incidencia.apellidoProfesor || '',
        cargo: incidencia.cargo || ''
      });

      // Parse existing date
      if (incidencia.fecha) {
        const [dd, mm, yyyy] = incidencia.fecha.split('/');
        setDateValue(new Date(`${yyyy}-${mm}-${dd}`));
      }
      
      // Parse existing time
      if (incidencia.hora) {
        const [time, period] = incidencia.hora.split(' ');
        let [hours, minutes] = time.split(':');
        if (period === 'PM' && hours !== '12') {
          hours = parseInt(hours, 10) + 12;
        }
        const date = new Date();
        date.setHours(hours, minutes);
        setTimeValue(date);
      }
    }
  }, [incidencia]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setIncidenciaData({
      ...incidenciaData,
      [name]: value
    });
  };

  const handleDateChange = (newValue) => {
    setDateValue(newValue);
    const formattedDate = newValue.toLocaleDateString('es-ES');
    setIncidenciaData({
      ...incidenciaData,
      fecha: formattedDate
    });
  };

  const handleTimeChange = (newValue) => {
    setTimeValue(newValue);
    const formattedTime = newValue.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
    setIncidenciaData({
      ...incidenciaData,
      hora: formattedTime
    });
  };

  const validate = () => {
    const newErrors = {};
    if (!incidenciaData.nombreEstudiante) newErrors.nombreEstudiante = 'Nombre es requerido';
    if (!incidenciaData.apellidoEstudiante) newErrors.apellidoEstudiante = 'Apellido es requerido';
    if (!incidenciaData.grado) newErrors.grado = 'Grado es requerido';
    if (!incidenciaData.nivel) newErrors.nivel = 'Nivel es requerido';
    if (!incidenciaData.tipo) newErrors.tipo = 'Tipo es requerido';
    if (!incidenciaData.detalle) newErrors.detalle = 'Detalle es requerido';
    return newErrors;
  };

  const handleSubmit = () => {
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    onSave(incidenciaData);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Editar Incidencia</DialogTitle>
      <DialogContent dividers>
        <Grid container spacing={3} sx={{ mt: 1 }}>
          {/* Sección Estudiante */}
          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom>
              Información del Estudiante
            </Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Nombres del Estudiante"
              name="nombreEstudiante"
              value={incidenciaData.nombreEstudiante}
              onChange={handleChange}
              error={!!errors.nombreEstudiante}
              helperText={errors.nombreEstudiante}
              required
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Apellidos del Estudiante"
              name="apellidoEstudiante"
              value={incidenciaData.apellidoEstudiante}
              onChange={handleChange}
              error={!!errors.apellidoEstudiante}
              helperText={errors.apellidoEstudiante}
              required
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <FormControl fullWidth>
              <InputLabel>Nivel *</InputLabel>
              <Select
                name="nivel"
                value={incidenciaData.nivel}
                onChange={handleChange}
                error={!!errors.nivel}
                required
              >
                {niveles.map((nivel) => (
                  <MenuItem key={nivel} value={nivel}>
                    {nivel}
                  </MenuItem>
                ))}
              </Select>
              {errors.nivel && (
                <Typography variant="caption" color="error">
                  {errors.nivel}
                </Typography>
              )}
            </FormControl>
          </Grid>
          <Grid item xs={12} md={4}>
            <FormControl fullWidth>
              <InputLabel>Grado *</InputLabel>
              <Select
                name="grado"
                value={incidenciaData.grado}
                onChange={handleChange}
                error={!!errors.grado}
                required
              >
                {grados.map((grado) => (
                  <MenuItem key={grado} value={grado}>
                    {grado}
                  </MenuItem>
                ))}
              </Select>
              {errors.grado && (
                <Typography variant="caption" color="error">
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
            />
          </Grid>

          {/* Sección Incidencia */}
          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom>
              Detalles de la Incidencia
            </Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <InputLabel>Tipo de Incidencia *</InputLabel>
              <Select
                name="tipo"
                value={incidenciaData.tipo}
                onChange={handleChange}
                error={!!errors.tipo}
                required
              >
                {tiposIncidencia.map((tipo) => (
                  <MenuItem key={tipo} value={tipo}>
                    {tipo}
                  </MenuItem>
                ))}
              </Select>
              {errors.tipo && (
                <Typography variant="caption" color="error">
                  {errors.tipo}
                </Typography>
              )}
            </FormControl>
          </Grid>
          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <InputLabel>Estado</InputLabel>
              <Select
                name="estado"
                value={incidenciaData.estado}
                onChange={handleChange}
              >
                <MenuItem value="Pendiente">Pendiente</MenuItem>
                <MenuItem value="En proceso">En proceso</MenuItem>
                <MenuItem value="Resuelto">Resuelto</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={6}>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DatePicker
                label="Fecha"
                value={dateValue}
                onChange={handleDateChange}
                renderInput={(params) => <TextField {...params} fullWidth />}
              />
            </LocalizationProvider>
          </Grid>
          <Grid item xs={12} md={6}>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <TimePicker
                label="Hora"
                value={timeValue}
                onChange={handleTimeChange}
                renderInput={(params) => <TextField {...params} fullWidth />}
              />
            </LocalizationProvider>
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Detalle de la Incidencia"
              name="detalle"
              value={incidenciaData.detalle}
              onChange={handleChange}
              multiline
              rows={4}
              error={!!errors.detalle}
              helperText={errors.detalle}
              required
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="URL de la Imagen (opcional)"
              name="urlImagen"
              value={incidenciaData.urlImagen}
              onChange={handleChange}
            />
          </Grid>

          {/* Sección Profesor */}
          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom>
              Información del Profesor
            </Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Nombres del Profesor"
              name="nombreProfesor"
              value={incidenciaData.nombreProfesor}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Apellidos del Profesor"
              name="apellidoProfesor"
              value={incidenciaData.apellidoProfesor}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Cargo del Profesor"
              name="cargo"
              value={incidenciaData.cargo}
              onChange={handleChange}
            />
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

export default EditIncidenciaModal;