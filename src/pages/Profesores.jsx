import React, { useEffect, useState, useMemo } from "react";
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
  Chip,
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

  // Cargos válidos
  const cargosValidos = useMemo(
    () => ["Formador", "Rector", "Docente", "Director"],
    []
  );

  useEffect(() => {
    const fetchProfesores = async () => {
      try {
        const snapshot = await getDocs(collection(db, "Profesor"));
        const data = snapshot.docs
          .map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }))
          .filter((profesor) => cargosValidos.includes(profesor.cargo));
        setProfesores(data);
      } catch (err) {
        console.error("Error al obtener profesores:", err);
        setError("No se pudieron cargar los profesores. Intenta más tarde.");
      } finally {
        setLoading(false);
      }
    };

    fetchProfesores();
  }, [cargosValidos]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  // Filtrado avanzado
  const filteredProfesores = profesores.filter((profesor) => {
    const fullName = `${profesor.nombres} ${profesor.apellidos}`.toLowerCase();
    const matchesSearch = fullName.includes(search.toLowerCase());
    const matchesCargo = cargoFilter ? profesor.cargo === cargoFilter : true;
    const matchesTutor = tutorFilter
      ? tutorFilter === "Sí"
        ? profesor.tutor === true
        : profesor.tutor === false
      : true;
    return matchesSearch && matchesCargo && matchesTutor;
  });

  // CRUD Operations
  const handleAddProfesor = async (profesorData) => {
    try {
      const docRef = await addDoc(collection(db, "Profesor"), profesorData);
      setProfesores([...profesores, { id: docRef.id, ...profesorData }]);
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
    } catch (error) {
      console.error("Error al eliminar profesor:", error);
      setError("Error al eliminar profesor");
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

      <Grid container spacing={2} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md>
          <TextField
            fullWidth
            label="Buscar por nombre o apellido"
            variant="outlined"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(0);
            }}
            sx={{ minWidth: 220 }}
          />
        </Grid>

        <Grid item xs={12} sm={6} md>
          <TextField
            select
            fullWidth
            label="Filtrar por Cargo"
            variant="outlined"
            value={cargoFilter}
            onChange={(e) => {
              setCargoFilter(e.target.value);
              setPage(0);
            }}
            sx={{ minWidth: 220 }}
          >
            <MenuItem value="">
              <em>Todos los cargos</em>
            </MenuItem>
            {cargosValidos.map((cargo) => (
              <MenuItem key={cargo} value={cargo}>
                {cargo}
              </MenuItem>
            ))}
          </TextField>
        </Grid>

        <Grid item xs={12} sm={6} md>
          <TextField
            select
            fullWidth
            label="Filtrar por Tutor"
            variant="outlined"
            value={tutorFilter}
            onChange={(e) => {
              setTutorFilter(e.target.value);
              setPage(0);
            }}
            sx={{ minWidth: 220 }}
          >
            <MenuItem value="">
              <em>Todos</em>
            </MenuItem>
            <MenuItem value="Sí">Sí</MenuItem>
            <MenuItem value="No">No</MenuItem>
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
            <Table stickyHeader aria-label="tabla profesores">
              <TableHead>
                <TableRow>
                  <TableCell>N°</TableCell>
                  <TableCell>Nombres</TableCell>
                  <TableCell>Apellidos</TableCell>
                  <TableCell>Cargo</TableCell>
                  <TableCell>Correo</TableCell>
                  <TableCell>Celular</TableCell>
                  <TableCell>Password</TableCell>
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
                      <TableCell>{profesor.nombres}</TableCell>
                      <TableCell>{profesor.apellidos}</TableCell>
                      <TableCell>{profesor.cargo || "—"}</TableCell>
                      <TableCell>{profesor.correo}</TableCell>
                      <TableCell>{profesor.celular}</TableCell>
                      <TableCell>
                        {"*".repeat(profesor.password?.length || 8)}
                      </TableCell>
                      <TableCell>{profesor.tutor ? "Sí" : "No"}</TableCell>
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

      {/* Modals */}
      <AddProfesorModal
        open={openAddModal}
        onClose={() => setOpenAddModal(false)}
        onSave={handleAddProfesor}
        cargosValidos={cargosValidos}
      />

      <EditProfesorModal
        open={openEditModal}
        onClose={() => setOpenEditModal(false)}
        onSave={handleEditProfesor}
        profesor={selectedProfesor}
        cargosValidos={cargosValidos}
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
