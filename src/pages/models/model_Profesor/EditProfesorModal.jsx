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
  cargosValidos = [],
  profesoresExistentes = []
}) => {
  const [profesorData, setProfesorData] = useState({
    nombres: '',
    apellidos: '',
    dni: '',
    cargo: '',
    correo: '',
    celular: '',
    password: '',
    tutor: false,
    grado: '',
    seccion: ''
  });

  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);

  // Configuración de grados y secciones
  const grados = [1, 2, 3, 4, 5];
  const secciones = {
    1: ['A', 'B', 'C', 'D', 'E'],
    2: ['A', 'B', 'C', 'D'],
    3: ['A', 'B', 'C', 'D'],
    4: ['A', 'B', 'C', 'D'],
    5: ['A', 'B', 'C', 'D']
  };

  // Cargos que pueden ser tutores
  const cargosDocentes = ['Docente nombrado', 'Docente contratado'];

  useEffect(() => {
    if (profesor) {
      setProfesorData({
        nombres: profesor.nombres || '',
        apellidos: profesor.apellidos || '',
        dni: profesor.dni || '',
        cargo: profesor.cargo || '',
        correo: profesor.correo || '',
        celular: profesor.celular || '',
        password: profesor.password || '',
        tutor: profesor.tutor || false,
        grado: profesor.grado || '',
        seccion: profesor.seccion || ''
      });
    }
  }, [profesor]);

  // Obtener combinaciones ocupadas por otros tutores (excluyendo el profesor actual)
  const combinacionesOcupadas = profesoresExistentes
    .filter(prof => 
      prof.tutor && 
      prof.grado && 
      prof.seccion && 
      prof.id !== profesor?.id // Excluir el profesor actual
    )
    .map(prof => `${prof.grado}${prof.seccion}`);

  // Verificar si hay combinaciones disponibles
  const hayCombinaciónDisponible = () => {
    for (const grado of grados) {
      for (const seccion of secciones[grado]) {
        if (!combinacionesOcupadas.includes(`${grado}${seccion}`)) {
          return true;
        }
      }
    }
    return false;
  };

  // Verificar si la combinación actual está disponible
  const esCombinacionDisponible = () => {
    if (!profesorData.grado || !profesorData.seccion) return false;
    const combinacion = `${profesorData.grado}${profesorData.seccion}`;
    return !combinacionesOcupadas.includes(combinacion);
  };

  // Verificar si el cargo puede ser tutor
  const puedeSerTutor = () => {
    return cargosDocentes.includes(profesorData.cargo);
  };

  // Obtener secciones disponibles para el grado seleccionado
  const getSeccionesDisponibles = () => {
    if (!profesorData.grado || !secciones[profesorData.grado]) return [];
    
    return secciones[profesorData.grado].filter(seccion => {
      const combinacion = `${profesorData.grado}${seccion}`;
      return !combinacionesOcupadas.includes(combinacion);
    });
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (name === 'cargo') {
      // Si cambia el cargo y no es docente, desactivar tutor
      const nuevosCargos = {
        ...profesorData,
        cargo: value,
        tutor: cargosDocentes.includes(value) ? profesorData.tutor : false,
        grado: cargosDocentes.includes(value) ? profesorData.grado : '',
        seccion: cargosDocentes.includes(value) ? profesorData.seccion : ''
      };
      setProfesorData(nuevosCargos);
    } else if (name === 'tutor') {
      // Si se desactiva tutor, limpiar grado y sección
      setProfesorData({
        ...profesorData,
        tutor: checked,
        grado: checked ? profesorData.grado : '',
        seccion: checked ? profesorData.seccion : ''
      });
    } else if (name === 'grado') {
      // Resetear sección cuando cambie el grado
      setProfesorData({
        ...profesorData,
        grado: value,
        seccion: ''
      });
    } else {
      setProfesorData({
        ...profesorData,
        [name]: type === 'checkbox' ? checked : value
      });
    }
  };

  const handleClickShowPassword = () => {
    setShowPassword((show) => !show);
  };

  const validate = () => {
    const newErrors = {};
    
    // Validaciones requeridas
    if (!profesorData.nombres.trim()) newErrors.nombres = 'Nombres es requerido';
    if (!profesorData.apellidos.trim()) newErrors.apellidos = 'Apellidos es requerido';
    if (!profesorData.dni) newErrors.dni = 'DNI es requerido';
    if (!profesorData.cargo) newErrors.cargo = 'Cargo es requerido';
    if (!profesorData.correo.trim()) newErrors.correo = 'Correo es requerido';
    if (!profesorData.password.trim()) newErrors.password = 'Contraseña es requerida';
    
    // Validaciones de formato
    if (profesorData.dni && (!/^\d{8}$/.test(profesorData.dni))) {
      newErrors.dni = 'DNI debe tener 8 dígitos';
    }
    
    if (profesorData.correo && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(profesorData.correo)) {
      newErrors.correo = 'Formato de correo inválido';
    }
    
    if (profesorData.celular && !/^\d{9}$/.test(profesorData.celular)) {
      newErrors.celular = 'Celular debe tener 9 dígitos';
    }

    // Validaciones de tutor
    if (profesorData.tutor) {
      if (!profesorData.grado) newErrors.grado = 'Grado es requerido para tutores';
      if (!profesorData.seccion) newErrors.seccion = 'Sección es requerida para tutores';
      if (profesorData.grado && profesorData.seccion && !esCombinacionDisponible()) {
        newErrors.tutor = 'Esta combinación grado-sección ya está ocupada por otro tutor';
      }
    }
    
    return newErrors;
  };

  const handleSubmit = () => {
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    
    // Preparar datos para envío
    const dataToSave = {
      ...profesorData,
      dni: parseInt(profesorData.dni),
      celular: profesorData.celular ? parseInt(profesorData.celular) : null,
      nombres: profesorData.nombres.trim(),
      apellidos: profesorData.apellidos.trim(),
      correo: profesorData.correo.trim(),
      password: profesorData.password.trim(),
      grado: profesorData.grado ? parseInt(profesorData.grado) : null,
      seccion: profesorData.seccion || null
    };
    
    onSave(dataToSave);
    onClose();
  };

  const handleClose = () => {
    setErrors({});
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
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
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="DNI"
              name="dni"
              value={profesorData.dni}
              onChange={handleChange}
              error={!!errors.dni}
              helperText={errors.dni}
              required
              inputProps={{ maxLength: 8 }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
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
              {(Array.isArray(cargosValidos) ? cargosValidos : []).map((cargo) => (
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
              error={!!errors.celular}
              helperText={errors.celular}
              inputProps={{ maxLength: 9 }}
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
          
          {/* Switch de tutor - solo visible para cargos docentes */}
          {puedeSerTutor() && (
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
                        disabled={!profesorData.tutor && !hayCombinaciónDisponible()}
                      />
                    }
                    label={profesorData.tutor ? 'Sí' : 'No'}
                  />
                  {!profesorData.tutor && !hayCombinaciónDisponible() && (
                    <div style={{ color: '#f44336', fontSize: '0.75rem', marginTop: '4px' }}>
                      No hay combinaciones grado-sección disponibles
                    </div>
                  )}
                  {errors.tutor && (
                    <div style={{ color: '#f44336', fontSize: '0.75rem', marginTop: '4px' }}>
                      {errors.tutor}
                    </div>
                  )}
                </FormGroup>
              </FormControl>
            </Grid>
          )}
          
          {/* Campos de grado y sección - solo visibles cuando tutor está activado */}
          {profesorData.tutor && puedeSerTutor() && (
            <>
              <Grid item xs={12} sm={6}>
                <TextField
                  select
                  fullWidth
                  label="Grado"
                  name="grado"
                  value={profesorData.grado}
                  onChange={handleChange}
                  error={!!errors.grado}
                  helperText={errors.grado}
                  required
                >
                  <MenuItem value="">
                    <em>Seleccionar grado</em>
                  </MenuItem>
                  {grados.map((grado) => {
                    // Verificar si este grado tiene secciones disponibles
                    const tieneSeccionesDisponibles = secciones[grado].some(seccion => {
                      const combinacion = `${grado}${seccion}`;
                      return !combinacionesOcupadas.includes(combinacion);
                    });
                    
                    return (
                      <MenuItem key={grado} value={grado} disabled={!tieneSeccionesDisponibles}>
                        {grado}° {!tieneSeccionesDisponibles ? '(Sin secciones disponibles)' : ''}
                      </MenuItem>
                    );
                  })}
                </TextField>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  select
                  fullWidth
                  label="Sección"
                  name="seccion"
                  value={profesorData.seccion}
                  onChange={handleChange}
                  error={!!errors.seccion}
                  helperText={errors.seccion}
                  disabled={!profesorData.grado}
                  required
                >
                  <MenuItem value="">
                    <em>Seleccionar sección</em>
                  </MenuItem>
                  {profesorData.grado && getSeccionesDisponibles().map((seccion) => (
                    <MenuItem key={seccion} value={seccion}>
                      {seccion}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
            </>
          )}
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="secondary">
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