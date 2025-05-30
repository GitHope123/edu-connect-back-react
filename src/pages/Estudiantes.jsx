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
import "bootstrap/dist/css/bootstrap.min.css";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";

// Importamos los modales
import AddEstudianteModal from "./models/model_Estudiante/AddEstudianteModal";
import EditEstudianteModal from "./models/model_Estudiante/EditEstudianteModal";
import DeleteEstudianteModal from "./models/model_Estudiante/DeleteEstudianteModal";

const grados = [1, 2, 3, 4, 5, 6];
const seccionesComunes = ["A", "B", "C", "D"];
const seccionEspecial = "E"; // Solo para grado 1

const Estudiantes = () => {
  const [estudiantes, setEstudiantes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [search, setSearch] = useState("");
  const [gradoFilter, setGradoFilter] = useState("");
  const [seccionFilter, setSeccionFilter] = useState("");
  const [incidenciasFilter, setIncidenciasFilter] = useState("");

  // Paginación
  const [page, setPage] = useState(0);
  const rowsPerPage = 10;

  // Estados para los modales
  const [openAddModal, setOpenAddModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [selectedEstudiante, setSelectedEstudiante] = useState(null);

  // Función para obtener las secciones disponibles según el grado seleccionado
  const getSeccionesDisponibles = (grado) => {
    if (grado === 1) {
      return [...seccionesComunes, seccionEspecial];
    }
    return seccionesComunes;
  };

  useEffect(() => {
    const fetchEstudiantes = async () => {
      try {
        const snapshot = await getDocs(collection(db, "Estudiante"));
        const estudiantesData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setEstudiantes(estudiantesData);
      } catch (error) {
        console.error("Error al obtener estudiantes:", error);
        setError("No se pudieron cargar los estudiantes. Intenta más tarde.");
      } finally {
        setLoading(false);
      }
    };

    fetchEstudiantes();
  }, []);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  // Filtro avanzado
  const filteredEstudiantes = estudiantes.filter((estudiante) => {
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
  });

  // Funciones CRUD
  const handleAddEstudiante = async (estudianteData) => {
    try {
      const docRef = await addDoc(collection(db, "Estudiante"), estudianteData);
      setEstudiantes([...estudiantes, { id: docRef.id, ...estudianteData }]);
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
              setSeccionFilter(""); // Resetear sección al cambiar grado
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
    </Box>
  );
};

export default Estudiantes;