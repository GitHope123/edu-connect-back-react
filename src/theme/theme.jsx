import { createTheme } from '@mui/material/styles';
import '@fontsource/inter/300.css';
import '@fontsource/inter/400.css';
import '@fontsource/inter/500.css';
import '@fontsource/inter/600.css';
import '@fontsource/inter/700.css';

const theme = createTheme({
  typography: {
    fontFamily: `'Inter', 'Roboto', 'Helvetica', 'Arial', sans-serif`,
    h1: {
      fontWeight: 700,
      fontSize: '2.5rem',
      letterSpacing: '-0.5px',
      color: '#0A3D62'
    },
    h2: {
      fontWeight: 600,
      fontSize: '2rem',
      color: '#0A3D62'
    },
    h3: {
      fontWeight: 500,
      fontSize: '1.75rem',
      color: '#0A3D62'
    },
    button: {
      textTransform: 'none',
      fontWeight: 500,
      letterSpacing: '0.5px'
    },
    body1: {
      lineHeight: 1.6
    }
  },
  palette: {
    mode: 'light',
    primary: {
      main: '#0A4DA2',
      light: '#3D7BCC',
      dark: '#083875',
      contrastText: '#FFFFFF'
    },
    secondary: {
      main: '#2E7D32',
      light: '#4CAF50',
      dark: '#1B5E20',
      contrastText: '#FFFFFF'
    },
    background: {
      default: '#F8FAFC',
      paper: '#FFFFFF'
    },
    text: {
      primary: '#1E293B',
      secondary: '#475569',
      disabled: '#94A3B8'
    },
    success: {
      main: '#2E7D32',
      light: '#81C784',
      dark: '#1B5E20'
    },
    warning: {
      main: '#ED6C02',
      light: '#FFB74D',
      dark: '#E65100'
    },
    error: {
      main: '#D32F2F',
      light: '#E57373',
      dark: '#C62828'
    },
    info: {
      main: '#0288D1',
      light: '#4FC3F7',
      dark: '#01579B'
    },
    divider: '#E2E8F0',
    action: {
      hover: 'rgba(10, 77, 162, 0.08)',
      selected: 'rgba(10, 77, 162, 0.16)',
      disabledBackground: 'rgba(0, 0, 0, 0.12)'
    }
  },
  shape: {
    borderRadius: 8
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          background: '#F8FAFC',
          backgroundAttachment: 'fixed',
          minHeight: '100vh',
          margin: 0,
          padding: 0,
          '&::-webkit-scrollbar': {
            width: 8
          },
          '&::-webkit-scrollbar-thumb': {
            backgroundColor: '#94A3B8',
            borderRadius: 4
          }
        },
        html: {
          scrollBehavior: 'smooth'
        }
      }
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          background: '#FFFFFF',
          boxShadow: '0 2px 10px rgba(0, 0, 0, 0.05)',
          border: 'none', // Quitar borde blanco
          transition: 'box-shadow 0.3s ease, border 0.3s ease'
        },
        elevation1: {
          boxShadow: '0 2px 10px rgba(0, 0, 0, 0.05)'
        },
        elevation2: {
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
        }
      }
    },
    MuiButton: {
      styleOverrides: {
        root: {
          fontWeight: 500,
          padding: '10px 24px',
          borderRadius: 8,
          boxShadow: 'none',
          transition: 'all 0.3s ease',
          '&:hover': {
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
            transform: 'translateY(-1px)'
          },
          '&:active': {
            transform: 'translateY(0)'
          }
        },
        containedPrimary: {
          background: 'linear-gradient(135deg, #0A4DA2 0%, #3D7BCC 100%)',
          '&:hover': {
            background: 'linear-gradient(135deg, #083875 0%, #0A4DA2 100%)'
          }
        },
        containedSecondary: {
          background: 'linear-gradient(135deg, #2E7D32 0%, #4CAF50 100%)',
          '&:hover': {
            background: 'linear-gradient(135deg, #1B5E20 0%, #2E7D32 100%)'
          }
        },
        outlined: {
          borderWidth: 2,
          '&:hover': {
            borderWidth: 2,
            backgroundColor: 'rgba(10, 77, 162, 0.04)'
          }
        },
        text: {
          '&:hover': {
            backgroundColor: 'rgba(10, 77, 162, 0.08)'
          }
        },
        sizeLarge: {
          padding: '12px 28px',
          fontSize: '1rem'
        },
        sizeSmall: {
          padding: '6px 16px',
          fontSize: '0.875rem'
        }
      }
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          background: '#FFFFFF',
          boxShadow: '0 2px 10px rgba(0, 0, 0, 0.05)',
          borderBottom: 'none', // Sin borde
          color: '#1E293B'
        }
      }
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          background: '#0A3D62',
          color: '#FFFFFF',
          borderRight: 'none', // Sin borde
          width: 280
        }
      }
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          border: 'none' // Quitar borde blanco
        }
      }
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 8,
            '& fieldset': {
              borderColor: '#E2E8F0'
            },
            '&:hover fieldset': {
              borderColor: '#CBD5E0'
            },
            '&.Mui-focused fieldset': {
              borderColor: '#0A4DA2',
              boxShadow: '0 0 0 2px rgba(10, 77, 162, 0.2)'
            }
          },
          '& .MuiInputLabel-root': {
            color: '#64748B'
          },
          '& .MuiInputLabel-root.Mui-focused': {
            color: '#0A4DA2'
          }
        }
      }
    },
    MuiListItemButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          margin: '4px 8px',
          border: 'none', // Quitar borde blanco
          '&:hover': {
            backgroundColor: 'rgba(255, 255, 255, 0.1)'
          },
          '&.Mui-selected': {
            backgroundColor: 'rgba(255, 255, 255, 0.15)',
            '&:hover': {
              backgroundColor: 'rgba(255, 255, 255, 0.2)'
            }
          }
        }
      }
    },
    MuiDivider: {
      styleOverrides: {
        root: {
          borderColor: 'transparent' // Quitar línea blanca
        }
      }
    },
    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          backgroundColor: '#1E293B',
          fontSize: '0.875rem',
          padding: '8px 12px'
        },
        arrow: {
          color: '#1E293B'
        }
      }
    },
    MuiSwitch: {
      styleOverrides: {
        switchBase: {
          color: '#E2E8F0'
        },
        track: {
          backgroundColor: '#CBD5E0',
          opacity: 1
        }
      }
    }
  },
  transitions: {
    duration: {
      shortest: 150,
      shorter: 200,
      short: 250,
      standard: 300,
      complex: 375,
      enteringScreen: 225,
      leavingScreen: 195
    }
  }
});

export default theme;