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
  Tooltip
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Close as CloseIcon,
  Visibility as VisibilityIcon
} from '@mui/icons-material';
import { collection, getDocs, doc, deleteDoc, addDoc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase/firebaseConfig';

// Import modals
import AddIncidenciaModal from './models/model_Incidencia/AddIncidenciaModal';
import EditIncidenciaModal from './models/model_Incidencia/EditIncidenciaModal';
import DeleteIncidenciaModal from './models/model_Incidencia/DeleteIncidenciaModal';

const Incidencias = () => {
  const [incidencias, setIncidencias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [page, setPage] = useState(0);
  const rowsPerPage = 10;

  const [filtroAtencion, setFiltroAtencion] = useState('Todos');
  const [filtroTipo, setFiltroTipo] = useState('Todos');
  const [filtroImagen, setFiltroImagen] = useState('Todos');
  const [ordenFechaAsc, setOrdenFechaAsc] = useState(false);
  const [search, setSearch] = useState('');

  // Modal states
  const [imagenSeleccionada, setImagenSeleccionada] = useState(null);
  const [openAddModal, setOpenAddModal] = useState(false);
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
    if (search) {
      const searchLower = search.toLowerCase();
      datos = datos.filter(inc => (
        inc.nombreEstudiante?.toLowerCase().includes(searchLower) ||
        inc.apellidoEstudiante?.toLowerCase().includes(searchLower) ||
        inc.nombreProfesor?.toLowerCase().includes(searchLower) ||
        inc.detalle?.toLowerCase().includes(searchLower)
      ));
    }

    if (filtroAtencion !== 'Todos') {
      datos = datos.filter(
        (inc) => inc.atencion && inc.atencion.toLowerCase() === filtroAtencion.toLowerCase()
      );
    }

    if (filtroTipo !== 'Todos') {
      datos = datos.filter(
        (inc) => inc.tipo && inc.tipo.toLowerCase() === filtroTipo.toLowerCase()
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
  }, [incidencias, filtroAtencion, filtroTipo, filtroImagen, ordenFechaAsc, search]);

  const opcionesAtencion = useMemo(() => {
    const setAtencion = new Set(incidencias.map((i) => i.atencion).filter(Boolean));
    return ['Todos', ...Array.from(setAtencion)];
  }, [incidencias]);

  const opcionesTipo = useMemo(() => {
    const setTipo = new Set(incidencias.map((i) => i.tipo).filter(Boolean));
    return ['Todos', ...Array.from(setTipo)];
  }, [incidencias]);

  // CRUD Operations
  const handleAddIncidencia = async (incidenciaData) => {
    try {
      const docRef = await addDoc(collection(db, 'Incidencia'), incidenciaData);
      setIncidencias([...incidencias, { id: docRef.id, ...incidenciaData }]);
    } catch (error) {
      console.error('Error al añadir incidencia:', error);
      setError('Error al añadir incidencia');
    }
  };

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
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setOpenAddModal(true)}
          >
            Añadir Incidencia
          </Button>
        </Box>
      </Box>

      {/* Filtros y buscador */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} md={4}>
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
        <Grid item xs={12} md={2}>
          <FormControl fullWidth>
            <InputLabel>Atención</InputLabel>
            <Select
              value={filtroAtencion}
              label="Atención"
              onChange={(e) => {
                setFiltroAtencion(e.target.value);
                setPage(0);
              }}
            >
              {opcionesAtencion.map((opt) => (
                <MenuItem key={opt} value={opt}>
                  {opt}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} md={2}>
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
        <Grid item xs={12} md={2}>
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
        <Grid item xs={12} md={2}>
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
                    <TableCell>Profesor</TableCell>
                    <TableCell>Tipo</TableCell>
                    <TableCell>Estado</TableCell>
                    <TableCell>Fecha</TableCell>
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
                            Grado: {incidencia.grado} {incidencia.nivel}
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
                          <Chip
                            label={incidencia.estado}
                            color={
                              incidencia.estado?.toLowerCase() === 'pendiente'
                                ? 'warning'
                                : incidencia.estado?.toLowerCase() === 'resuelto'
                                ? 'success'
                                : 'default'
                            }
                            size="small"
                          />
                        </TableCell>
                        <TableCell>
                          {incidencia.fecha}
                          <Typography variant="body2" color="text.secondary">
                            {incidencia.hora}
                          </Typography>
                        </TableCell>
                        <TableCell align="center">
                          <Tooltip title="Ver detalles">
                            <IconButton
                              color="primary"
                              onClick={() => {
                                setSelectedIncidencia(incidencia);
                                // Aquí podrías abrir un modal de visualización si lo deseas
                              }}
                            >
                              <VisibilityIcon />
                            </IconButton>
                          </Tooltip>
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
                          {incidencia.urlImagen && (
                            <Tooltip title="Ver imagen">
                              <IconButton
                                color="secondary"
                                onClick={() => setImagenSeleccionada(incidencia.urlImagen)}
                              >
                                <VisibilityIcon />
                              </IconButton>
                            </Tooltip>
                          )}
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

          {/* Modal para mostrar imagen */}
          <Dialog
            open={Boolean(imagenSeleccionada)}
            onClose={() => setImagenSeleccionada(null)}
            maxWidth="sm"
            fullWidth
          >
            <DialogTitle sx={{ m: 0, p: 2 }}>
              Imagen de la Incidencia
              <IconButton
                aria-label="cerrar"
                onClick={() => setImagenSeleccionada(null)}
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
            <DialogContent dividers sx={{ display: 'flex', justifyContent: 'center' }}>
              <img
                src={imagenSeleccionada}
                alt="Incidencia"
                style={{ maxWidth: '100%', maxHeight: '70vh', borderRadius: 8 }}
              />
            </DialogContent>
          </Dialog>
        </>
      )}

      {/* Modals CRUD */}
      <AddIncidenciaModal
        open={openAddModal}
        onClose={() => setOpenAddModal(false)}
        onSave={handleAddIncidencia}
      />

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