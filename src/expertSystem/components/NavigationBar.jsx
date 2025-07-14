// src/expertSystem/components/NavigationBar.jsx
import React from 'react';
import {
    AppBar,
    Toolbar,
    Typography,
    Box,
    IconButton,
    Button,
    Container,
    LinearProgress,
    Chip,
    useTheme,
    useMediaQuery
} from '@mui/material';
import {
    Psychology,
    Home,
    Info,
    Assessment,
    Menu,
    Close,
    Logout
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext'; // Importar el hook de autenticación

const NavigationBar = ({ 
    currentStep, 
    totalSteps = 20, 
    onReset, 
    onHome,
    showProgress = false,
    mobileMenuOpen = false,
    onToggleMobileMenu
}) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const navigate = useNavigate();
    const { logout } = useAuth(); // Obtener la función logout del contexto
    
    const getProgressPercentage = () => {
        if (currentStep === -1) return 0;
        return ((currentStep + 1) / totalSteps) * 100;
    };

    const getProgressColor = () => {
        const progress = getProgressPercentage();
        if (progress < 25) return '#ff5252';
        if (progress < 50) return '#ff9800';
        if (progress < 75) return '#ffc107';
        return '#4caf50';
    };

    // Función para cerrar sesión completa
    const handleLogout = async () => {
        try {
            await logout(); // Llamar al método logout del contexto
            navigate('/login', { replace: true }); // Redirigir al login
        } catch (error) {
            console.error('Error al cerrar sesión:', error);
            // Aun si hay error, redirigir al login
            navigate('/login', { replace: true });
        }
    };

    return (
        <AppBar 
            position="fixed" 
            elevation={6}
            sx={{
                background: 'linear-gradient(135deg, #1565c0 0%, #1976d2 25%, #1e88e5 50%, #2196f3 75%, #42a5f5 100%)',
                backdropFilter: 'blur(20px)',
                borderBottom: '1px solid rgba(255,255,255,0.1)',
                color: '#ffffff',
                boxShadow: '0 4px 20px rgba(21, 101, 192, 0.3), 0 8px 40px rgba(21, 101, 192, 0.15)'
            }}
        >
            <Container maxWidth="xl">
                <Toolbar sx={{ py: 1 }}>
                    {/* Logo y título */}
                    <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
                        <Psychology 
                            sx={{ 
                                fontSize: { xs: 28, md: 36 }, 
                                mr: 2,
                                color: '#ffffff',
                                filter: 'drop-shadow(0 2px 4px rgba(0, 0, 0, 0.2))'
                            }} 
                        />
                        <Box>
                            <Typography
                                variant={isMobile ? "h6" : "h5"}
                                component="h1"
                                sx={{
                                    fontWeight: 'bold',
                                    color: '#ffffff',
                                    textShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
                                    letterSpacing: '-0.5px',
                                    lineHeight: 1.2
                                }}
                            >
                                {isMobile ? 'Diagnóstico Conductual' : 'Sistema Experto de Diagnóstico Conductual'}
                            </Typography>
                            {!isMobile && (
                                <Typography 
                                    variant="caption" 
                                    sx={{ 
                                        color: 'rgba(255, 255, 255, 0.9)',
                                        fontWeight: 500,
                                        fontSize: '0.75rem',
                                        textShadow: '0 1px 2px rgba(0, 0, 0, 0.1)'
                                    }}
                                >
                                    Análisis con Lógica Difusa
                                </Typography>
                            )}
                        </Box>
                    </Box>

                    {/* Progreso - Solo visible en desktop cuando hay progreso */}
                    {showProgress && currentStep >= 0 && !isMobile && (
                        <Box sx={{ display: 'flex', alignItems: 'center', mx: 4, minWidth: 200 }}>
                            <Typography variant="body2" sx={{ mr: 2, fontWeight: 'medium', color: 'rgba(255, 255, 255, 0.9)' }}>
                                Progreso:
                            </Typography>
                            <Box sx={{ flexGrow: 1, mr: 2 }}>
                                <LinearProgress
                                    variant="determinate"
                                    value={getProgressPercentage()}
                                    sx={{
                                        height: 8,
                                        borderRadius: 4,
                                        backgroundColor: 'rgba(255, 255, 255, 0.2)',
                                        '& .MuiLinearProgress-bar': {
                                            backgroundColor: getProgressColor(),
                                            borderRadius: 4,
                                            transition: 'all 0.3s ease',
                                            boxShadow: '0 0 8px rgba(255, 255, 255, 0.3)'
                                        }
                                    }}
                                />
                            </Box>
                            <Chip
                                label={`${currentStep + 1}/${totalSteps}`}
                                size="small"
                                sx={{
                                    backgroundColor: 'rgba(255, 255, 255, 0.2)',
                                    color: '#ffffff',
                                    fontWeight: 'bold',
                                    fontSize: '0.75rem',
                                    border: '1px solid rgba(255, 255, 255, 0.3)'
                                }}
                            />
                        </Box>
                    )}

                    {/* Acciones de navegación */}
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        {!isMobile ? (
                            <>
                                <Button
                                    startIcon={<Home />}
                                    onClick={onHome}
                                    sx={{
                                        color: '#ffffff',
                                        fontWeight: 'medium',
                                        borderRadius: 2,
                                        px: 3,
                                        border: '1px solid rgba(255, 255, 255, 0.2)',
                                        '&:hover': {
                                            backgroundColor: 'rgba(255, 255, 255, 0.1)',
                                            border: '1px solid rgba(255, 255, 255, 0.3)',
                                            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.2)'
                                        }
                                    }}
                                >
                                    Inicio
                                </Button>
                                <Button
                                    startIcon={<Assessment />}
                                    onClick={onReset}
                                    sx={{
                                        color: '#ffffff',
                                        fontWeight: 'medium',
                                        borderRadius: 2,
                                        px: 3,
                                        border: '1px solid rgba(255, 255, 255, 0.2)',
                                        '&:hover': {
                                            backgroundColor: 'rgba(255, 255, 255, 0.1)',
                                            border: '1px solid rgba(255, 255, 255, 0.3)',
                                            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.2)'
                                        }
                                    }}
                                >
                                    Nuevo Test
                                </Button>
                                <Button
                                    startIcon={<Logout />}
                                    onClick={handleLogout}
                                    sx={{
                                        color: '#ffffff',
                                        fontWeight: 'medium',
                                        borderRadius: 2,
                                        px: 3,
                                        border: '1px solid rgba(255, 107, 107, 0.5)',
                                        backgroundColor: 'rgba(244, 67, 54, 0.1)',
                                        '&:hover': {
                                            backgroundColor: 'rgba(244, 67, 54, 0.2)',
                                            border: '1px solid rgba(244, 67, 54, 0.7)',
                                            boxShadow: '0 2px 8px rgba(244, 67, 54, 0.3)'
                                        }
                                    }}
                                >
                                    Cerrar Sesión
                                </Button>
                            </>
                        ) : (
                            <IconButton
                                onClick={onToggleMobileMenu}
                                sx={{
                                    color: '#ffffff',
                                    border: '1px solid rgba(255, 255, 255, 0.2)',
                                    '&:hover': {
                                        backgroundColor: 'rgba(255, 255, 255, 0.1)',
                                        border: '1px solid rgba(255, 255, 255, 0.3)'
                                    }
                                }}
                            >
                                {mobileMenuOpen ? <Close /> : <Menu />}
                            </IconButton>
                        )}
                    </Box>
                </Toolbar>

                {/* Barra de progreso móvil */}
                {showProgress && currentStep >= 0 && isMobile && (
                    <Box sx={{ px: 2, pb: 2 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                            <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.9)', fontWeight: 'medium' }}>
                                Pregunta {currentStep + 1} de {totalSteps}
                            </Typography>
                            <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.9)', fontWeight: 'bold' }}>
                                {getProgressPercentage().toFixed(0)}%
                            </Typography>
                        </Box>
                        <LinearProgress
                            variant="determinate"
                            value={getProgressPercentage()}
                            sx={{
                                height: 6,
                                borderRadius: 3,
                                backgroundColor: 'rgba(255, 255, 255, 0.2)',
                                '& .MuiLinearProgress-bar': {
                                    backgroundColor: getProgressColor(),
                                    borderRadius: 3,
                                    transition: 'all 0.3s ease',
                                    boxShadow: '0 0 6px rgba(255, 255, 255, 0.3)'
                                }
                            }}
                        />
                    </Box>
                )}
            </Container>
        </AppBar>
    );
};

export default NavigationBar;