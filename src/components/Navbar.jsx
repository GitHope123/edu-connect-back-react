// src/components/Navbar.jsx
import React from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  IconButton,
  Menu,
  MenuItem,
  Box,
  Button,
  useTheme,
  useMediaQuery,
  ListItemIcon,
  Typography,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PersonIcon from '@mui/icons-material/Person';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';

import { getAuth, signOut } from 'firebase/auth';

const Navbar = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();

  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    const auth = getAuth();
    await signOut(auth);
    navigate('/login');
  };

  const menuItems = [
    {
      label: 'Dashboard',
      path: '/',
      icon: <DashboardIcon fontSize="small" />,
    },
    {
      label: 'Perfil',
      path: '/perfil',
      icon: <PersonIcon fontSize="small" />,
    },
    {
      label: 'Cerrar Sesión',
      path: '/logout',
      icon: <ExitToAppIcon fontSize="small" />,
      onClick: handleLogout,
    },
  ];

  return (
    <AppBar
      position="static"
      sx={{
        mb: 4,
        background: `${theme.palette.primary.main} !important`,
        color: theme.palette.primary.contrastText,
        boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
        backdropFilter: 'blur(10px)',
        backgroundColor: 'rgba(0, 82, 147, 0.9)', // Fondo glass
      }}
    >
      <Toolbar>
        {isMobile ? (
          <>
            <IconButton
              edge="end"
              sx={{ color: theme.palette.primary.contrastText }}
              aria-label="menu"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleMenuOpen}
              size="large"
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
              PaperProps={{
                sx: {
                  mt: 1.5,
                  borderRadius: 2,
                  backdropFilter: 'blur(12px)',
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  boxShadow: '0 4px 30px rgba(0,0,0,0.1)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  minWidth: 180,
                },
              }}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'right',
              }}
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
            >
              {menuItems.map((item, index) => (
                <MenuItem
                  key={index}
                  component={RouterLink}
                  to={item.path}
                  onClick={() => {
                    handleMenuClose();
                    if (item.onClick) item.onClick();
                  }}
                  sx={{
                    color: '#fff',
                    '&:hover': {
                      backgroundColor: 'rgba(255, 255, 255, 0.2)',
                    },
                  }}
                >
                  <ListItemIcon sx={{ color: 'inherit' }}>
                    {item.icon}
                  </ListItemIcon>
                  <Typography variant="inherit">{item.label}</Typography>
                </MenuItem>
              ))}
            </Menu>
          </>
        ) : (
          <Box sx={{ flexGrow: 1, display: 'flex', justifyContent: 'flex-end' }}>
            {menuItems.map((item, index) => (
              <Button
                key={index}
                component={RouterLink}
                to={item.path}
                onClick={item.onClick}
                startIcon={item.icon}
                sx={{
                  textTransform: 'none',
                  ml: 2,
                  color: theme.palette.primary.contrastText,
                  fontWeight: 500,
                  '&:hover': {
                    backgroundColor: 'rgba(255, 255, 255, 0.2)',
                    borderRadius: 2,
                  },
                }}
              >
                {item.label}
              </Button>
            ))}
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;