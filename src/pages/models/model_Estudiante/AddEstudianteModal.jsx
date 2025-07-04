import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  MenuItem,
  Box,
} from '@mui/material';

const AddEstudianteModal = ({ open, onClose, onSave, grados, getSeccionesDisponibles }) => {
  const [formData, setFormData] = useState({
    nombres: '',
    apellidos: '',
    grado: '',
    seccion: '',
    celularApoderado: '',
    dni: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Si cambia el grado, resetear la sección
    if (name === 'grado') {
      setFormData(prev => ({ 
        ...prev, 
        [name]: value,
        seccion: '' // Resetear sección cuando cambia grado
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = () => {
    // Validación básica
    if (!formData.nombres || !formData.apellidos || !formData.grado || !formData.seccion || !formData.dni || !formData.celularApoderado) {
      alert('Por favor complete todos los campos requeridos');
      return;
    }

    // Validar DNI (8 dígitos)
    if (formData.dni.toString().length !== 8) {
      alert('El DNI debe tener 8 dígitos');
      return;
    }

    // Validar celular (9 dígitos)
    if (formData.celularApoderado.toString().length !== 9) {
      alert('El celular debe tener 9 dígitos');
      return;
    }

    // Convertir números a tipo number para coincidir con Firebase
    const dataToSave = {
      ...formData,
      grado: parseInt(formData.grado),
      dni: parseInt(formData.dni),
      celularApoderado: parseInt(formData.celularApoderado),
    };

    onSave(dataToSave);
    handleReset();
    onClose();
  };

  const handleReset = () => {
    setFormData({
      nombres: '',
      apellidos: '',
      grado: '',
      seccion: '',
      celularApoderado: '',
      dni: '',
    });
  };

  const handleCancel = () => {
    handleReset();
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleCancel} maxWidth="sm" fullWidth>
      <DialogTitle>Añadir Nuevo Estudiante</DialogTitle>
      <DialogContent>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 2 }}>
          <TextField
            label="Nombres"
            name="nombres"
            value={formData.nombres}
            onChange={handleChange}
            fullWidth
            required
            placeholder="Ingrese los nombres"
          />
          <TextField
            label="Apellidos"
            name="apellidos"
            value={formData.apellidos}
            onChange={handleChange}
            fullWidth
            required
            placeholder="Ingrese los apellidos"
          />
          <TextField
            select
            label="Grado"
            name="grado"
            value={formData.grado}
            onChange={handleChange}
            fullWidth
            required
          >
            <MenuItem value="">Seleccione un grado</MenuItem>
            {grados.map((grado) => (
              <MenuItem key={grado} value={grado}>
                {grado}° Grado
              </MenuItem>
            ))}
          </TextField>
          <TextField
            select
            label="Sección"
            name="seccion"
            value={formData.seccion}
            onChange={handleChange}
            fullWidth
            required
            disabled={!formData.grado}
          >
            <MenuItem value="">Seleccione una sección</MenuItem>
            {formData.grado && getSeccionesDisponibles && getSeccionesDisponibles(parseInt(formData.grado)).map((seccion) => (
              <MenuItem key={seccion} value={seccion}>
                Sección {seccion}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            label="DNI"
            name="dni"
            value={formData.dni}
            onChange={handleChange}
            fullWidth
            required
            type="number"
            inputProps={{ 
              maxLength: 8,
              min: 10000000,
              max: 99999999
            }}
            placeholder="8 dígitos"
          />
          <TextField
            label="Celular Apoderado"
            name="celularApoderado"
            value={formData.celularApoderado}
            onChange={handleChange}
            fullWidth
            required
            type="number"
            inputProps={{ 
              maxLength: 9,
              min: 900000000,
              max: 999999999
            }}
            placeholder="9 dígitos"
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleCancel} color="inherit">
          Cancelar
        </Button>
        <Button onClick={handleSubmit} variant="contained" color="primary">
          Guardar
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddEstudianteModal;