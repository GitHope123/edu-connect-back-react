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

const secciones = ['A', 'B', 'C', 'D', 'E']; // Todas las secciones disponibles

const AddEstudianteModal = ({ open, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    nombres: '',
    apellidos: '',
    seccion: '',
    celularApoderado: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    onSave(formData);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
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
          />
          <TextField
            label="Apellidos"
            name="apellidos"
            value={formData.apellidos}
            onChange={handleChange}
            fullWidth
            required
          />
          <TextField
            select
            label="Sección"
            name="seccion"
            value={formData.seccion}
            onChange={handleChange}
            fullWidth
            required
          >
            <MenuItem value="">Seleccione una sección</MenuItem>
            {secciones.map((seccion) => (
              <MenuItem key={seccion} value={seccion}>
                {seccion}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            label="Celular Apoderado"
            name="celularApoderado"
            value={formData.celularApoderado}
            onChange={handleChange}
            fullWidth
            required
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancelar</Button>
        <Button onClick={handleSubmit} variant="contained" color="primary">
          Guardar
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddEstudianteModal;