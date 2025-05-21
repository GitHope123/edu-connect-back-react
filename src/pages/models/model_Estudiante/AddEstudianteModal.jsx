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

const niveles = ['Primaria', 'Secundaria'];
const grados = [1, 2, 3, 4, 5, 6];

const AddEstudianteModal = ({ open, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    nombres: '',
    apellidos: '',
    nivel: '',
    grado: '',
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
            label="Nivel"
            name="nivel"
            value={formData.nivel}
            onChange={handleChange}
            fullWidth
            required
          >
            <MenuItem value="">Seleccione un nivel</MenuItem>
            {niveles.map((nivel) => (
              <MenuItem key={nivel} value={nivel}>
                {nivel}
              </MenuItem>
            ))}
          </TextField>
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
                {grado}
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