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

const DeleteProfesorModal = ({ open, onClose, onConfirm, profesor }) => {
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
          ¿Estás seguro que deseas eliminar al profesor{' '}
          <strong>
            {profesor?.nombres} {profesor?.apellidos}
          </strong>
          ? Esta acción no se puede deshacer.
        </DialogContentText>
        <Alert severity="warning" sx={{ mt: 2 }}>
          Todos los datos asociados a este profesor también serán eliminados permanentemente.
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

export default DeleteProfesorModal;