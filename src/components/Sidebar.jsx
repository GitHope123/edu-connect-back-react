// src/components/Sidebar.jsx
import React from 'react';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import {
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
  Divider,
  useTheme,
} from '@mui/material';
import {
  FaUser,
  FaChalkboardTeacher,
  FaBook,
  FaHome,
} from 'react-icons/fa';

const drawerWidth = 240;

const menuItems = [
  { label: 'Dashboard', icon: <FaHome />, path: '/' },
  { label: 'Estudiantes', icon: <FaUser />, path: '/estudiantes' },
  { label: 'Profesores', icon: <FaChalkboardTeacher />, path: '/profesores' },
  { label: 'Incidencias', icon: <FaBook />, path: '/incidencias' },
];

const Sidebar = () => {
  const location = useLocation();
  const theme = useTheme();

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        zIndex: theme.zIndex.drawer + 1,
        [`& .MuiDrawer-paper`]: {
          width: drawerWidth,
          boxSizing: 'border-box',
          backgroundColor: theme.palette.primary.dark,
          color: theme.palette.common.white,
          position: 'fixed',
          height: '100vh',
        },
      }}
    >
      <Toolbar sx={{ justifyContent: 'center' }}>
        <Typography variant="h6" noWrap component="div" sx={{ fontWeight: 'bold' }}>
          EduConnect
        </Typography>
      </Toolbar>
      <Divider sx={{ borderColor: 'rgba(255,255,255,0.2)' }} />
      <List>
        {menuItems.map(({ label, icon, path }) => (
          <ListItemButton
            key={label}
            component={RouterLink}
            to={path}
            selected={location.pathname === path}
            sx={{
              '&.Mui-selected': {
                backgroundColor: theme.palette.primary.main,
                '&:hover': {
                  backgroundColor: theme.palette.primary.dark,
                },
              },
              color: 'inherit',
            }}
          >
            <ListItemIcon sx={{ color: 'inherit' }}>
              {icon}
            </ListItemIcon>
            <ListItemText primary={label} />
          </ListItemButton>
        ))}
      </List>
    </Drawer>
  );
};

export default Sidebar;
