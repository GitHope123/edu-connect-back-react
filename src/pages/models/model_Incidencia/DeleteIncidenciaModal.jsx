import React, { useState, useCallback } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  Box,
  Typography,
  Alert,
  TextField,
  Divider,
  Chip,
  CircularProgress
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import WarningIcon from '@mui/icons-material/Warning';
import InfoIcon from '@mui/icons-material/Info';
import { doc, updateDoc, getDoc } from "firebase/firestore";
import { db } from "../../../firebase/firebaseConfig";

const DeleteIncidenciaModal = ({ open, onClose, onConfirm, incidencia }) => {
  const [confirmText, setConfirmText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState("");

  const handleDelete = useCallback(async () => {
    if (confirmText.trim().toLowerCase() !== "eliminar") {
      return;
    }

    setIsDeleting(true);
    setError("");

    try {
      // Lógica para restar cantidadIncidencias
      if (incidencia?.idEstudiante) {
        await restarCantidadIncidencias(incidencia.idEstudiante);
      }
      
      await onConfirm();
      handleClose();
    } catch (err) {
      console.error("Error al eliminar incidencia:", err);
      setError("Error al eliminar la incidencia. Por favor, intente nuevamente.");
    } finally {
      setIsDeleting(false);
    }
  }, [confirmText, incidencia, onConfirm]);

  const restarCantidadIncidencias = async (idEstudiante) => {
    try {
      const estudianteRef = doc(db, "Estudiantes", idEstudiante);
      const estudianteSnap = await getDoc(estudianteRef);
      
      if (estudianteSnap.exists()) {
        const actual = estudianteSnap.data().cantidadIncidencias || 0;
        await updateDoc(estudianteRef, {
          cantidadIncidencias: Math.max(0, actual - 1)
        });
      }
    } catch (error) {
      console.error("Error al actualizar cantidad de incidencias:", error);
      throw error;
    }
  };

  const handleClose = useCallback(() => {
    if (isDeleting) return;
    setConfirmText("");
    setError("");
    onClose();
  }, [isDeleting, onClose]);

  const handleConfirmTextChange = useCallback((e) => {
    setConfirmText(e.target.value);
    if (error) setError("");
  }, [error]);

  const isConfirmValid = confirmText.trim().toLowerCase() === "eliminar";

  // Función para obtener el color del chip según el estado
  const getEstadoColor = (estado) => {
    switch (estado?.toLowerCase()) {
      case 'pendiente':
        return 'warning';
      case 'resuelto':
        return 'success';
      case 'en proceso':
        return 'info';
      default:
        return 'default';
    }
  };

  return (
    <Dialog 
      open={open} 
      onClose={handleClose} 
      maxWidth="sm" 
      fullWidth
      disableEscapeKeyDown={isDeleting}
    >
      <DialogTitle>
        <Box display="flex" alignItems="center" gap={1}>
          <WarningIcon color="error" />
          <Typography variant="h6" color="error">
            Confirmar Eliminación
          </Typography>
        </Box>
      </DialogTitle>
      
      <DialogContent dividers>
        <DialogContentText sx={{ mb: 2 }}>
          ¿Estás seguro que deseas eliminar la incidencia del estudiante{' '}
          <Typography component="span" fontWeight="bold" color="text.primary">
            {incidencia?.nombreEstudiante} {incidencia?.apellidoEstudiante}
          </Typography>
          ?
        </DialogContentText>

        <Alert 
          severity="warning" 
          icon={<InfoIcon />}
          sx={{ mb: 2 }}
        >
          <Typography variant="body2">
            <strong>Atención:</strong> Esta acción es irreversible y eliminará permanentemente todos los datos asociados a esta incidencia.
          </Typography>
        </Alert>

        <Box sx={{ mb: 2 }}>
          <Typography variant="subtitle1" gutterBottom fontWeight="medium">
            Detalles de la incidencia:
          </Typography>
          <Box sx={{ pl: 2 }}>
            <Box display="flex" alignItems="center" gap={1} mb={1}>
              <Typography variant="body2" color="text.secondary">
                <strong>Tipo:</strong>
              </Typography>
              <Typography variant="body2" color="text.primary">
                {incidencia?.tipo || 'No especificado'}
              </Typography>
            </Box>
            
            <Box display="flex" alignItems="center" gap={1} mb={1}>
              <Typography variant="body2" color="text.secondary">
                <strong>Fecha y hora:</strong>
              </Typography>
              <Typography variant="body2" color="text.primary">
                {incidencia?.fecha} {incidencia?.hora}
              </Typography>
            </Box>
            
            <Box display="flex" alignItems="center" gap={1} mb={1}>
              <Typography variant="body2" color="text.secondary">
                <strong>Estado:</strong>
              </Typography>
              <Chip 
                label={incidencia?.estado || 'Sin estado'}
                color={getEstadoColor(incidencia?.estado)}
                size="small"
              />
            </Box>

            {incidencia?.descripcion && (
              <Box mt={1}>
                <Typography variant="body2" color="text.secondary">
                  <strong>Descripción:</strong>
                </Typography>
                <Typography variant="body2" color="text.primary" sx={{ fontStyle: 'italic' }}>
                  {incidencia.descripcion}
                </Typography>
              </Box>
            )}
          </Box>
        </Box>

        <Divider sx={{ my: 2 }} />

        <Box>
          <Typography variant="body2" color="error" gutterBottom>
            <strong>Para confirmar la eliminación, escriba "eliminar" en el campo:</strong>
          </Typography>
          <TextField
            fullWidth
            size="small"
            value={confirmText}
            onChange={handleConfirmTextChange}
            placeholder="Escriba 'eliminar' para confirmar"
            error={!!error}
            helperText={error}
            disabled={isDeleting}
            autoComplete="off"
            sx={{ mt: 1 }}
          />
        </Box>
      </DialogContent>
      
      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button 
          onClick={handleClose} 
          variant="outlined"
          disabled={isDeleting}
        >
          Cancelar
        </Button>
        <Button
          onClick={handleDelete}
          color="error"
          variant="contained"
          startIcon={isDeleting ? <CircularProgress size={16} /> : <DeleteIcon />}
          disabled={!isConfirmValid || isDeleting}
        >
          {isDeleting ? 'Eliminando...' : 'Eliminar Definitivamente'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeleteIncidenciaModal;