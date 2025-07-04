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
        fecha: incidencia.fecha || new Date().toLocaleDateString('es-ES').replace(/\//g, '/'),
        hora: incidencia.hora || (() => {
          const now = new Date();
          const hours = String(now.getHours()).padStart(2, '0');
          const minutes = String(now.getMinutes()).padStart(2, '0');
          const seconds = String(now.getSeconds()).padStart(2, '0');
          return `${hours}:${minutes}:${seconds}`;
        })(),
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
        // Asumimos formato HH:MM:SS
        const timeParts = incidencia.hora.split(':');
        if (timeParts.length >= 2) {
          const hours = parseInt(timeParts[0], 10);
          const minutes = parseInt(timeParts[1], 10);
          const seconds = timeParts[2] ? parseInt(timeParts[2], 10) : 0;
          const date = new Date();
          date.setHours(hours, minutes, seconds);
          setTimeValue(date);
        }
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
    // Formatear fecha como DD/MM/YYYY
    const day = String(newValue.getDate()).padStart(2, '0');
    const month = String(newValue.getMonth() + 1).padStart(2, '0');
    const year = newValue.getFullYear();
    const formattedDate = `${day}/${month}/${year}`;
    
    setIncidenciaData(prev => ({
      ...prev,
      fecha: formattedDate
    }));
  };

  const handleTimeChange = (newValue) => {
    setTimeValue(newValue);
    // Formatear hora como HH:MM:SS
    const hours = String(newValue.getHours()).padStart(2, '0');
    const minutes = String(newValue.getMinutes()).padStart(2, '0');
    const seconds = String(newValue.getSeconds()).padStart(2, '0');
    const formattedTime = `${hours}:${minutes}:${seconds}`;
    
    setIncidenciaData(prev => ({
      ...prev,
      hora: formattedTime
    }));
  };

  const validate = () => {
    const newErrors = {};
    // Solo validamos fecha y hora ya que son los únicos campos editables
    if (!incidenciaData.fecha) {
      newErrors.fecha = 'Fecha es requerida';
    }
    if (!incidenciaData.hora) {
      newErrors.hora = 'Hora es requerida';
    }
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
          Editar Fecha y Hora de Incidencia
        </Typography>
        <Typography variant="body2" sx={{ opacity: 0.9, mt: 0.5 }}>
          Solo se permite modificar la fecha y hora del registro
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
            {/* Sección Estudiante - Solo lectura */}
            <Grid item xs={12}>
              <Paper elevation={0} sx={{ p: 3, bgcolor: alpha(theme.palette.grey[500], 0.05) }}>
                <SectionHeader 
                  icon={<PersonIcon />} 
                  title="Información del Estudiante (Solo lectura)"
                  color={theme.palette.grey[600]}
                />
                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Nombres del Estudiante"
                      name="nombreEstudiante"
                      value={incidenciaData.nombreEstudiante}
                      InputProps={{
                        readOnly: true,
                      }}
                      disabled
                      variant="outlined"
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Apellidos del Estudiante"
                      name="apellidoEstudiante"
                      value={incidenciaData.apellidoEstudiante}
                      InputProps={{
                        readOnly: true,
                      }}
                      disabled
                      variant="outlined"
                    />
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <TextField
                      fullWidth
                      label="Nivel"
                      value={incidenciaData.nivel}
                      InputProps={{
                        readOnly: true,
                      }}
                      disabled
                      variant="outlined"
                    />
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <TextField
                      fullWidth
                      label="Grado"
                      value={incidenciaData.grado ? `${incidenciaData.grado}° Grado` : ''}
                      InputProps={{
                        readOnly: true,
                      }}
                      disabled
                      variant="outlined"
                    />
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <TextField
                      fullWidth
                      label="Celular del Apoderado"
                      value={incidenciaData.celularApoderado}
                      InputProps={{
                        readOnly: true,
                      }}
                      disabled
                      variant="outlined"
                    />
                  </Grid>
                </Grid>
              </Paper>
            </Grid>

            {/* Sección Incidencia - Solo fecha y hora editables */}
            <Grid item xs={12}>
              <Paper elevation={0} sx={{ p: 3, bgcolor: alpha(theme.palette.warning.main, 0.02) }}>
                <SectionHeader 
                  icon={<AssignmentIcon />} 
                  title="Detalles de la Incidencia"
                  color={theme.palette.warning.main}
                />
                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Tipo de Incidencia"
                      value={incidenciaData.tipo}
                      InputProps={{
                        readOnly: true,
                      }}
                      disabled
                      variant="outlined"
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Estado"
                      value={incidenciaData.estado}
                      InputProps={{
                        readOnly: true,
                      }}
                      disabled
                      variant="outlined"
                    />
                  </Grid>
                  
                  {/* Campos editables: Fecha y Hora */}
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
                            variant="outlined" 
                            error={!!errors.fecha}
                            helperText={errors.fecha}
                            sx={{
                              '& .MuiOutlinedInput-root': {
                                '&:hover fieldset': {
                                  borderColor: theme.palette.warning.main,
                                },
                                '&.Mui-focused fieldset': {
                                  borderColor: theme.palette.warning.main,
                                }
                              }
                            }}
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
                            variant="outlined" 
                            error={!!errors.hora}
                            helperText={errors.hora}
                            sx={{
                              '& .MuiOutlinedInput-root': {
                                '&:hover fieldset': {
                                  borderColor: theme.palette.warning.main,
                                },
                                '&.Mui-focused fieldset': {
                                  borderColor: theme.palette.warning.main,
                                }
                              }
                            }}
                          />
                        )}
                      />
                    </LocalizationProvider>
                  </Grid>

                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Detalle de la Incidencia"
                      value={incidenciaData.detalle}
                      multiline
                      rows={4}
                      InputProps={{
                        readOnly: true,
                      }}
                      disabled
                      variant="outlined"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="URL de la Imagen"
                      value={incidenciaData.urlImagen}
                      InputProps={{
                        readOnly: true,
                      }}
                      disabled
                      variant="outlined"
                    />
                  </Grid>
                </Grid>
              </Paper>
            </Grid>

            {/* Sección Profesor - Solo lectura */}
            <Grid item xs={12}>
              <Paper elevation={0} sx={{ p: 3, bgcolor: alpha(theme.palette.grey[500], 0.05) }}>
                <SectionHeader 
                  icon={<SchoolIcon />} 
                  title="Información del Profesor (Solo lectura)"
                  color={theme.palette.grey[600]}
                />
                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Nombres del Profesor"
                      value={incidenciaData.nombreProfesor}
                      InputProps={{
                        readOnly: true,
                      }}
                      disabled
                      variant="outlined"
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Apellidos del Profesor"
                      value={incidenciaData.apellidoProfesor}
                      InputProps={{
                        readOnly: true,
                      }}
                      disabled
                      variant="outlined"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Cargo del Profesor"
                      value={incidenciaData.cargo}
                      InputProps={{
                        readOnly: true,
                      }}
                      disabled
                      variant="outlined"
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