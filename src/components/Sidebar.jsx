import React from "react";
import { Link as RouterLink, useLocation } from "react-router-dom";
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
} from "@mui/material";
import { FaUser, FaChalkboardTeacher, FaBook, FaHome } from "react-icons/fa";

const drawerWidth = 240;
// en el nombre del app añade el logo de EduConnect en la carpeta public/logo_login_pro.svg
const menuItems = [
  { label: "Dashboard", icon: <FaHome />, path: "/" },
  { label: "Estudiantes", icon: <FaUser />, path: "/estudiantes" },
  { label: "Profesores", icon: <FaChalkboardTeacher />, path: "/profesores" },
  { label: "Incidencias", icon: <FaBook />, path: "/incidencias" },
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
      }}
      PaperProps={{
        sx: {
          width: drawerWidth,
          boxSizing: "border-box",
          backgroundColor: `${theme.palette.primary.main} !important`,
          color: theme.palette.primary.contrastText,
          position: "fixed",
          height: "100vh",
        },
      }}
    >
      <Toolbar
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <img
          src="/logo_ec.svg"
          alt="EduConnect Logo"
          style={{ height: 70, marginTop:8, marginBottom: 8 }}
        />
        <Typography
          variant="h6"
          noWrap
          component="div"
          sx={{ fontWeight: "bold", textAlign: "center" }}
        >
          EduConnect
        </Typography>
      </Toolbar>
      <Divider sx={{ borderColor: "rgba(255,255,255,0.12)" }} />
      <List>
        {menuItems.map(({ label, icon, path }) => (
          <ListItemButton
            key={label}
            component={RouterLink}
            to={path}
            selected={location.pathname === path}
            sx={{
              "&.Mui-selected": {
                backgroundColor: theme.palette.primary.light,
                color: theme.palette.primary.main,
                "&:hover": {
                  backgroundColor: theme.palette.primary.dark,
                  color: theme.palette.common.white,
                },
              },
              borderRadius: 1,
              mb: 0.5,
              color: "inherit",
            }}
          >
            <ListItemIcon sx={{ color: "inherit" }}>{icon}</ListItemIcon>
            <ListItemText primary={label} />
          </ListItemButton>
        ))}
      </List>
    </Drawer>
  );
};

export default Sidebar;
