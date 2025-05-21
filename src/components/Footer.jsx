// src/components/Footer.jsx
import React from 'react';
import { Box, Typography } from '@mui/material';

const Footer = () => {
  return (
    <Box
      component="footer"
      sx={{
        bgcolor: 'primary.main',
        color: 'primary.contrastText',
        textAlign: 'center',
        py: 2,
        mt: 'auto',
        position: 'sticky',
        bottom: 0,
        width: '100%',
      }}
    >
      <Typography variant="body2">
        © 2025 EduConnect. Todos los derechos reservados.
      </Typography>
    </Box>
  );
};

export default Footer;
