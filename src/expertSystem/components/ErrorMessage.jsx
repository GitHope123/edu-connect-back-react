// src/expertSystem/components/ErrorMessage.jsx
import React from 'react';
import {
    Container,
    Alert,
    AlertTitle,
    Slide
} from '@mui/material';
import { Error } from '@mui/icons-material';

const ErrorMessage = ({ error }) => {
    return (
        <Container maxWidth="sm" sx={{ mb: 4 }}>
            <Slide direction="down" in={true} timeout={400}>
                <Alert
                    severity="error"
                    icon={<Error />}
                    sx={{
                        borderRadius: 2,
                        backgroundColor: '#ffebee',
                        border: '1px solid #f44336',
                        color: '#c62828'
                    }}
                >
                    <AlertTitle sx={{ fontWeight: 600 }}>
                        Error en el diagnóstico
                    </AlertTitle>
                    {error}
                </Alert>
            </Slide>
        </Container>
    );
};

export default ErrorMessage;