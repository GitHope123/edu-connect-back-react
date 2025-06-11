import React from 'react';
import { Dialog, DialogTitle, DialogContent, IconButton, Typography, Grid, Box } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

const DetalleIncidenciaModal = ({ open, onClose, incidencia, renderEstadoChip }) => (
  <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
    <DialogTitle sx={{ m: 0, p: 2 }}>
      Detalles de la Incidencia
      <IconButton
        aria-label="cerrar"
        onClick={onClose}
        sx={{
          position: 'absolute',
          right: 8,
          top: 8,
          color: (theme) => theme.palette.grey[500],
        }}
      >
        <CloseIcon />
      </IconButton>
    </DialogTitle>
    <DialogContent dividers>
      {incidencia && (
        <Grid container spacing={3}>
          {incidencia.urlImagen && (
            <Grid item xs={12} md={6}>
              <Box sx={{ 
                p: 2, 
                backgroundColor: '#f5f5f5', 
                borderRadius: 2,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100%'
              }}>
                <img
                  src={incidencia.urlImagen}
                  alt="Incidencia"
                  style={{ 
                    maxWidth: '100%', 
                    maxHeight: '400px', 
                    borderRadius: 8,
                    objectFit: 'contain'
                  }}
                />
              </Box>
            </Grid>
          )}
          <Grid item xs={12} md={incidencia.urlImagen ? 6 : 12}>
            <Box sx={{ 
              p: 3,
              backgroundColor: '#fafafa',
              borderRadius: 2,
              height: '100%'
            }}>
              <Typography variant="h6" gutterBottom>
                Información de la Incidencia
              </Typography>
              
              <Grid container spacing={2} sx={{ mt: 2 }}>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2">Estudiante:</Typography>
                  <Typography>
                    {incidencia.nombreEstudiante} {incidencia.apellidoEstudiante}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2">Grado/Nivel:</Typography>
                  <Typography>
                    {incidencia.grado} {incidencia.nivel}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2">Profesor:</Typography>
                  <Typography>
                    {incidencia.nombreProfesor} {incidencia.apellidoProfesor}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2">Cargo:</Typography>
                  <Typography>{incidencia.cargo}</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2">Tipo:</Typography>
                  <Typography>{incidencia.tipo}</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2">Estado:</Typography>
                  {renderEstadoChip(incidencia.estado)}
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2">Fecha:</Typography>
                  <Typography>
                    {incidencia.fecha} - {incidencia.hora}
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="subtitle2">Detalles:</Typography>
                  <Box sx={{ 
                    p: 2, 
                    backgroundColor: '#ffffff', 
                    borderRadius: 1,
                    border: '1px solid #e0e0e0',
                    mt: 1
                  }}>
                    <Typography>
                      {incidencia.detalle || 'No hay detalles adicionales'}
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </Box>
          </Grid>
        </Grid>
      )}
    </DialogContent>
  </Dialog>
);

export default DetalleIncidenciaModal;