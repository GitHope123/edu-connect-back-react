import React, { useState, useRef, useEffect } from 'react';
import { 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  IconButton, 
  Typography, 
  Grid, 
  Box, 
  Divider, 
  DialogActions,
  Slider 
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import ZoomInIcon from '@mui/icons-material/ZoomIn';
import ZoomOutMapIcon from '@mui/icons-material/ZoomOutMap';
import ZoomOutIcon from '@mui/icons-material/ZoomOut';
import ZoomInMapIcon from '@mui/icons-material/ZoomInMap';

const DetalleIncidenciaModal = ({ open, onClose, incidencia, renderEstadoChip }) => {
  const [openImg, setOpenImg] = useState(false);
  const [imgSize, setImgSize] = useState('contain'); // 'contain' o 'cover'
  const [zoom, setZoom] = useState(1);
  const imgContainerRef = useRef(null);

  const toggleImageSize = () => {
    setImgSize(prev => prev === 'contain' ? 'cover' : 'contain');
    resetImageZoom();
  };

  const resetImageZoom = () => {
    setZoom(1);
  };

  const handleZoomChange = (event, newValue) => {
    setZoom(newValue);
  };

  // Resetear zoom al abrir/cerrar el modal
  useEffect(() => {
    if (openImg) {
      resetImageZoom();
    }
  }, [openImg]);

  return (
    <>
      <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
        <DialogTitle sx={{
          m: 0,
          p: 2,
          backgroundColor: (theme) => theme.palette.primary.main,
          color: (theme) => theme.palette.common.white,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <Typography variant="h6" fontWeight="bold">
            Detalles de la Incidencia
          </Typography>
          <IconButton
            aria-label="cerrar"
            onClick={onClose}
            sx={{ color: (theme) => theme.palette.common.white }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent dividers sx={{ p: 0 }}>
          {incidencia && (
            <Grid container>
              {/* Columna izquierda - Imagen */}
              {incidencia.urlImagen && (
                <Grid item xs={12} md={5} sx={{
                  p: 2,
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  bgcolor: '#f8f8f8',
                  minHeight: '400px',
                  borderRight: { md: '1px solid #e0e0e0' }
                }}>
                  <Box sx={{
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    overflow: 'hidden',
                    position: 'relative'
                  }}>
                    <img
                      src={incidencia.urlImagen}
                      alt="Incidencia"
                      style={{
                        maxWidth: '100%',
                        maxHeight: '400px',
                        objectFit: 'contain',
                        cursor: 'zoom-in',
                        borderRadius: 8,
                        transition: 'transform 0.3s',
                        ':hover': {
                          transform: 'scale(1.02)'
                        }
                      }}
                      onClick={() => setOpenImg(true)}
                      title="Haz clic para expandir"
                    />
                    <IconButton
                      onClick={() => setOpenImg(true)}
                      sx={{
                        position: 'absolute',
                        bottom: 12,
                        right: 12,
                        background: 'rgba(255,255,255,0.8)',
                        '&:hover': { background: 'rgba(255,255,255,1)' }
                      }}
                      size="small"
                    >
                      <ZoomInIcon fontSize="small" />
                    </IconButton>
                  </Box>
                </Grid>
              )}

              {/* Columna derecha - Información */}
              <Grid item xs={12} md={incidencia.urlImagen ? 7 : 12}>
                <Box sx={{ p: 3 }}>
                  {/* Información básica en 2 columnas */}
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="subtitle1" fontWeight="bold" gutterBottom color="primary">
                        Datos del Estudiante
                      </Typography>
                      <Box sx={{ pl: 1 }}>
                        <Typography variant="subtitle2" color="text.secondary">
                          Nombre completo:
                        </Typography>
                        <Typography paragraph sx={{ mb: 2 }}>
                          {incidencia.nombreEstudiante} {incidencia.apellidoEstudiante}
                        </Typography>

                        <Typography variant="subtitle2" color="text.secondary">
                          Grado/Sección:
                        </Typography>
                        <Typography paragraph sx={{ mb: 2 }}>
                          {incidencia.grado} {incidencia.seccion}
                        </Typography>
                      </Box>
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      <Typography variant="subtitle1" fontWeight="bold" gutterBottom color="primary">
                        Datos del Reporte
                      </Typography>
                      <Box sx={{ pl: 1 }}>
                        <Typography variant="subtitle2" color="text.secondary">
                          Fecha y hora:
                        </Typography>
                        <Typography paragraph sx={{ mb: 2 }}>
                          {incidencia.fecha} - {incidencia.hora}
                        </Typography>

                        <Typography variant="subtitle2" color="text.secondary">
                          Estado:
                        </Typography>
                        <Box sx={{ mb: 2 }}>
                          {renderEstadoChip(incidencia.estado)}
                        </Box>

                        <Typography variant="subtitle2" color="text.secondary">
                          Tipo:
                        </Typography>
                        <Typography paragraph sx={{ mb: 2 }}>
                          {incidencia.tipo}
                        </Typography>
                      </Box>
                    </Grid>
                  </Grid>

                  <Divider sx={{ my: 2 }} />

                  {/* Detalles completos */}
                  <Box>
                    <Typography variant="subtitle1" fontWeight="bold" gutterBottom color="primary">
                      Detalle Completo
                    </Typography>
                    <Box sx={{
                      p: 2,
                      bgcolor: '#f9f9f9',
                      borderRadius: 1,
                      border: '1px solid #e0e0e0',
                      whiteSpace: 'pre-line'
                    }}>
                      <Typography>
                        {incidencia.detalle || 'No hay detalles adicionales'}
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              </Grid>
            </Grid>
          )}
        </DialogContent>
      </Dialog>

      {/* Dialog para imagen expandida - Versión con slider de zoom */}
      <Dialog
        open={openImg}
        onClose={() => {
          setOpenImg(false);
          resetImageZoom();
        }}
        maxWidth={false}
        PaperProps={{
          sx: {
            background: 'rgba(0,0,0,0.9)',
            boxShadow: 'none',
            width: '95vw',
            height: '95vh',
            maxWidth: 'none',
            margin: 0,
            overflow: 'hidden'
          }
        }}
      >
        <DialogActions sx={{ 
          justifyContent: 'flex-end', 
          p: 1,
          position: 'absolute',
          top: 0,
          right: 0,
          zIndex: 1,
          width: '100%',
          background: 'linear-gradient(to bottom, rgba(0,0,0,0.7) 0%, transparent 100%)'
        }}>
          <IconButton
            onClick={() => {
              setOpenImg(false);
              resetImageZoom();
            }}
            sx={{
              color: '#fff',
              background: 'rgba(255,255,255,0.2)',
              '&:hover': { background: 'rgba(255,255,255,0.3)' },
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogActions>
        
        <Box
          ref={imgContainerRef}
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            width: '100%',
            height: '100%',
            overflow: 'hidden',
            position: 'relative',
            cursor: 'default'
          }}
        >
          <img
            src={incidencia?.urlImagen}
            alt="Incidencia ampliada"
            style={{
              objectFit: imgSize,
              width: imgSize === 'cover' ? '100%' : 'auto',
              height: imgSize === 'cover' ? '100%' : 'auto',
              maxWidth: '100%',
              maxHeight: '100%',
              transform: `scale(${zoom})`,
              transition: 'transform 0.2s ease-out'
            }}
          />
          {/* Slider y controles en la esquina inferior derecha */}
          <Box
            sx={{
              position: 'absolute',
              right: 32,
              bottom: 24,
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              background: 'rgba(0,0,0,0.4)',
              borderRadius: 2,
              px: 2,
              py: 1,
              zIndex: 2
            }}
          >
            <IconButton
              onClick={toggleImageSize}
              sx={{
                color: '#fff',
                background: 'rgba(255,255,255,0.2)',
                '&:hover': { background: 'rgba(255,255,255,0.3)' },
              }}
              title={imgSize === 'contain' ? 'Ajustar imagen a pantalla' : 'Mostrar imagen completa'}
              size="small"
            >
              {imgSize === 'contain' ? <ZoomOutMapIcon /> : <ZoomInMapIcon />}
            </IconButton>
            <Slider
              value={zoom}
              onChange={handleZoomChange}
              min={1}
              max={5}
              step={0.1}
              aria-labelledby="zoom-slider"
              sx={{
                width: 120,
                color: '#fff',
                '& .MuiSlider-thumb': {
                  width: 16,
                  height: 16,
                },
                '& .MuiSlider-rail': {
                  opacity: 0.5,
                  backgroundColor: '#bfbfbf',
                },
                '& .MuiSlider-track': {
                  backgroundColor: '#fff',
                },
              }}
            />
            {zoom > 1 && (
              <IconButton
                onClick={resetImageZoom}
                sx={{
                  color: '#fff',
                  background: 'rgba(255,255,255,0.2)',
                  '&:hover': { background: 'rgba(255,255,255,0.3)' },
                }}
                title="Resetear zoom"
                size="small"
              >
                <ZoomOutIcon />
              </IconButton>
            )}
          </Box>
        </Box>
      </Dialog>
    </>
  );
};

export default DetalleIncidenciaModal;