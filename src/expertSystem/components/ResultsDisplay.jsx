// src/expertSystem/components/ResultsDisplay.jsx
import React from 'react';
import {
    Box,
    Card,
    CardContent,
    Typography,
    Button,
    Grid,
    Chip,
    Paper,
    Container,
    Fade,
    Grow,
    useTheme,
    useMediaQuery
} from '@mui/material';
import {
    CheckCircle,
    Psychology,
    Schedule,
    AutoAwesome,
    GpsFixed
} from '@mui/icons-material';

const ResultsDisplay = ({ results, onReset }) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));

    // Obtener factores dominantes del resultado
    const dominantFactors = results.dominantFactors || [];
    
    // Si no hay factores dominantes, generarlos desde los datos de entrada
    let factorsToShow = dominantFactors;
    
    if (factorsToShow.length === 0 && results.debugInfo?.validatedInputs) {
        const inputs = results.debugInfo.validatedInputs;
        const getLevel = (value) => {
            if (value <= 2.1) return 'Bajo';
            if (value <= 4.3) return 'Medio';
            return 'Alto';
        };

        factorsToShow = [
            { factor: 'Minuciosidad', value: inputs.minuciosidad || 0, level: getLevel(inputs.minuciosidad || 0) },
            { factor: 'Emocionalidad', value: inputs.emocionalidad || 0, level: getLevel(inputs.emocionalidad || 0) },
            { factor: 'Agresividad', value: inputs.agresividad || 0, level: getLevel(inputs.agresividad || 0) },
            { factor: 'Dependiente', value: inputs.dependiente || 0, level: getLevel(inputs.dependiente || 0) },
            { factor: 'Temerosidad', value: inputs.temerosidad || 0, level: getLevel(inputs.temerosidad || 0) }
        ].sort((a, b) => b.value - a.value);
    }

    return (
        <Container maxWidth="lg">
            <Fade in={true} timeout={800}>
                <Card
                    elevation={24}
                    sx={{
                        borderRadius: { xs: 3, md: 6 },
                        background: 'linear-gradient(145deg, rgba(255,255,255,0.95) 0%, rgba(248,250,252,0.95) 100%)',
                        backdropFilter: 'blur(20px)',
                        border: '1px solid rgba(255,255,255,0.2)'
                    }}
                >
                    <CardContent sx={{ p: { xs: 3, md: 6 } }}>
                        {/* Header */}
                        <Box sx={{ textAlign: 'center', mb: { xs: 4, md: 6 } }}>
                            <CheckCircle
                                sx={{
                                    fontSize: { xs: 60, md: 80 },
                                    color: '#4caf50',
                                    mb: 2,
                                    filter: 'drop-shadow(0 4px 8px rgba(76, 175, 80, 0.3))'
                                }}
                            />
                            <Typography
                                variant={isMobile ? "h3" : "h2"}
                                component="h1"
                                sx={{
                                    fontWeight: 'bold',
                                    background: 'linear-gradient(45deg, #1976d2 30%, #9c27b0 90%)',
                                    WebkitBackgroundClip: 'text',
                                    WebkitTextFillColor: 'transparent',
                                    mb: 2
                                }}
                            >
                                Resultados del Diagnóstico
                            </Typography>
                            <Typography variant="h6" color="text.secondary">
                                Análisis completo de tu perfil conductual
                            </Typography>
                        </Box>

                        {/* Diagnóstico Principal */}
                        <Paper
                            elevation={8}
                            sx={{
                                p: { xs: 3, md: 4 },
                                borderRadius: 4,
                                background: 'linear-gradient(135deg, rgba(33, 150, 243, 0.1) 0%, rgba(63, 81, 181, 0.1) 100%)',
                                border: '1px solid rgba(33, 150, 243, 0.2)',
                                mb: { xs: 4, md: 6 }
                            }}
                        >
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                                <GpsFixed sx={{ fontSize: 32, color: '#2196F3', mr: 2 }} />
                                <Typography variant="h5" fontWeight="bold" color="#1976d2">
                                    Diagnóstico Principal
                                </Typography>
                            </Box>
                            <Typography 
                                variant={isMobile ? "h4" : "h3"}
                                fontWeight="bold" 
                                color="#0d47a1" 
                                sx={{ mb: 2, textAlign: 'center' }}
                            >
                                {results.diagnosis}
                            </Typography>
                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#1976d2' }}>
                                <Schedule sx={{ fontSize: 18, mr: 1 }} />
                                <Typography variant="body2">
                                    {new Date().toLocaleString()}
                                </Typography>
                            </Box>
                        </Paper>

                        {/* Factores Dominantes */}
                        {factorsToShow.length > 0 && (
                            <Paper
                                elevation={8}
                                sx={{
                                    p: { xs: 3, md: 4 },
                                    borderRadius: 4,
                                    background: 'linear-gradient(135deg, rgba(255, 152, 0, 0.1) 0%, rgba(255, 193, 7, 0.1) 100%)',
                                    border: '1px solid rgba(255, 152, 0, 0.2)',
                                    mb: { xs: 4, md: 6 }
                                }}
                            >
                                <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
                                    <AutoAwesome sx={{ fontSize: 32, color: '#ff9800', mr: 2 }} />
                                    <Typography variant="h5" fontWeight="bold" color="#e65100">
                                        Factores Dominantes
                                    </Typography>
                                </Box>
                                <Grid container spacing={3}>
                                    {factorsToShow.map((factor, index) => (
                                        <Grid item xs={12} sm={6} md={4} lg={2.4} key={index}>
                                            <Grow in={true} timeout={300 + index * 100}>
                                                <Paper
                                                    elevation={6}
                                                    sx={{
                                                        p: 3,
                                                        borderRadius: 3,
                                                        textAlign: 'center',
                                                        transition: 'all 0.3s ease',
                                                        '&:hover': {
                                                            transform: 'translateY(-4px)',
                                                            boxShadow: '0 8px 25px rgba(0,0,0,0.15)'
                                                        }
                                                    }}
                                                >
                                                    <Typography variant="h6" fontWeight="bold" sx={{ mb: 1 }}>
                                                        {factor.factor}
                                                    </Typography>
                                                    <Typography variant="h4" fontWeight="bold" color="#ff9800" sx={{ mb: 1 }}>
                                                        {factor.value.toFixed(1)}
                                                    </Typography>
                                                    <Chip
                                                        label={factor.level}
                                                        size="small"
                                                        sx={{
                                                            backgroundColor: factor.level === 'Alto' ? 'rgba(244, 67, 54, 0.1)' : 
                                                                            factor.level === 'Medio' ? 'rgba(255, 152, 0, 0.1)' : 
                                                                            'rgba(76, 175, 80, 0.1)',
                                                            color: factor.level === 'Alto' ? '#d32f2f' : 
                                                                   factor.level === 'Medio' ? '#e65100' : 
                                                                   '#388e3c',
                                                            fontWeight: 'bold'
                                                        }}
                                                    />
                                                </Paper>
                                            </Grow>
                                        </Grid>
                                    ))}
                                </Grid>
                            </Paper>
                        )}

                        {/* Reset Button */}
                        <Box sx={{ textAlign: 'center' }}>
                            <Button
                                onClick={onReset}
                                variant="contained"
                                size="large"
                                startIcon={<Psychology />}
                                sx={{
                                    borderRadius: 3,
                                    px: { xs: 4, md: 6 },
                                    py: 2,
                                    fontWeight: 'bold',
                                    fontSize: { xs: '1rem', md: '1.1rem' },
                                    background: 'linear-gradient(45deg, #2196F3 30%, #9c27b0 90%)',
                                    boxShadow: '0 8px 25px rgba(0,0,0,0.15)',
                                    '&:hover': {
                                        transform: 'translateY(-2px)',
                                        boxShadow: '0 12px 30px rgba(0,0,0,0.2)'
                                    }
                                }}
                            >
                                Realizar Nuevo Diagnóstico
                            </Button>
                        </Box>
                    </CardContent>
                </Card>
            </Fade>
        </Container>
    );
};

export default ResultsDisplay;