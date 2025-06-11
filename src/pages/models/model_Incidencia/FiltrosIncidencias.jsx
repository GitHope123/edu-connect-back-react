import React from 'react';
import { 
  Grid, 
  TextField, 
  FormControl, 
  InputLabel, 
  Select, 
  MenuItem, 
  Button, 
  Stack,
  useTheme 
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { FilterAlt as FilterIcon, RestartAlt as ResetIcon } from '@mui/icons-material';

const FiltrosIncidencias = ({
  search,
  setSearch,
  filtroEstado,
  setFiltroEstado,
  filtroTipo,
  setFiltroTipo,
  fechaInicio,
  setFechaInicio,
  fechaFin,
  setFechaFin,
  ordenFechaAsc,
  setOrdenFechaAsc,
  setPage,
  opcionesEstado,
  opcionesTipo,
  onLimpiarFiltros,
  filterStyles
}) => {
  const theme = useTheme();
  
  const defaultStyles = {
    textField: {
      backgroundColor: theme.palette.background.paper,
      '& .MuiOutlinedInput-root': {
        borderRadius: '8px',
        height: '56px',
        '&:hover fieldset': {
          borderColor: theme.palette.primary.light,
        },
      },
    },
    formControl: {
      '& .MuiOutlinedInput-root': {
        borderRadius: '8px',
        backgroundColor: theme.palette.background.paper,
        height: '56px',
        display: 'flex',
        alignItems: 'center',
      },
      '& .MuiInputLabel-root': {
        transform: 'translate(14px, 16px) scale(1)',
        '&.MuiInputLabel-shrink': {
          transform: 'translate(14px, -9px) scale(0.75)',
        }
      }
    },
    button: {
      height: '56px',
      borderRadius: '8px',
      textTransform: 'none',
      fontWeight: 'medium',
      boxShadow: 'none',
      '&:hover': {
        boxShadow: theme.shadows[2],
      },
    },
    datePickerContainer: {
      height: '56px',
      display: 'flex',
      alignItems: 'center',
      '& .MuiOutlinedInput-root': {
        height: '56px',
        borderRadius: '8px',
      },
    },
  };

  const styles = filterStyles ? { ...defaultStyles, ...filterStyles } : defaultStyles;

  return (
    <Grid container spacing={2} sx={{ 
      mb: 3, 
      p: 2,
      borderRadius: '12px',
      backgroundColor: theme.palette.background.default,
      boxShadow: theme.shadows[1],
      alignItems: 'center',
      flexWrap: 'nowrap', // Asegura que todo esté en una sola fila
      overflowX: 'auto', // Permite scroll horizontal si no cabe
    }}>
      {/* Campo de búsqueda - Más ancho */}
      <Grid item sx={{ minWidth: '280px', flex: 2 }}>
        <TextField
          fullWidth
          label="Buscar (estudiante, profesor o detalle)"
          variant="outlined"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(0);
          }}
          sx={styles.textField}
        />
      </Grid>

      {/* Filtro por Estado */}
      <Grid item sx={{ minWidth: '180px', flex: 1 }}>
        <FormControl fullWidth sx={styles.formControl}>
          <InputLabel>Estado</InputLabel>
          <Select
            value={filtroEstado}
            label="Estado"
            onChange={(e) => {
              setFiltroEstado(e.target.value);
              setPage(0);
            }}
            MenuProps={{
              PaperProps: {
                sx: {
                  borderRadius: '8px',
                  marginTop: '8px',
                }
              }
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

      {/* Filtro por Tipo */}
      <Grid item sx={{ minWidth: '180px', flex: 1 }}>
        <FormControl fullWidth sx={styles.formControl}>
          <InputLabel>Tipo</InputLabel>
          <Select
            value={filtroTipo}
            label="Tipo"
            onChange={(e) => {
              setFiltroTipo(e.target.value);
              setPage(0);
            }}
            MenuProps={{
              PaperProps: {
                sx: {
                  borderRadius: '8px',
                  marginTop: '8px',
                }
              }
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

      {/* Filtro de fechas */}
      <Grid item sx={{ minWidth: '300px', flex: 2 }}>
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <Stack direction="row" spacing={1} sx={styles.datePickerContainer}>
            <DatePicker
              label="Fecha inicio"
              value={fechaInicio}
              onChange={(newValue) => {
                setFechaInicio(newValue);
                setPage(0);
              }}
              slotProps={{
                textField: {
                  size: 'small',
                  fullWidth: true,
                  sx: { 
                    '& .MuiOutlinedInput-root': {
                      height: '56px',
                    }
                  }
                }
              }}
              maxDate={fechaFin}
            />
            <DatePicker
              label="Fecha fin"
              value={fechaFin}
              onChange={(newValue) => {
                setFechaFin(newValue);
                setPage(0);
              }}
              slotProps={{
                textField: {
                  size: 'small',
                  fullWidth: true,
                  sx: { 
                    '& .MuiOutlinedInput-root': {
                      height: '56px',
                    }
                  }
                }
              }}
              minDate={fechaInicio}
            />
          </Stack>
        </LocalizationProvider>
      </Grid>

      {/* Botón de orden */}
      <Grid item sx={{ minWidth: '140px', flex: 1 }}>
        <Button
          fullWidth
          variant="outlined"
          startIcon={<FilterIcon />}
          onClick={() => setOrdenFechaAsc((v) => !v)}
          sx={{
            ...styles.button,
            borderColor: theme.palette.divider,
            color: theme.palette.text.primary,
          }}
        >
          {ordenFechaAsc ? 'Antiguas' : 'Recientes'}
        </Button>
      </Grid>

      {/* Botón para limpiar filtros */}
      <Grid item sx={{ minWidth: '140px', flex: 1 }}>
        <Button
          fullWidth
          variant="contained"
          color="secondary"
          startIcon={<ResetIcon />}
          sx={styles.button}
          onClick={onLimpiarFiltros}
        >
          Limpiar
        </Button>
      </Grid>
    </Grid>
  );
};

export default FiltrosIncidencias;