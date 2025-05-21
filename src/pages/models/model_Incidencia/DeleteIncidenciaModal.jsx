import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  Box,
  Typography,
  Alert
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

const DeleteIncidenciaModal = ({ open, onClose, onConfirm, incidencia }) => {
  const handleDelete = () => {
    onConfirm();
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        <Box display="flex" alignItems="center">
          <DeleteIcon color="error" sx={{ mr: 1 }} />
          <Typography variant="h6">Confirmar Eliminación</Typography>
        </Box>
      </DialogTitle>
      <DialogContent dividers>
        <DialogContentText>
          ¿Estás seguro que deseas eliminar la incidencia del estudiante{' '}
          <strong>
            {incidencia?.nombreEstudiante} {incidencia?.apellidoEstudiante}
          </strong>
          ? Esta acción no se puede deshacer.
        </DialogContentText>
        <Box mt={2}>
          <Typography variant="subtitle1">Detalles de la incidencia:</Typography>
          <Typography variant="body2">
            <strong>Tipo:</strong> {incidencia?.tipo}
          </Typography>
          <Typography variant="body2">
            <strong>Fecha:</strong> {incidencia?.fecha} {incidencia?.hora}
          </Typography>
          <Typography variant="body2">
            <strong>Estado:</strong> {incidencia?.estado}
          </Typography>
        </Box>
        <Alert severity="error" sx={{ mt: 2 }}>
          Todos los datos asociados a esta incidencia también serán eliminados permanentemente.
        </Alert>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary" variant="outlined">
          Cancelar
        </Button>
        <Button
          onClick={handleDelete}
          color="error"
          variant="contained"
          startIcon={<DeleteIcon />}
        >
          Eliminar Definitivamente
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeleteIncidenciaModal;