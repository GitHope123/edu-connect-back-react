import React, { useEffect, useState } from "react";
import {
  Box,
  CircularProgress,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Alert,
  TablePagination,
  IconButton,
  Tooltip,
  Button,
  TextField,
  MenuItem,
  Grid,
  Snackbar,
} from "@mui/material";
import {
  collection,
  getDocs,
  doc,
  deleteDoc,
  addDoc,
  updateDoc,
} from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";

import AddEstudianteModal from "./models/model_Estudiante/AddEstudianteModal";
import EditEstudianteModal from "./models/model_Estudiante/EditEstudianteModal";
import DeleteEstudianteModal from "./models/model_Estudiante/DeleteEstudianteModal";
import InformeModal from "./models/model_Estudiante/InformeModal";

const grados = [1, 2, 3, 4, 5];
const seccionesComunes = ["A", "B", "C", "D"];
const seccionEspecial = "E";

const Estudiantes = () => {
  const [estudiantes, setEstudiantes] = useState([]);
  const [incidencias, setIncidencias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [gradoFilter, setGradoFilter] = useState("");
  const [seccionFilter, setSeccionFilter] = useState("");
  const [incidenciasFilter, setIncidenciasFilter] = useState("");
  const [page, setPage] = useState(0);
  const rowsPerPage = 10;
  const [openAddModal, setOpenAddModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [openInformeModal, setOpenInformeModal] = useState(false);
  const [selectedEstudiante, setSelectedEstudiante] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  const getSeccionesDisponibles = (grado) => {
    if (grado === 1) return [...seccionesComunes, seccionEspecial];
    return seccionesComunes;
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Obtener estudiantes
        const estudiantesSnapshot = await getDocs(collection(db, "Estudiante"));
        const estudiantesData = estudiantesSnapshot.docs.map(doc => ({
          id: doc.id,
          idEstudiante: doc.id,
          ...doc.data(),
          cantidadIncidencias: 0
        }));

        // Obtener incidencias
        const incidenciasSnapshot = await getDocs(collection(db, "Incidencia"));
        const incidenciasData = incidenciasSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));

        // Actualizar contador de incidencias de forma robusta
        const estudiantesConIncidencias = estudiantesData.map(estudiante => {
          // Primero intenta por idEstudiante
          let count = incidenciasData.filter(
            inc => inc.idEstudiante === estudiante.idEstudiante
          ).length;

          // Si no hay incidencias por id, intenta por nombre y apellido
          if (count === 0) {
            count = incidenciasData.filter(
              inc =>
                inc.nombreEstudiante === estudiante.nombres &&
                inc.apellidoEstudiante === estudiante.apellidos
            ).length;
          }

          return { ...estudiante, cantidadIncidencias: count };
        });

        setEstudiantes(estudiantesConIncidencias);
        setIncidencias(incidenciasData);
      } catch (error) {
        console.error("Error al cargar datos:", error);
        setError("Error al cargar los datos. Intente nuevamente.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  // Filtro avanzado con ordenamiento por incidencias (mayor a menor)
  const filteredEstudiantes = estudiantes
    .filter((estudiante) => {
      const fullName =
        `${estudiante.nombres} ${estudiante.apellidos}`.toLowerCase();
      const matchesSearch = fullName.includes(search.toLowerCase());
      const matchesGrado = gradoFilter
        ? Number(estudiante.grado) === Number(gradoFilter)
        : true;
      const matchesSeccion = seccionFilter
        ? estudiante.seccion === seccionFilter
        : true;
      const matchesIncidencias = incidenciasFilter
        ? incidenciasFilter === "con"
          ? (estudiante.cantidadIncidencias ?? 0) > 0
          : (estudiante.cantidadIncidencias ?? 0) === 0
        : true;

      return matchesSearch && matchesGrado && matchesSeccion && matchesIncidencias;
    })
    .sort((a, b) => (b.cantidadIncidencias || 0) - (a.cantidadIncidencias || 0));

  // Función para manejar el click en el informe
  const handleInformeClick = (estudiante) => {
    if ((estudiante.cantidadIncidencias || 0) === 0) {
      setSnackbarMessage("No hay incidencias por lo tanto no es posible generar informe");
      setSnackbarOpen(true);
      return;
    }
    setSelectedEstudiante(estudiante);
    setOpenInformeModal(true);
  };

  // Funciones CRUD
  const handleAddEstudiante = async (estudianteData) => {
    try {
      const docRef = await addDoc(collection(db, "Estudiante"), estudianteData);
      setEstudiantes([...estudiantes, { 
        id: docRef.id, 
        idEstudiante: docRef.id,
        cantidadIncidencias: 0,
        ...estudianteData 
      }]);
    } catch (error) {
      console.error("Error al añadir estudiante:", error);
      setError("Error al añadir estudiante");
    }
  };

  const handleEditEstudiante = async (estudianteData) => {
    try {
      await updateDoc(
        doc(db, "Estudiante", selectedEstudiante.id),
        estudianteData
      );
      setEstudiantes(
        estudiantes.map((est) =>
          est.id === selectedEstudiante.id ? { ...est, ...estudianteData } : est
        )
      );
    } catch (error) {
      console.error("Error al editar estudiante:", error);
      setError("Error al editar estudiante");
    }
  };

  const handleDeleteEstudiante = async () => {
    try {
      await deleteDoc(doc(db, "Estudiante", selectedEstudiante.id));
      setEstudiantes(
        estudiantes.filter((est) => est.id !== selectedEstudiante.id)
      );
    } catch (error) {
      console.error("Error al eliminar estudiante:", error);
      setError("Error al eliminar estudiante");
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  return (
    <Box sx={{ p: 4 }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 4,
        }}
      >
        <Typography variant="h4" fontWeight="bold">
          Gestión de Estudiantes
        </Typography>
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Chip
            label={`Total: ${estudiantes.length}`}
            color="primary"
            variant="outlined"
          />
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setOpenAddModal(true)}
          >
            Añadir Estudiante
          </Button>
        </Box>
      </Box>

      <Grid container spacing={2} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={4}>
          <TextField
            fullWidth
            label="Buscar por nombre o apellido"
            variant="outlined"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(0);
            }}
            sx={{ minWidth: 200 }}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <TextField
            select
            fullWidth
            label="Filtrar por Grado"
            variant="outlined"
            value={gradoFilter}
            onChange={(e) => {
              setGradoFilter(e.target.value);
              setSeccionFilter("");
              setPage(0);
            }}
            sx={{ minWidth: 200 }}
          >
            <MenuItem value="">
              <em>Todos los grados</em>
            </MenuItem>
            {grados.map((grado) => (
              <MenuItem key={grado} value={grado}>
                {grado}° Grado
              </MenuItem>
            ))}
          </TextField>
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <TextField
            select
            fullWidth
            label="Filtrar por Sección"
            variant="outlined"
            value={seccionFilter}
            onChange={(e) => {
              setSeccionFilter(e.target.value);
              setPage(0);
            }}
            disabled={!gradoFilter}
            sx={{ minWidth: 200 }}
          >
            <MenuItem value="">
              <em>Todas las secciones</em>
            </MenuItem>
            {getSeccionesDisponibles(gradoFilter).map((seccion) => (
              <MenuItem key={seccion} value={seccion}>
                Sección {seccion}
              </MenuItem>
            ))}
          </TextField>
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <TextField
            select
            fullWidth
            label="Filtrar por Incidencias"
            variant="outlined"
            value={incidenciasFilter}
            onChange={(e) => {
              setIncidenciasFilter(e.target.value);
              setPage(0);
            }}
            sx={{ minWidth: 200 }}
          >
            <MenuItem value="">
              <em>Todas las incidencias</em>
            </MenuItem>
            <MenuItem value="con">Con Incidencias</MenuItem>
            <MenuItem value="sin">Sin Incidencias</MenuItem>
          </TextField>
        </Grid>
      </Grid>

      {loading && (
        <Box sx={{ display: "flex", justifyContent: "center", my: 8 }}>
          <CircularProgress size={48} />
        </Box>
      )}

      {error && (
        <Alert severity="error" sx={{ mb: 4 }}>
          {error}
        </Alert>
      )}

      {!loading && !error && (
        <Paper sx={{ width: "100%", overflow: "hidden", borderRadius: 3 }}>
          <TableContainer sx={{ maxHeight: 520 }}>
            <Table stickyHeader aria-label="tabla estudiantes">
              <TableHead>
                <TableRow>
                  <TableCell>Nombres</TableCell>
                  <TableCell>Apellidos</TableCell>
                  <TableCell>Grado</TableCell>
                  <TableCell>Sección</TableCell>
                  <TableCell>Celular Apoderado</TableCell>
                  <TableCell align="center">Incidencias</TableCell>
                  <TableCell align="center">Acciones</TableCell>
                  <TableCell align="center">Informe</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredEstudiantes
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((estudiante) => (
                    <TableRow hover key={estudiante.id} tabIndex={-1}>
                      <TableCell component="th" scope="row">
                        {estudiante.nombres}
                      </TableCell>
                      <TableCell>{estudiante.apellidos}</TableCell>
                      <TableCell>{estudiante.grado}°</TableCell>
                      <TableCell>{estudiante.seccion}</TableCell>
                      <TableCell>{estudiante.celularApoderado}</TableCell>
                      <TableCell align="center">
                        <Chip
                          label={estudiante.cantidadIncidencias ?? 0}
                          color={
                            estudiante.cantidadIncidencias > 0
                              ? "error"
                              : "success"
                          }
                          size="small"
                          variant="filled"
                        />
                      </TableCell>
                      <TableCell align="center">
                        <Tooltip title="Editar">
                          <IconButton
                            color="primary"
                            onClick={() => {
                              setSelectedEstudiante(estudiante);
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
                              setSelectedEstudiante(estudiante);
                              setOpenDeleteModal(true);
                            }}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                      <TableCell align="center">
                        <Tooltip title="Generar informe PDF">
                          <IconButton
                            color="primary"
                            onClick={() => handleInformeClick(estudiante)}
                          >
                            <PictureAsPdfIcon />
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
            count={filteredEstudiantes.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            rowsPerPageOptions={[]}
          />
        </Paper>
      )}

      {/* Modales */}
      <AddEstudianteModal
        open={openAddModal}
        onClose={() => setOpenAddModal(false)}
        onSave={handleAddEstudiante}
        grados={grados}
        getSeccionesDisponibles={getSeccionesDisponibles}
      />

      <EditEstudianteModal
        open={openEditModal}
        onClose={() => setOpenEditModal(false)}
        onSave={handleEditEstudiante}
        estudiante={selectedEstudiante}
        grados={grados}
        getSeccionesDisponibles={getSeccionesDisponibles}
      />

      <DeleteEstudianteModal
        open={openDeleteModal}
        onClose={() => setOpenDeleteModal(false)}
        onConfirm={handleDeleteEstudiante}
        estudiante={selectedEstudiante}
      />

      <InformeModal
        show={openInformeModal}
        handleClose={() => setOpenInformeModal(false)}
        estudiante={selectedEstudiante}
        todasLasIncidencias={incidencias}
      />

      {/* Snackbar para mostrar mensajes */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={4000}
        onClose={handleCloseSnackbar}
        message={snackbarMessage}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      />
    </Box>
  );
};

export default Estudiantes;