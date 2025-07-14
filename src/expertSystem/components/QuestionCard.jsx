// src/expertSystem/components/QuestionCard.jsx - CORREGIDO
import React from 'react';
import {
    Card,
    CardContent,
    Typography,
    Button,
    Radio,
    RadioGroup,
    FormControlLabel,
    FormControl,
    Box,
    Chip,
    Paper,
    Container,
    Fade,
    Grow,
    useTheme,
    useMediaQuery,
    Grid
} from '@mui/material';
import {
    ArrowBack,
    ArrowForward,
    AutoAwesome,
    QuestionMark
} from '@mui/icons-material';
import { imagenesPreguntas } from '../data/imagenesPreguntas';

const QuestionCard = ({
    currentStep,
    totalSteps,
    preguntaActual,
    currentResponse,
    onResponse,
    onNext,
    onPrevious,
    isAnswered,
    opciones
}) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const isTablet = useMediaQuery(theme.breakpoints.down('lg'));

    // Validación temprana con mejor manejo de errores
    if (!preguntaActual) {
        console.warn('QuestionCard: preguntaActual es null o undefined');
        return (
            <Container maxWidth="md" sx={{ px: { xs: 1, md: 2 } }}>
                <Card elevation={4} sx={{ p: 2, textAlign: 'center' }}>
                    <Typography variant="h6" color="text.secondary">
                        Cargando pregunta...
                    </Typography>
                </Card>
            </Container>
        );
    }

    const { categoria, pregunta, key } = preguntaActual;

    // Validar que key existe
    if (!key) {
        console.error('QuestionCard: key es undefined en preguntaActual:', preguntaActual);
        return (
            <Container maxWidth="md" sx={{ px: { xs: 1, md: 2 } }}>
                <Card elevation={4} sx={{ p: 2, textAlign: 'center' }}>
                    <Typography variant="h6" color="error">
                        Error: Pregunta sin identificador
                    </Typography>
                </Card>
            </Container>
        );
    }

    // Validar opciones
    if (!opciones || !Array.isArray(opciones) || opciones.length === 0) {
        console.error('QuestionCard: opciones inválidas:', opciones);
        return (
            <Container maxWidth="md" sx={{ px: { xs: 1, md: 2 } }}>
                <Card elevation={4} sx={{ p: 2, textAlign: 'center' }}>
                    <Typography variant="h6" color="error">
                        No hay opciones disponibles para esta pregunta
                    </Typography>
                </Card>
            </Container>
        );
    }

    // Determinar si es la última pregunta
    const isLastQuestion = currentStep === totalSteps - 1;

    // Extraer el índice de la pregunta desde el key de forma segura
    const keyParts = key.split('_');
    const preguntaIndex = keyParts.length > 1 ? parseInt(keyParts[1]) : 0;

    // Obtener imágenes de la categoría actual con manejo seguro
    const imagenesCategoria = imagenesPreguntas?.[categoria] || 
        imagenesPreguntas?.[categoria?.toLowerCase()] || 
        imagenesPreguntas?.[categoria?.charAt(0).toUpperCase() + categoria?.slice(1).toLowerCase()] || 
        [];
    
    const imagenActual = imagenesCategoria[preguntaIndex] || null;

    const getCardPadding = () => (isMobile ? 2 : isTablet ? 3 : 4);
    const getButtonSize = () => (isMobile ? 'small' : 'medium');

    // Ordenar opciones por valor para mostrar en orden lógico
    const opcionesOrdenadas = [...opciones]
        .filter(opcion => opcion && typeof opcion.valor === 'number')
        .sort((a, b) => a.valor - b.valor);

    // Función para manejar la selección de respuesta - CORREGIDA
    const handleResponseChange = (valor) => {
        try {
            const numericValue = typeof valor === 'string' ? parseFloat(valor) : valor;
            
            if (isNaN(numericValue)) {
                console.error('Valor inválido para respuesta:', valor);
                return;
            }

            console.log(`✅ Respuesta seleccionada [${key}]:`, numericValue);
            
            if (typeof onResponse === 'function') {
                onResponse(key, numericValue);
            } else {
                console.error('onResponse no es una función:', typeof onResponse);
            }
        } catch (error) {
            console.error('Error en handleResponseChange:', error);
        }
    };

    // Función para manejar clics en las opciones - CORREGIDA
    const handleOptionClick = (valor) => {
        try {
            console.log(`🖱️ Clic en opción [${key}]:`, valor);
            handleResponseChange(valor);
        } catch (error) {
            console.error('Error en handleOptionClick:', error);
        }
    };

    return (
        <Container maxWidth="md" sx={{ px: { xs: 1, md: 2 } }}>
            <Fade in={true} timeout={400}>
                <Card
                    elevation={isMobile ? 4 : 8}
                    sx={{
                        borderRadius: { xs: 2, md: 3 },
                        background: 'rgba(255,255,255,0.95)',
                        backdropFilter: 'blur(10px)',
                        border: '1px solid rgba(255,255,255,0.2)',
                        boxShadow: isMobile
                            ? '0 4px 20px rgba(0,0,0,0.08)'
                            : '0 8px 32px rgba(0,0,0,0.12)'
                    }}
                >
                    <CardContent sx={{ p: getCardPadding() }}>
                        <Box sx={{
                            mb: { xs: 2, md: 3 },
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            flexDirection: { xs: 'column', sm: 'row' },
                            gap: { xs: 1, sm: 0 }
                        }}>
                            <Chip
                                icon={<QuestionMark />}
                                label={`${currentStep + 1}/${totalSteps}`}
                                color="primary"
                                variant="filled"
                                size={getButtonSize()}
                                sx={{
                                    background: 'linear-gradient(45deg, #1976d2 30%, #1565c0 90%)',
                                    color: 'white',
                                    fontWeight: 'bold',
                                    fontSize: { xs: '0.7rem', md: '0.8rem' },
                                    '& .MuiChip-icon': { color: 'white' }
                                }}
                            />
                            <Chip
                                label={categoria || 'Sin categoría'}
                                color="secondary"
                                variant="outlined"
                                size={getButtonSize()}
                                sx={{
                                    background: 'rgba(25, 118, 210, 0.05)',
                                    borderColor: 'rgba(25, 118, 210, 0.3)',
                                    color: '#1976d2',
                                    fontWeight: 'bold',
                                    fontSize: { xs: '0.7rem', md: '0.8rem' }
                                }}
                            />
                        </Box>

                        <Typography
                            variant={isMobile ? 'h6' : 'h5'}
                            component="h2"
                            sx={{
                                mb: { xs: 1.5, md: 2 },
                                fontWeight: 'bold',
                                background: 'linear-gradient(45deg, #1976d2 30%, #1565c0 90%)',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                                textAlign: { xs: 'center', md: 'left' }
                            }}
                        >
                            {pregunta || 'Pregunta no disponible'}
                        </Typography>

                        {/* Imagen de la categoría - MEJORADA */}
                        {imagenActual ? (
                            <Box sx={{
                                display: 'flex',
                                justifyContent: 'center',
                                mb: { xs: 2, md: 3 }
                            }}>
                                <img
                                    src={imagenActual}
                                    alt={`Imagen de ${categoria}`}
                                    style={{
                                        maxWidth: '100%',
                                        height: 'auto',
                                        maxHeight: isMobile ? '200px' : '300px',
                                        borderRadius: '8px',
                                        boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                                        objectFit: 'cover'
                                    }}
                                    onLoad={() => {
                                        console.log('✅ Imagen cargada exitosamente:', imagenActual);
                                    }}
                                    onError={(e) => {
                                        console.error('❌ Error cargando imagen:', imagenActual);
                                        e.target.style.display = 'none';
                                    }}
                                />
                            </Box>
                        ) : (
                            <Box sx={{
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                mb: { xs: 2, md: 3 },
                                p: 2,
                                backgroundColor: 'rgba(25, 118, 210, 0.05)',
                                borderRadius: '8px',
                                border: '1px dashed rgba(25, 118, 210, 0.3)'
                            }}>
                                <Typography variant="body2" color="text.secondary">
                                    📸 No hay imagen para "{categoria}" - pregunta {preguntaIndex + 1}
                                </Typography>
                            </Box>
                        )}

                        <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{
                                mb: { xs: 2, md: 3 },
                                textAlign: { xs: 'center', md: 'left' }
                            }}
                        >
                            Selecciona la opción que mejor describe tu comportamiento
                        </Typography>

                        <FormControl component="fieldset" sx={{ width: '100%' }}>
                            <RadioGroup
                                value={currentResponse !== undefined ? currentResponse.toString() : ''}
                                onChange={(e) => {
                                    const valor = parseFloat(e.target.value);
                                    handleResponseChange(valor);
                                }}
                                sx={{ gap: 1 }}
                            >
                                {/* Grid responsivo para opciones */}
                                <Grid container spacing={1}>
                                    {opcionesOrdenadas.map((opcion, index) => {
                                        const isSelected = currentResponse === opcion.valor;
                                        
                                        return (
                                            <Grid item xs={12} sm={6} md={3} key={`opcion-${opcion.valor}-${index}`}>
                                                <Grow in={true} timeout={200 + index * 50}>
                                                    <Paper
                                                        elevation={isSelected ? 6 : 2}
                                                        sx={{
                                                            p: { xs: 1.5, md: 2 },
                                                            height: '100%',
                                                            minHeight: { xs: 70, md: 80 },
                                                            borderRadius: { xs: 1.5, md: 2 },
                                                            background: isSelected
                                                                ? 'linear-gradient(45deg, rgba(25, 118, 210, 0.12) 30%, rgba(21, 101, 192, 0.08) 90%)'
                                                                : 'rgba(255, 255, 255, 0.9)',
                                                            border: isSelected
                                                                ? '2px solid #1976d2'
                                                                : '1px solid rgba(0, 0, 0, 0.08)',
                                                            cursor: 'pointer',
                                                            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                                            transform: isSelected ? 'scale(1.02)' : 'scale(1)',
                                                            '&:hover': {
                                                                transform: 'translateY(-2px) scale(1.02)',
                                                                boxShadow: '0 6px 20px rgba(0,0,0,0.15)',
                                                                borderColor: '#1976d2',
                                                                background: isSelected
                                                                    ? 'linear-gradient(45deg, rgba(25, 118, 210, 0.15) 30%, rgba(21, 101, 192, 0.1) 90%)'
                                                                    : 'rgba(25, 118, 210, 0.02)'
                                                            }
                                                        }}
                                                        onClick={() => handleOptionClick(opcion.valor)}
                                                    >
                                                        <FormControlLabel
                                                            value={opcion.valor.toString()}
                                                            control={
                                                                <Radio
                                                                    sx={{
                                                                        color: '#1976d2',
                                                                        '&.Mui-checked': {
                                                                            color: '#1976d2'
                                                                        },
                                                                        '& .MuiSvgIcon-root': {
                                                                            fontSize: { xs: 20, md: 24 }
                                                                        }
                                                                    }}
                                                                />
                                                            }
                                                            label={
                                                                <Typography
                                                                    variant="body2"
                                                                    fontWeight={isSelected ? 'bold' : 'medium'}
                                                                    sx={{
                                                                        color: isSelected ? '#1976d2' : 'text.primary',
                                                                        fontSize: { xs: '0.8rem', md: '0.875rem' },
                                                                        lineHeight: 1.3
                                                                    }}
                                                                >
                                                                    {opcion.texto || 'Opción no disponible'}
                                                                </Typography>
                                                            }
                                                            sx={{
                                                                m: 0,
                                                                width: '100%',
                                                                display: 'flex',
                                                                alignItems: 'center',
                                                                gap: 1
                                                            }}
                                                        />
                                                    </Paper>
                                                </Grow>
                                            </Grid>
                                        );
                                    })}
                                </Grid>
                            </RadioGroup>
                        </FormControl>

                        <Box sx={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            mt: { xs: 3, md: 4 },
                            flexDirection: { xs: 'column', sm: 'row' },
                            gap: { xs: 2, sm: 0 }
                        }}>
                            <Button
                                onClick={onPrevious}
                                disabled={currentStep === 0}
                                variant="outlined"
                                startIcon={<ArrowBack />}
                                size={getButtonSize()}
                                sx={{
                                    borderRadius: { xs: 1.5, md: 2 },
                                    px: { xs: 2, md: 3 },
                                    py: { xs: 0.8, md: 1 },
                                    fontWeight: 'bold',
                                    background: currentStep === 0 ? 'none' : 'rgba(255, 255, 255, 0.8)',
                                    backdropFilter: 'blur(8px)',
                                    borderColor: '#1976d2',
                                    color: '#1976d2'
                                }}
                            >
                                Anterior
                            </Button>

                            <Button
                                onClick={onNext}
                                disabled={!isAnswered}
                                variant="contained"
                                endIcon={isLastQuestion ? <AutoAwesome /> : <ArrowForward />}
                                size={getButtonSize()}
                                sx={{
                                    borderRadius: { xs: 1.5, md: 2 },
                                    px: { xs: 2, md: 3 },
                                    py: { xs: 0.8, md: 1 },
                                    fontWeight: 'bold',
                                    background: isLastQuestion
                                        ? 'linear-gradient(45deg, #4caf50 30%, #66bb6a 90%)'
                                        : 'linear-gradient(45deg, #1976d2 30%, #1565c0 90%)'
                                }}
                            >
                                {isLastQuestion ? 'Finalizar' : 'Siguiente'}
                            </Button>
                        </Box>
                    </CardContent>
                </Card>
            </Fade>
        </Container>
    );
};

export default QuestionCard;