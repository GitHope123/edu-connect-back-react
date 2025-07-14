// src/expertSystem/components/WelcomeScreen.jsx
import React from 'react';
import {
    Box,
    Card,
    CardContent,
    Typography,
    Button,
    Paper,
    Grid,
    Chip,
    Container,
    Fade
} from '@mui/material';
import {
    Psychology,
    ArrowForward
} from '@mui/icons-material';

const WelcomeScreen = ({ onStart }) => {
    return (
        <Container maxWidth="lg">
            <Fade in={true} timeout={800}>
                <Card
                    elevation={3}
                    sx={{
                        borderRadius: 2,
                        backgroundColor: '#ffffff',
                        border: '1px solid #e0e0e0'
                    }}
                >
                    <CardContent sx={{ p: 6 }}>
                        <Box sx={{ textAlign: 'center', mb: 4 }}>
                            <Psychology
                                sx={{
                                    fontSize: 80,
                                    color: '#1976d2',
                                    mb: 3
                                }}
                            />
                            <Typography
                                variant="h3"
                                component="h1"
                                sx={{
                                    fontWeight: 600,
                                    color: '#1976d2',
                                    mb: 2
                                }}
                            >
                                Sistema Experto de Diagnóstico Conductual
                            </Typography>
                            <Typography 
                                variant="h6" 
                                color="text.secondary" 
                                sx={{ 
                                    mb: 4, 
                                    maxWidth: 700, 
                                    mx: 'auto',
                                    fontWeight: 400
                                }}
                            >
                                Este sistema utiliza lógica difusa para analizar patrones conductuales y proporcionar
                                un diagnóstico personalizado basado en tus respuestas.
                            </Typography>
                        </Box>

                        <Paper
                            elevation={1}
                            sx={{
                                p: 4,
                                borderRadius: 2,
                                backgroundColor: '#f8f9fa',
                                border: '1px solid #e9ecef',
                                mb: 4
                            }}
                        >
                            <Typography 
                                variant="h5" 
                                fontWeight={600} 
                                sx={{ mb: 3, color: '#333', textAlign: 'center' }}
                            >
                                Proceso de Evaluación
                            </Typography>
                            <Grid container spacing={4}>
                                <Grid item xs={12} md={4}>
                                    <Box sx={{ textAlign: 'center' }}>
                                        <Box
                                            sx={{
                                                width: 60,
                                                height: 60,
                                                borderRadius: '50%',
                                                backgroundColor: '#1976d2',
                                                color: 'white',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                fontSize: '1.5rem',
                                                fontWeight: 600,
                                                mb: 2,
                                                mx: 'auto'
                                            }}
                                        >
                                            1
                                        </Box>
                                        <Typography variant="h6" fontWeight={600} sx={{ mb: 1, color: '#333' }}>
                                            Cuestionario
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            Responde 20 preguntas sobre tu comportamiento
                                        </Typography>
                                    </Box>
                                </Grid>
                                <Grid item xs={12} md={4}>
                                    <Box sx={{ textAlign: 'center' }}>
                                        <Box
                                            sx={{
                                                width: 60,
                                                height: 60,
                                                borderRadius: '50%',
                                                backgroundColor: '#1976d2',
                                                color: 'white',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                fontSize: '1.5rem',
                                                fontWeight: 600,
                                                mb: 2,
                                                mx: 'auto'
                                            }}
                                        >
                                            2
                                        </Box>
                                        <Typography variant="h6" fontWeight={600} sx={{ mb: 1, color: '#333' }}>
                                            Análisis
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            El sistema procesa con lógica difusa
                                        </Typography>
                                    </Box>
                                </Grid>
                                <Grid item xs={12} md={4}>
                                    <Box sx={{ textAlign: 'center' }}>
                                        <Box
                                            sx={{
                                                width: 60,
                                                height: 60,
                                                borderRadius: '50%',
                                                backgroundColor: '#1976d2',
                                                color: 'white',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                fontSize: '1.5rem',
                                                fontWeight: 600,
                                                mb: 2,
                                                mx: 'auto'
                                            }}
                                        >
                                            3
                                        </Box>
                                        <Typography variant="h6" fontWeight={600} sx={{ mb: 1, color: '#333' }}>
                                            Resultados
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            Obtén un diagnóstico detallado
                                        </Typography>
                                    </Box>
                                </Grid>
                            </Grid>
                        </Paper>

                        <Box sx={{ textAlign: 'center' }}>
                            <Button
                                onClick={onStart}
                                variant="contained"
                                size="large"
                                startIcon={<ArrowForward />}
                                sx={{
                                    borderRadius: 1,
                                    px: 4,
                                    py: 1.5,
                                    fontWeight: 600,
                                    fontSize: '1rem',
                                    backgroundColor: '#1976d2',
                                    textTransform: 'none',
                                    '&:hover': {
                                        backgroundColor: '#1565c0'
                                    }
                                }}
                            >
                                Comenzar Evaluación
                            </Button>
                        </Box>
                    </CardContent>
                </Card>
            </Fade>
        </Container>
    );
};

export default WelcomeScreen;