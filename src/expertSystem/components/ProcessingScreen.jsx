// src/expertSystem/components/ProcessingScreen.jsx
import React from 'react';
import {
    Box,
    Card,
    CardContent,
    Typography,
    CircularProgress,
    Container,
    Fade
} from '@mui/material';

const ProcessingScreen = () => {
    return (
        <Container maxWidth="sm">
            <Fade in={true} timeout={400}>
                <Card
                    elevation={3}
                    sx={{
                        borderRadius: 2,
                        backgroundColor: '#ffffff',
                        border: '1px solid #e0e0e0'
                    }}
                >
                    <CardContent sx={{ p: 6, textAlign: 'center' }}>
                        <Box sx={{ mb: 4 }}>
                            <CircularProgress
                                size={60}
                                thickness={4}
                                sx={{
                                    color: '#1976d2'
                                }}
                            />
                        </Box>
                        <Typography
                            variant="h5"
                            component="h2"
                            sx={{
                                fontWeight: 600,
                                color: '#333',
                                mb: 2
                            }}
                        >
                            Procesando Diagnóstico
                        </Typography>
                        <Typography variant="body1" color="text.secondary">
                            Analizando tus respuestas con el sistema de lógica difusa...
                        </Typography>
                    </CardContent>
                </Card>
            </Fade>
        </Container>
    );
};

export default ProcessingScreen;