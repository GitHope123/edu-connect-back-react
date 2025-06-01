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
      letterSpacing: '-0.5px'
    },
    h2: {
      fontWeight: 600,
      fontSize: '2rem'
    },
    h3: {
      fontWeight: 500,
      fontSize: '1.75rem'
    },
    button: {
      textTransform: 'none',
      fontWeight: 500
    }
  },
  palette: {
    mode: 'light',
    primary: {
      main: '#1a73e8',
      light: '#4285f4',
      dark: '#0d47a1',
      contrastText: '#ffffff'
    },
    secondary: {
      main: '#34a853',
      light: '#5cb85c',
      dark: '#1e8449',
      contrastText: '#ffffff'
    },
    background: {
      default: '#f5f7fa',
      paper: '#ffffff'
    },
    text: {
      primary: '#2d3748',
      secondary: '#4a5568'
    },
    success: {
      main: '#34a853'
    },
    warning: {
      main: '#fbbc05'
    },
    error: {
      main: '#ea4335'
    },
    info: {
      main: '#4285f4'
    }
  },
  shape: {
    borderRadius: 5 // Menor que antes (antes era 12)
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          background: '#f5f7fa',
          backgroundAttachment: 'fixed',
          backgroundRepeat: 'no-repeat',
          minHeight: '100vh'
        }
      }
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          background: '#ffffff !important',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
        },
        MuiDrawer: {
          styleOverrides: {
            paper: {
              background: '#1a73e8 !important', // O usa theme.palette.primary.main
              color: '#fff'
            }
          }
        }
      }
    },
    MuiButton: {
      styleOverrides: {
        root: {
          fontWeight: 500,
          padding: '8px 20px',
          borderRadius: '8px', // Menos redondeado
          boxShadow: 'none',
          '&:hover': {
            boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)'
          }
        },
        containedPrimary: {
          background: 'linear-gradient(135deg, #1a73e8 0%, #4285f4 100%)',
          '&:hover': {
            background: 'linear-gradient(135deg, #0d47a1 0%, #1a73e8 100%)'
          }
        },
        containedSecondary: {
          background: 'linear-gradient(135deg, #34a853 0%, #5cb85c 100%)',
          '&:hover': {
            background: 'linear-gradient(135deg, #1e8449 0%, #34a853 100%)'
          }
        },
        outlined: {
          borderWidth: '2px',
          '&:hover': {
            borderWidth: '2px'
          }
        }
      }
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          background: '#ffffff !important',
          boxShadow: '0 2px 10px rgba(0, 0, 0, 0.05)',
          borderBottom: '1px solid #e2e8f0'
        }
      }
    },
    MuiCard: {
      styleOverrides: {
        root: {
          transition: 'transform 0.3s, box-shadow 0.3s',
          borderRadius: '8px', // Menos redondeado
          '&:hover': {
            transform: 'translateY(-5px)',
            boxShadow: '0 10px 30px rgba(0, 0, 0, 0.15)'
          }
        }
      }
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: '8px', // Menos redondeado
            '& fieldset': {
              borderColor: '#e2e8f0'
            },
            '&:hover fieldset': {
              borderColor: '#cbd5e0'
            },
            '&.Mui-focused fieldset': {
              borderColor: '#1a73e8',
              boxShadow: '0 0 0 2px rgba(26, 115, 232, 0.2)'
            }
          }
        }
      }
    }
  }
});

export default theme;