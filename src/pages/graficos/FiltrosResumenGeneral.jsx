import React from 'react';
import { Box, FormControl, Typography, RadioGroup, FormControlLabel, Radio, Slider, Stack, Button } from '@mui/material';

const FiltrosResumenGeneral = ({
  tipo,
  setTipo,
  rango,
  setRango,
  minFecha,
  maxFecha,
  fechaToTs,
  tsToFecha
}) => (
  <Box
    sx={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'flex-start',
      mb: 3,
      p: 2,
      maxWidth: 1243,
      mx: 'auto',
      gap: 4,
      flexWrap: { xs: 'wrap', md: 'nowrap' }
    }}
  >
    {/* Filtro de tipo de incidencia */}
    <Box sx={{ minWidth: 280 }}>
      <FormControl component="fieldset" fullWidth>
        <Typography
          variant="subtitle1"
          fontWeight={600}
          sx={{
            color: 'text.secondary',
            mb: 1.5,
            textTransform: 'uppercase',
            fontSize: '0.75rem',
            letterSpacing: '0.5px'
          }}
        >
          Tipo de Incidencia
        </Typography>
        <RadioGroup
          row
          value={tipo}
          onChange={e => setTipo(e.target.value)}
          name="tipo-incidencia-radio"
          sx={{
            gap: 1,
          }}
        >
          {['todos', 'falta', 'reconocimiento'].map((option) => (
            <FormControlLabel
              key={option}
              value={option}
              control={
                <Radio
                  size="small"
                  sx={{
                    color: 'primary.light',
                    '&.Mui-checked': {
                      color: 'primary.main',
                    },
                  }}
                />
              }
              label={
                <Typography
                  sx={{
                    fontWeight: tipo === option ? 600 : 400,
                    color: tipo === option ? 'primary.main' : 'text.secondary',
                    fontSize: '0.875rem',
                    textTransform: 'capitalize'
                  }}
                >
                  {option}
                </Typography>
              }
              sx={{
                px: 2,
                py: 1,
                borderRadius: '8px',
                backgroundColor: tipo === option ? 'rgba(26, 115, 232, 0.05)' : 'transparent',
                border: tipo === option ? '1px solid' : '1px solid transparent',
                borderColor: tipo === option ? 'primary.light' : 'transparent',
                m: 0,
                transition: 'all 0.2s ease',
                '&:hover': {
                  backgroundColor: 'rgba(26, 115, 232, 0.03)'
                }
              }}
            />
          ))}
        </RadioGroup>
      </FormControl>
    </Box>
    {/*añade un separacion */}
    <Box sx={{ width: 150, display: { xs: 'none', md: 'block' } }} />

    {/* Filtro de rango de fechas */}
    <Box sx={{ flex: 1, minWidth: 0, maxWidth: 500 }}>
      <Typography
        variant="subtitle1"
        fontWeight={600}
        sx={{
          color: 'text.secondary',
          mb: 1.5,
          textTransform: 'uppercase',
          fontSize: '0.75rem',
          letterSpacing: '0.5px'
        }}
      >
        Rango de Fechas
      </Typography>
      <Slider
        value={rango}
        min={fechaToTs(minFecha)}
        max={fechaToTs(maxFecha)}
        step={24 * 60 * 60 * 1000}
        onChange={(_, newValue) => setRango(newValue)}
        valueLabelDisplay="auto"
        valueLabelFormat={ts => tsToFecha(ts)}
        marks={[
          { value: fechaToTs(minFecha), label: minFecha },
          { value: fechaToTs(maxFecha), label: maxFecha }
        ]}
        sx={{
          height: 6,
          '& .MuiSlider-thumb': {
            width: 18,
            height: 18,
            backgroundColor: 'primary.main',
            border: '2px solid #fff',
            boxShadow: '0 2px 10px rgba(26, 115, 232, 0.3)',
            '&:hover, &.Mui-active': {
              boxShadow: '0 2px 12px rgba(26, 115, 232, 0.4)'
            }
          },
          '& .MuiSlider-track': {
            border: 'none',
            backgroundColor: 'primary.main',
          },
          '& .MuiSlider-rail': {
            opacity: 0.3,
            backgroundColor: 'primary.light',
          },
          '& .MuiSlider-markLabel': {
            fontSize: '0.7rem',
            fontWeight: 500,
            color: 'text.secondary',
            mt: 1,
          },
          '& .MuiSlider-valueLabel': {
            backgroundColor: 'primary.main',
            borderRadius: '8px',
            fontSize: '0.75rem',
            fontWeight: 500
          }
        }}
        disabled={!minFecha || !maxFecha}
      />

      <Stack
        direction="row"
        spacing={2}
        alignItems="center"
        justifyContent="space-between"
        sx={{ mt: 1.5 }}
      >
        <Typography variant="body2" color="text.secondary">
          <Box component="span" fontWeight={500} color="text.primary">
            {tsToFecha(rango[0])}
          </Box>
        </Typography>
        <Button
          variant="text"
          color="primary"
          onClick={() => setRango([fechaToTs(minFecha), fechaToTs(maxFecha)])}
          size="small"
          sx={{
            borderRadius: '6px',
            fontSize: '0.75rem',
            px: 2,
            py: 0.5,
            textTransform: 'none',
            fontWeight: 500,
            '&:hover': {
              backgroundColor: 'rgba(26, 115, 232, 0.05)'
            }
          }}
          disabled={!minFecha || !maxFecha}
        >
          Restablecer
        </Button>
        <Typography variant="body2" color="text.secondary">
          <Box component="span" fontWeight={500} color="text.primary">
            {tsToFecha(rango[1])}
          </Box>
        </Typography>
      </Stack>
    </Box>
  </Box>
);

export default FiltrosResumenGeneral;