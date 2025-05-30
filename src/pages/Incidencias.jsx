import React, { useEffect, useState, useMemo } from 'react';
import {
  Box,
  Typography,
  CircularProgress,
  Alert,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  TablePagination,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Stack,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  TextField,
  Grid,
  Tooltip,
  Avatar
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Close as CloseIcon,
  Visibility as VisibilityIcon,
  CheckCircle as CheckCircleIcon,
  Notifications as NotificationsIcon,
  EventNote as EventNoteIcon,
  HourglassEmpty as HourglassEmptyIcon,
  DoneAll as DoneAllIcon
} from '@mui/icons-material';
import { collection, getDocs, doc, deleteDoc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase/firebaseConfig';

// Import modals
import EditIncidenciaModal from './models/model_Incidencia/EditIncidenciaModal';
import DeleteIncidenciaModal from './models/model_Incidencia/DeleteIncidenciaModal';

// Estilos personalizados
const estadoStyles = {
  pendiente: {
    bgcolor: '#FFF3E0',
    color: '#E65100',
    icon: <HourglassEmptyIcon fontSize="small" />
  },
  revisado: {
    bgcolor: '#E3F2FD',
    color: '#1565C0',
    icon: <VisibilityIcon fontSize="small" />
  },
  notificado: {
    bgcolor: '#E8F5E9',
    color: '#2E7D32',
    icon: <NotificationsIcon fontSize="small" />
  },
  citado: {
    bgcolor: '#F3E5F5',
    color: '#7B1FA2',
    icon: <EventNoteIcon fontSize="small" />
  },
  completado: {
    bgcolor: '#E8F5E9',
    color: '#1B5E20',
    icon: <DoneAllIcon fontSize="small" />
  }
};

const Incidencias = () => {
  const [incidencias, setIncidencias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [page, setPage] = useState(0);
  const rowsPerPage = 10;

  const [filtroTipo, setFiltroTipo] = useState('Todos');
  const [filtroImagen, setFiltroImagen] = useState('Todos');
  const [filtroEstado, setFiltroEstado] = useState('Todos');
  const [ordenFechaAsc, setOrdenFechaAsc] = useState(false);
  const [search, setSearch] = useState('');

  // Modal states
  const [openDetailsModal, setOpenDetailsModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [selectedIncidencia, setSelectedIncidencia] = useState(null);

  useEffect(() => {
    const fetchIncidencias = async () => {
      try {
        const snapshot = await getDocs(collection(db, 'Incidencia'));
        const data = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setIncidencias(data);
      } catch (err) {
        console.error('Error al obtener incidencias:', err);
        setError('No se pudieron cargar las incidencias. Intenta más tarde.');
      } finally {
        setLoading(false);
      }
    };

    fetchIncidencias();
  }, []);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const parseFecha = (fechaStr) => {
    if (!fechaStr) return new Date(0);
    const [dd, mm, yyyy] = fechaStr.split('/');
    return new Date(`${yyyy}-${mm}-${dd}`);
  };

  const incidenciasFiltradas = useMemo(() => {
    let datos = [...incidencias];

    // Search filter
    // Search filter
    if (search) {
      const searchLower = search.toLowerCase();
      datos = datos.filter(inc => (
        inc.nombreEstudiante?.toLowerCase().includes(searchLower) ||
        inc.apellidoEstudiante?.toLowerCase().includes(searchLower) ||
        inc.nombreProfesor?.toLowerCase().includes(searchLower) ||
        inc.detalle?.toLowerCase().includes(searchLower)
      ));
    }
    if (filtroTipo !== 'Todos') {
      datos = datos.filter(
        (inc) => inc.tipo && inc.tipo.toLowerCase() === filtroTipo.toLowerCase()
      );
    }

    if (filtroEstado !== 'Todos') {
      datos = datos.filter(
        (inc) => inc.estado && inc.estado.toLowerCase() === filtroEstado.toLowerCase()
      );
    }

    if (filtroImagen === 'Con Imagen') {
      datos = datos.filter((inc) => inc.urlImagen);
    } else if (filtroImagen === 'Sin Imagen') {
      datos = datos.filter((inc) => !inc.urlImagen);
    }

    datos.sort((a, b) => {
      const fechaA = parseFecha(a.fecha);
      const fechaB = parseFecha(b.fecha);
      return ordenFechaAsc ? fechaA - fechaB : fechaB - fechaA;
    });

    return datos;
  }, [incidencias, filtroTipo, filtroEstado, filtroImagen, ordenFechaAsc, search]);


  const opcionesTipo = useMemo(() => {
    const setTipo = new Set(incidencias.map((i) => i.tipo).filter(Boolean));
    return ['Todos', ...Array.from(setTipo)];
  }, [incidencias]);

  const opcionesEstado = ['Todos', 'pendiente', 'revisado', 'notificado', 'citado', 'completado'];

  const handleEditIncidencia = async (incidenciaData) => {
    try {
      await updateDoc(doc(db, 'Incidencia', selectedIncidencia.id), incidenciaData);
      setIncidencias(incidencias.map(inc => 
        inc.id === selectedIncidencia.id ? { ...inc, ...incidenciaData } : inc
      ));
    } catch (error) {
      console.error('Error al editar incidencia:', error);
      setError('Error al editar incidencia');
    }
  };

  const handleDeleteIncidencia = async () => {
    try {
      await deleteDoc(doc(db, 'Incidencia', selectedIncidencia.id));
      setIncidencias(incidencias.filter(inc => inc.id !== selectedIncidencia.id));
    } catch (error) {
      console.error('Error al eliminar incidencia:', error);
      setError('Error al eliminar incidencia');
    }
  };

  const renderEstadoChip = (estado) => {
    const estilo = estadoStyles[estado?.toLowerCase()] || estadoStyles.pendiente;
    return (
      <Chip
        icon={estilo.icon}
        label={estado}
        sx={{
          backgroundColor: estilo.bgcolor,
          color: estilo.color,
          fontWeight: 'bold',
          px: 1,
          borderRadius: 1
        }}
      />
    );
  };

  return (
    <Box sx={{ p: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" fontWeight="bold">
          Gestión de Incidencias
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Chip 
            label={`Total: ${incidencias.length}`} 
            color="primary" 
            variant="outlined" 
          />
        </Box>
      </Box>

      {/* Filtros y buscador */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} md={3}>
          <TextField
            fullWidth
            label="Buscar (estudiante, profesor o detalle)"
            variant="outlined"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(0);
            }}
          />
        </Grid>
        <Grid item xs={6} sm={4} md={2}>
          <FormControl fullWidth>
            <InputLabel>Estado</InputLabel>
            <Select
              value={filtroEstado}
              label="Estado"
              onChange={(e) => {
                setFiltroEstado(e.target.value);
                setPage(0);
              }}
            >
              {opcionesEstado.map((opt) => (
                <MenuItem key={opt} value={opt}>
                  {opt.charAt(0).toUpperCase() + opt.slice(1)}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={6} sm={4} md={2}>
          <FormControl fullWidth>
            <InputLabel>Tipo</InputLabel>
            <Select
              value={filtroTipo}
              label="Tipo"
              onChange={(e) => {
                setFiltroTipo(e.target.value);
                setPage(0);
              }}
            >
              {opcionesTipo.map((opt) => (
                <MenuItem key={opt} value={opt}>
                  {opt}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={6} sm={4} md={2}>
          <FormControl fullWidth>
            <InputLabel>Imagen</InputLabel>
            <Select
              value={filtroImagen}
              label="Imagen"
              onChange={(e) => {
                setFiltroImagen(e.target.value);
                setPage(0);
              }}
            >
              <MenuItem value="Todos">Todos</MenuItem>
              <MenuItem value="Con Imagen">Con Imagen</MenuItem>
              <MenuItem value="Sin Imagen">Sin Imagen</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={6} sm={4} md={2}>
          <Button
            fullWidth
            variant="outlined"
            onClick={() => setOrdenFechaAsc(!ordenFechaAsc)}
            sx={{ height: '56px' }}
          >
            Orden: {ordenFechaAsc ? 'Más antiguas' : 'Más recientes'}
          </Button>
        </Grid>
      </Grid>

      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 8 }}>
          <CircularProgress size={48} />
        </Box>
      )}

      {error && <Alert severity="error" sx={{ mb: 4 }}>{error}</Alert>}

      {!loading && !error && (
        <>
          <Paper sx={{ width: '100%', overflow: 'hidden', borderRadius: 3 }}>
            <TableContainer sx={{ maxHeight: 520 }}>
              <Table stickyHeader aria-label="tabla incidencias">
                <TableHead>
                  <TableRow>
                    <TableCell>N°</TableCell>
                    <TableCell>Estudiante</TableCell>
                    <TableCell>Emisor</TableCell>
                    <TableCell>Tipo</TableCell>
                    <TableCell>Estado</TableCell>
                    <TableCell>Fecha</TableCell>
                    <TableCell align="center">Detalles</TableCell>
                    <TableCell align="center">Acciones</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {incidenciasFiltradas
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((incidencia, index) => (
                      <TableRow hover key={incidencia.id} tabIndex={-1}>
                        <TableCell>{page * rowsPerPage + index + 1}</TableCell>
                        <TableCell>
                          {incidencia.nombreEstudiante} {incidencia.apellidoEstudiante}
                          <Typography variant="body2" color="text.secondary">
                            Grado y Sección: {incidencia.grado} {incidencia.seccion}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          {incidencia.nombreProfesor} {incidencia.apellidoProfesor}
                          <Typography variant="body2" color="text.secondary">
                            {incidencia.cargo}
                          </Typography>
                        </TableCell>
                        <TableCell>{incidencia.tipo}</TableCell>
                        <TableCell>
                          {renderEstadoChip(incidencia.estado)}
                        </TableCell>
                        <TableCell>
                          {incidencia.fecha}
                          <Typography variant="body2" color="text.secondary">
                            {incidencia.hora}
                          </Typography>
                        </TableCell>
                        <TableCell align="center">
                          <Chip
                            label="Ver detalles"
                            color="primary"
                            variant="outlined"
                            onClick={() => {
                              setSelectedIncidencia(incidencia);
                              setOpenDetailsModal(true);
                            }}
                            clickable
                            icon={<VisibilityIcon fontSize="small" />}
                          />
                        </TableCell>
                        <TableCell align="center">
                          <Tooltip title="Editar">
                            <IconButton
                              color="primary"
                              onClick={() => {
                                setSelectedIncidencia(incidencia);
                                setOpenEditModal(true);
                              }}
                            >
                              <EditIcon />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Eliminar">
                            <IconButton
                              color="error"
                              onClick={() => {
                                setSelectedIncidencia(incidencia);
                                setOpenDeleteModal(true);
                              }}
                            >
                              <DeleteIcon />
                            </IconButton>
                          </Tooltip>
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </TableContainer>

            <TablePagination
              component="div"
              count={incidenciasFiltradas.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              rowsPerPageOptions={[]}
            />
          </Paper>

          {/* Modal para mostrar detalles */}
          <Dialog
            open={openDetailsModal}
            onClose={() => setOpenDetailsModal(false)}
            maxWidth="md"
            fullWidth
          >
            <DialogTitle sx={{ m: 0, p: 2 }}>
              Detalles de la Incidencia
              <IconButton
                aria-label="cerrar"
                onClick={() => setOpenDetailsModal(false)}
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
              {selectedIncidencia && (
                <Grid container spacing={3}>
                  {selectedIncidencia.urlImagen && (
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
                          src={selectedIncidencia.urlImagen}
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
                  <Grid item xs={12} md={selectedIncidencia.urlImagen ? 6 : 12}>
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
                            {selectedIncidencia.nombreEstudiante} {selectedIncidencia.apellidoEstudiante}
                          </Typography>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <Typography variant="subtitle2">Grado/Nivel:</Typography>
                          <Typography>
                            {selectedIncidencia.grado} {selectedIncidencia.nivel}
                          </Typography>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <Typography variant="subtitle2">Profesor:</Typography>
                          <Typography>
                            {selectedIncidencia.nombreProfesor} {selectedIncidencia.apellidoProfesor}
                          </Typography>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <Typography variant="subtitle2">Cargo:</Typography>
                          <Typography>{selectedIncidencia.cargo}</Typography>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <Typography variant="subtitle2">Tipo:</Typography>
                          <Typography>{selectedIncidencia.tipo}</Typography>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <Typography variant="subtitle2">Estado:</Typography>
                          {renderEstadoChip(selectedIncidencia.estado)}
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <Typography variant="subtitle2">Fecha:</Typography>
                          <Typography>
                            {selectedIncidencia.fecha} - {selectedIncidencia.hora}
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
                              {selectedIncidencia.detalle || 'No hay detalles adicionales'}
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
        </>
      )}

      {/* Modals CRUD */}
      <EditIncidenciaModal
        open={openEditModal}
        onClose={() => setOpenEditModal(false)}
        onSave={handleEditIncidencia}
        incidencia={selectedIncidencia}
      />

      <DeleteIncidenciaModal
        open={openDeleteModal}
        onClose={() => setOpenDeleteModal(false)}
        onConfirm={handleDeleteIncidencia}
        incidencia={selectedIncidencia}
      />
    </Box>
  );
};

export default Incidencias;