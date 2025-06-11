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
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as VisibilityIcon,
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
import FiltrosIncidencias from './models/model_Incidencia/FiltrosIncidencias';
import DetalleIncidenciaModal from './models/model_Incidencia/DetalleIncidenciaModal';

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

// Estilo uniforme para los filtros
const filterStyles = {
  formControl: {
    minWidth: 180,
    '& .MuiInputLabel-root': {
      color: '#555',
      fontWeight: 500
    },
    '& .MuiOutlinedInput-root': {
      borderRadius: 2,
      '& fieldset': {
        borderColor: '#ddd',
      },
      '&:hover fieldset': {
        borderColor: '#aaa',
      },
      '&.Mui-focused fieldset': {
        borderColor: '#3f51b5',
      },
    },
    '& .MuiSelect-select': {
      padding: '12px 14px',
    }
  },
  textField: {
    '& .MuiOutlinedInput-root': {
      borderRadius: 2,
      '& fieldset': {
        borderColor: '#ddd',
      },
      '&:hover fieldset': {
        borderColor: '#aaa',
      },
      '&.Mui-focused fieldset': {
        borderColor: '#3f51b5',
      },
    },
    '& .MuiInputLabel-root': {
      color: '#555',
      fontWeight: 500
    }
  },
  button: {
    height: '56px',
    borderRadius: 2,
    textTransform: 'none',
    fontWeight: 500,
    boxShadow: 'none',
    '&:hover': {
      boxShadow: 'none'
    }
  }
};

const Incidencias = () => {
  const [incidencias, setIncidencias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [page, setPage] = useState(0);
  const rowsPerPage = 10;

  const [filtroTipo, setFiltroTipo] = useState('Todos');
  const [filtroEstado, setFiltroEstado] = useState('Todos');
  const [ordenFechaAsc, setOrdenFechaAsc] = useState(false);
  const [search, setSearch] = useState('');
  const [fechaInicio, setFechaInicio] = useState(null);
  const [fechaFin, setFechaFin] = useState(null);

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

    // Filtro por rango de fechas
    if (fechaInicio && fechaFin) {
      const inicio = new Date(fechaInicio.setHours(0,0,0,0));
      const fin = new Date(fechaFin.setHours(23,59,59,999));
      datos = datos.filter((inc) => {
        const fechaInc = parseFecha(inc.fecha);
        return fechaInc >= inicio && fechaInc <= fin;
      });
    }

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
    datos.sort((a, b) => {
      const fechaA = parseFecha(a.fecha);
      const fechaB = parseFecha(b.fecha);
      return ordenFechaAsc ? fechaA - fechaB : fechaB - fechaA;
    });

    return datos;
  }, [incidencias, filtroTipo, filtroEstado, ordenFechaAsc, search, fechaInicio, fechaFin]);
  
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
      <FiltrosIncidencias
        search={search}
        setSearch={setSearch}
        filtroEstado={filtroEstado}
        setFiltroEstado={setFiltroEstado}
        filtroTipo={filtroTipo}
        setFiltroTipo={setFiltroTipo}
        fechaInicio={fechaInicio}
        setFechaInicio={setFechaInicio}
        fechaFin={fechaFin}
        setFechaFin={setFechaFin}
        ordenFechaAsc={ordenFechaAsc}
        setOrdenFechaAsc={setOrdenFechaAsc}
        setPage={setPage}
        opcionesEstado={opcionesEstado}
        opcionesTipo={opcionesTipo}
        onLimpiarFiltros={() => {
          setFiltroTipo('Todos');
          setFiltroEstado('Todos');
          setSearch('');
          setFechaInicio(null);
          setFechaFin(null);
          setPage(0);
        }}
        filterStyles={filterStyles}
      />

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
          <DetalleIncidenciaModal
            open={openDetailsModal}
            onClose={() => setOpenDetailsModal(false)}
            incidencia={selectedIncidencia}
            renderEstadoChip={renderEstadoChip}
          />
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