import React, { useEffect, useState } from "react";
import { Chip } from "@mui/material";
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
  TablePagination,
  TextField,
  MenuItem,
  Grid,
  Button,
  IconButton,
  Tooltip,
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

// Import modals
import AddProfesorModal from "./models/model_Profesor/AddProfesorModal";
import EditProfesorModal from "./models/model_Profesor/EditProfesorModal";
import DeleteProfesorModal from "./models/model_Profesor/DeleteProfesorModal";

const Profesores = () => {
  const [profesores, setProfesores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [cargoFilter, setCargoFilter] = useState("");
  const [tutorFilter, setTutorFilter] = useState("");

  // Paginación
  const [page, setPage] = useState(0);
  const rowsPerPage = 10;

  // Modals state
  const [openAddModal, setOpenAddModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [selectedProfesor, setSelectedProfesor] = useState(null);

  // Cargos válidos (puedes modificar según tu configuración)
  const cargosValidos = [
    'Docente nombrado',
    'Docente contratado',
    'Director',
    'Subdirector',
    'Coordinador',
    'Auxiliar',
    'Administrativo'
  ];

  useEffect(() => {
    const fetchProfesores = async () => {
      try {
        const snapshot = await getDocs(collection(db, "Profesor"));
        const data = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setProfesores(data);
      } catch (err) {
        console.error("Error al obtener profesores:", err);
        setError("No se pudieron cargar los profesores. Intenta más tarde.");
      } finally {
        setLoading(false);
      }
    };

    fetchProfesores();
  }, []);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  // Función para ordenar profesores por grado y sección
  const ordenarProfesores = (profesores) => {
    return profesores.sort((a, b) => {
      // Primero ordenar por si es tutor o no (tutores primero)
      if (a.tutor && !b.tutor) return -1;
      if (!a.tutor && b.tutor) return 1;
      
      // Si ambos son tutores, ordenar por grado y luego por sección
      if (a.tutor && b.tutor) {
        if (a.grado !== b.grado) {
          return (a.grado || 999) - (b.grado || 999);
        }
        // Si el grado es igual, ordenar por sección
        if (a.seccion && b.seccion) {
          return a.seccion.localeCompare(b.seccion);
        }
        return 0;
      }
      
      // Si ninguno es tutor, ordenar alfabéticamente por nombre
      const nombreA = `${a.nombres} ${a.apellidos}`.toLowerCase();
      const nombreB = `${b.nombres} ${b.apellidos}`.toLowerCase();
      return nombreA.localeCompare(nombreB);
    });
  };

  // Filtrado avanzado
  const filteredProfesores = ordenarProfesores(
    profesores.filter((profesor) => {
      const fullName = `${profesor.nombres} ${profesor.apellidos}`.toLowerCase();
      const matchesSearch = fullName.includes(search.toLowerCase());
      const matchesCargo = cargoFilter ? profesor.cargo === cargoFilter : true;
      const matchesTutor =
        tutorFilter !== ""
          ? tutorFilter === "si"
            ? profesor.tutor
            : !profesor.tutor
          : true;

      return matchesSearch && matchesCargo && matchesTutor;
    })
  );

  // CRUD Operations
  const handleAddProfesor = async (profesorData) => {
    try {
      const docRef = await addDoc(collection(db, "Profesor"), profesorData);
      const newProfesor = { id: docRef.id, ...profesorData };
      setProfesores([...profesores, newProfesor]);
      setError(null); // Limpiar errores previos
    } catch (error) {
      console.error("Error al añadir profesor:", error);
      setError("Error al añadir profesor");
    }
  };

  const handleEditProfesor = async (profesorData) => {
    try {
      await updateDoc(doc(db, "Profesor", selectedProfesor.id), profesorData);
      setProfesores(
        profesores.map((prof) =>
          prof.id === selectedProfesor.id ? { ...prof, ...profesorData } : prof
        )
      );
      setError(null); // Limpiar errores previos
    } catch (error) {
      console.error("Error al editar profesor:", error);
      setError("Error al editar profesor");
    }
  };

  const handleDeleteProfesor = async () => {
    try {
      await deleteDoc(doc(db, "Profesor", selectedProfesor.id));
      setProfesores(
        profesores.filter((prof) => prof.id !== selectedProfesor.id)
      );
      setError(null); // Limpiar errores previos
    } catch (error) {
      console.error("Error al eliminar profesor:", error);
      setError("Error al eliminar profesor");
    }
  };

  // Extraer cargos únicos para el filtro
  const cargosUnicos = [
    ...new Set(profesores.map((prof) => prof.cargo)),
  ].filter(Boolean);

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
          Gestión de Profesores
        </Typography>
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Chip
            label={`Total: ${profesores.length}`}
            color="primary"
            variant="outlined"
          />
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setOpenAddModal(true)}
          >
            Añadir Profesor
          </Button>
        </Box>
      </Box>

      {/* Filtros mejorados con ancho consistente */}
      <Grid container spacing={2} sx={{ mb: 4 }}>
        {/* Buscador - Más ancho */}
        <Grid item xs={12} sm={6} md={4} lg={4}>
          <TextField
            fullWidth
            label="Buscar por nombre"
            variant="outlined"
            size="small"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(0);
            }}
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: "8px",
              },
              minWidth: 250, // Ancho mínimo garantizado
            }}
          />
        </Grid>

        {/* Filtro de Cargo - Más ancho */}
        <Grid item xs={12} sm={6} md={3} lg={3}>
          <TextField
            select
            fullWidth
            label="Filtrar por Cargo"
            variant="outlined"
            size="small"
            value={cargoFilter}
            onChange={(e) => {
              setCargoFilter(e.target.value);
              setPage(0);
            }}
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: "8px",
              },
              minWidth: 200, // Ancho mínimo garantizado
            }}
          >
            <MenuItem value="">
              <em>Todos los cargos</em>
            </MenuItem>
            {cargosUnicos.map((cargo) => (
              <MenuItem key={cargo} value={cargo}>
                {cargo}
              </MenuItem>
            ))}
          </TextField>
        </Grid>

        {/* Filtro de Tutor - Más ancho */}
        <Grid item xs={12} sm={6} md={3} lg={2}>
          <TextField
            select
            fullWidth
            label="Filtrar por Tutor"
            variant="outlined"
            size="small"
            value={tutorFilter}
            onChange={(e) => {
              setTutorFilter(e.target.value);
              setPage(0);
            }}
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: "8px",
              },
              minWidth: 180, // Ancho mínimo garantizado
            }}
          >
            <MenuItem value="">
              <em>Todos</em>
            </MenuItem>
            <MenuItem value="si">Solo tutores</MenuItem>
            <MenuItem value="no">No tutores</MenuItem>
          </TextField>
        </Grid>

        {/* Botón Limpiar - Ajustado al nuevo layout */}
        <Grid item xs={12} sm={6} md={2} lg={2}>
          <Button
            fullWidth
            variant="outlined"
            size="small"
            onClick={() => {
              setSearch("");
              setCargoFilter("");
              setTutorFilter("");
              setPage(0);
            }}
            sx={{
              height: "40px",
              borderRadius: "8px",
              minWidth: 120, // Ancho mínimo garantizado
            }}
          >
            Limpiar filtros
          </Button>
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
            <Table stickyHeader aria-label="tabla profesores">
              <TableHead>
                <TableRow>
                  <TableCell>N°</TableCell>
                  <TableCell>Nombres</TableCell>
                  <TableCell>Apellidos</TableCell>
                  <TableCell>Cargo</TableCell>
                  <TableCell>DNI</TableCell>
                  <TableCell>Correo</TableCell>
                  <TableCell>Celular</TableCell>
                  <TableCell>Tutor</TableCell>
                  <TableCell align="center">Acciones</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredProfesores
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((profesor, index) => (
                    <TableRow hover key={profesor.id} tabIndex={-1}>
                      <TableCell>{page * rowsPerPage + index + 1}</TableCell>
                      <TableCell>{profesor.nombres || "—"}</TableCell>
                      <TableCell>{profesor.apellidos || "—"}</TableCell>
                      <TableCell>{profesor.cargo || "—"}</TableCell>
                      <TableCell>{profesor.dni || "—"}</TableCell>
                      <TableCell>{profesor.correo || "—"}</TableCell>
                      <TableCell>{profesor.celular || "—"}</TableCell>
                      <TableCell>
                        {profesor.tutor ? (
                          <Chip
                            label={`${profesor.grado || "?"}° ${profesor.seccion || "?"}`}
                            color="success"
                            size="small"
                            sx={{ 
                              fontWeight: 'bold',
                              cursor: 'pointer'
                            }}
                            onClick={() =>
                              alert(
                                `${profesor.nombres} ${profesor.apellidos} es tutor de ${profesor.grado || "?"}° ${
                                  profesor.seccion || "?"
                                }`
                              )
                            }
                          />
                        ) : (
                          <Chip 
                            label="No tutor" 
                            color="default" 
                            size="small"
                            variant="outlined"
                          />
                        )}
                      </TableCell>
                      <TableCell align="center">
                        <Tooltip title="Editar">
                          <IconButton
                            color="primary"
                            onClick={() => {
                              setSelectedProfesor(profesor);
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
                              setSelectedProfesor(profesor);
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
            count={filteredProfesores.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            rowsPerPageOptions={[]}
          />
        </Paper>
      )}

      {/* Modals con props corregidas */}
      <AddProfesorModal
        open={openAddModal}
        onClose={() => setOpenAddModal(false)}
        onSave={handleAddProfesor}
        cargosValidos={cargosValidos}
        profesoresExistentes={profesores}
      />

      <EditProfesorModal
        open={openEditModal}
        onClose={() => setOpenEditModal(false)}
        onSave={handleEditProfesor}
        profesor={selectedProfesor}
        cargosValidos={cargosValidos}
        profesoresExistentes={profesores}
      />

      <DeleteProfesorModal
        open={openDeleteModal}
        onClose={() => setOpenDeleteModal(false)}
        onConfirm={handleDeleteProfesor}
        profesor={selectedProfesor}
      />
    </Box>
  );
};

export default Profesores;