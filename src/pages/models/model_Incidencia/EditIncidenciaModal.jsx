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
  Typography,
  Box,
  Divider,
  Chip,
  Paper,
  IconButton,
  Fade,
  useTheme,
  alpha
} from '@mui/material';
import {
  Person as PersonIcon,
  School as SchoolIcon,
  Assignment as AssignmentIcon,
  Close as CloseIcon,
  Save as SaveIcon,
  Cancel as CancelIcon
} from '@mui/icons-material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

const EditIncidenciaModal = ({ open, onClose, onSave, incidencia }) => {
  const theme = useTheme();
  
  // Estados principales
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

  // Configuraciones de datos
  const tiposIncidencia = [
    { value: 'Comportamiento', color: '#ff9800', icon: '🎭' },
    { value: 'Académico', color: '#2196f3', icon: '📚' },
    { value: 'Disciplinario', color: '#f44336', icon: '⚠️' },
    { value: 'Salud', color: '#4caf50', icon: '🏥' },
    { value: 'Seguridad', color: '#9c27b0', icon: '🛡️' },
    { value: 'Otro', color: '#607d8b', icon: '📝' }
  ];

  const estadosIncidencia = [
    { value: 'Pendiente', color: '#ff9800' },
    { value: 'En proceso', color: '#2196f3' },
    { value: 'Resuelto', color: '#4caf50' }
  ];

  const niveles = ['Primaria', 'Secundaria'];
  const grados = [1, 2, 3, 4, 5, 6];

  // Efecto para cargar datos iniciales
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

  // Handlers
  const handleChange = (e) => {
    const { name, value } = e.target;
    setIncidenciaData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Limpiar error cuando se corrige el campo
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
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
    const formattedTime = newValue.toLocaleTimeString('es-ES', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
    setIncidenciaData(prev => ({
      ...prev,
      hora: formattedTime
    }));
  };

  const validate = () => {
    const newErrors = {};
    const requiredFields = {
      nombreEstudiante: 'Nombre del estudiante es requerido',
      apellidoEstudiante: 'Apellido del estudiante es requerido',
      grado: 'Grado es requerido',
      nivel: 'Nivel es requerido',
      tipo: 'Tipo de incidencia es requerido',
      detalle: 'Detalle de la incidencia es requerido'
    };

    Object.entries(requiredFields).forEach(([field, message]) => {
      if (!incidenciaData[field]) {
        newErrors[field] = message;
      }
    });

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

  const handleClose = () => {
    setErrors({});
    onClose();
  };

  // Componente para sección con encabezado
  const SectionHeader = ({ icon, title, color = theme.palette.primary.main }) => (
    <Box sx={{ mb: 3 }}>
      <Box sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: 1,
        mb: 1
      }}>
        {React.cloneElement(icon, { 
          sx: { color, fontSize: 24 } 
        })}
        <Typography 
          variant="h6" 
          sx={{ 
            fontWeight: 600,
            color: theme.palette.text.primary
          }}
        >
          {title}
        </Typography>
      </Box>
      <Divider sx={{ 
        borderColor: alpha(color, 0.3),
        borderWidth: 1
      }} />
    </Box>
  );

  return (
    <Dialog 
      open={open} 
      onClose={handleClose} 
      maxWidth="lg" 
      fullWidth
      TransitionComponent={Fade}
      PaperProps={{
        sx: {
          borderRadius: 2,
          boxShadow: theme.shadows[10]
        }
      }}
    >
      {/* Header personalizado */}
      <Box sx={{ 
        background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
        color: 'white',
        p: 3,
        position: 'relative'
      }}>
        <Typography variant="h5" sx={{ fontWeight: 600 }}>
          Editar Incidencia
        </Typography>
        <Typography variant="body2" sx={{ opacity: 0.9, mt: 0.5 }}>
          Modifica los detalles de la incidencia registrada
        </Typography>
        <IconButton
          onClick={handleClose}
          sx={{
            position: 'absolute',
            right: 16,
            top: 16,
            color: 'white',
            '&:hover': {
              backgroundColor: alpha('#fff', 0.1)
            }
          }}
        >
          <CloseIcon />
        </IconButton>
      </Box>

      <DialogContent sx={{ p: 0 }}>
        <Box sx={{ p: 3 }}>
          <Grid container spacing={4}>
            {/* Sección Estudiante */}
            <Grid item xs={12}>
              <Paper elevation={0} sx={{ p: 3, bgcolor: alpha(theme.palette.primary.main, 0.02) }}>
                <SectionHeader 
                  icon={<PersonIcon />} 
                  title="Información del Estudiante"
                  color={theme.palette.primary.main}
                />
                <Grid container spacing={3}>
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
                      variant="outlined"
                      sx={{ 
                        '& .MuiOutlinedInput-root': {
                          '&:hover fieldset': {
                            borderColor: theme.palette.primary.main,
                          }
                        }
                      }}
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
                      variant="outlined"
                    />
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <FormControl fullWidth error={!!errors.nivel}>
                      <InputLabel>Nivel *</InputLabel>
                      <Select
                        name="nivel"
                        value={incidenciaData.nivel}
                        onChange={handleChange}
                        label="Nivel *"
                      >
                        {niveles.map((nivel) => (
                          <MenuItem key={nivel} value={nivel}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <SchoolIcon fontSize="small" />
                              {nivel}
                            </Box>
                          </MenuItem>
                        ))}
                      </Select>
                      {errors.nivel && (
                        <Typography variant="caption" color="error" sx={{ mt: 1, ml: 2 }}>
                          {errors.nivel}
                        </Typography>
                      )}
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <FormControl fullWidth error={!!errors.grado}>
                      <InputLabel>Grado *</InputLabel>
                      <Select
                        name="grado"
                        value={incidenciaData.grado}
                        onChange={handleChange}
                        label="Grado *"
                      >
                        {grados.map((grado) => (
                          <MenuItem key={grado} value={grado}>
                            {grado}° Grado
                          </MenuItem>
                        ))}
                      </Select>
                      {errors.grado && (
                        <Typography variant="caption" color="error" sx={{ mt: 1, ml: 2 }}>
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
                      placeholder="Ej: 987654321"
                    />
                  </Grid>
                </Grid>
              </Paper>
            </Grid>

            {/* Sección Incidencia */}
            <Grid item xs={12}>
              <Paper elevation={0} sx={{ p: 3, bgcolor: alpha(theme.palette.warning.main, 0.02) }}>
                <SectionHeader 
                  icon={<AssignmentIcon />} 
                  title="Detalles de la Incidencia"
                  color={theme.palette.warning.main}
                />
                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <FormControl fullWidth error={!!errors.tipo}>
                      <InputLabel>Tipo de Incidencia *</InputLabel>
                      <Select
                        name="tipo"
                        value={incidenciaData.tipo}
                        onChange={handleChange}
                        label="Tipo de Incidencia *"
                      >
                        {tiposIncidencia.map((tipo) => (
                          <MenuItem key={tipo.value} value={tipo.value}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <span>{tipo.icon}</span>
                              <span>{tipo.value}</span>
                              <Chip 
                                size="small" 
                                sx={{ 
                                  ml: 'auto',
                                  bgcolor: alpha(tipo.color, 0.1),
                                  color: tipo.color,
                                  fontSize: '0.75rem'
                                }}
                              />
                            </Box>
                          </MenuItem>
                        ))}
                      </Select>
                      {errors.tipo && (
                        <Typography variant="caption" color="error" sx={{ mt: 1, ml: 2 }}>
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
                        label="Estado"
                      >
                        {estadosIncidencia.map((estado) => (
                          <MenuItem key={estado.value} value={estado.value}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <Box 
                                sx={{ 
                                  width: 8, 
                                  height: 8, 
                                  borderRadius: '50%',
                                  bgcolor: estado.color 
                                }} 
                              />
                              {estado.value}
                            </Box>
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                      <DatePicker
                        label="Fecha"
                        value={dateValue}
                        onChange={handleDateChange}
                        renderInput={(params) => (
                          <TextField {...params} fullWidth variant="outlined" />
                        )}
                      />
                    </LocalizationProvider>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                      <TimePicker
                        label="Hora"
                        value={timeValue}
                        onChange={handleTimeChange}
                        renderInput={(params) => (
                          <TextField {...params} fullWidth variant="outlined" />
                        )}
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
                      helperText={errors.detalle || "Describe detalladamente lo ocurrido"}
                      required
                      variant="outlined"
                      placeholder="Describe los hechos ocurridos de manera clara y detallada..."
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="URL de la Imagen"
                      name="urlImagen"
                      value={incidenciaData.urlImagen}
                      onChange={handleChange}
                      variant="outlined"
                      placeholder="https://ejemplo.com/imagen.jpg"
                      helperText="Opcional: Enlace a imagen relacionada con la incidencia"
                    />
                  </Grid>
                </Grid>
              </Paper>
            </Grid>

            {/* Sección Profesor */}
            <Grid item xs={12}>
              <Paper elevation={0} sx={{ p: 3, bgcolor: alpha(theme.palette.success.main, 0.02) }}>
                <SectionHeader 
                  icon={<SchoolIcon />} 
                  title="Información del Profesor"
                  color={theme.palette.success.main}
                />
                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Nombres del Profesor"
                      name="nombreProfesor"
                      value={incidenciaData.nombreProfesor}
                      onChange={handleChange}
                      variant="outlined"
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
                      placeholder="Ej: Profesor de Matemáticas, Tutor, Coordinador..."
                    />
                  </Grid>
                </Grid>
              </Paper>
            </Grid>
          </Grid>
        </Box>
      </DialogContent>

      {/* Footer con botones */}
      <DialogActions sx={{ 
        p: 3, 
        bgcolor: alpha(theme.palette.grey[50], 0.5),
        borderTop: `1px solid ${theme.palette.divider}`,
        gap: 2
      }}>
        <Button 
          onClick={handleClose} 
          color="inherit"
          variant="outlined"
          startIcon={<CancelIcon />}
          sx={{ 
            minWidth: 120,
            borderRadius: 2
          }}
        >
          Cancelar
        </Button>
        <Button 
          onClick={handleSubmit} 
          color="primary" 
          variant="contained"
          startIcon={<SaveIcon />}
          sx={{ 
            minWidth: 120,
            borderRadius: 2,
            boxShadow: theme.shadows[2],
            '&:hover': {
              boxShadow: theme.shadows[4]
            }
          }}
        >
          Guardar Cambios
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditIncidenciaModal;