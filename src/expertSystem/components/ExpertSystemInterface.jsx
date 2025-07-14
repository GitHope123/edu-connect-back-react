// src/expertSystem/components/ExpertSystemInterface.jsx
import React, { useState, useCallback, useMemo } from 'react';
import {
    Box,
    Container,
    useTheme,
    useMediaQuery,
    Drawer,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Divider,
    IconButton,
    Typography,
    Paper,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button
} from '@mui/material';
import {
    Home,
    Assessment,
    Info,
    Close,
    Logout
} from '@mui/icons-material';

import { useNavigate } from 'react-router-dom';
import { getAuth, signOut } from 'firebase/auth';

import NavigationBar from './NavigationBar';
import WelcomeScreen from './WelcomeScreen';
import QuestionCard from './QuestionCard';
import ProcessingScreen from './ProcessingScreen';
import ResultsDisplay from './ResultsDisplay';
import ErrorMessage from './ErrorMessage';

import { FuzzyLogicEngine } from '../engine/FuzzyLogicEngine.js';
import { cuestionario, fuzzyRules } from '../data/rules.js';

const ExpertSystemInterface = () => {
    const [currentStep, setCurrentStep] = useState(-1);
    const [responses, setResponses] = useState({});
    const [results, setResults] = useState(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [error, setError] = useState(null);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [logoutDialogOpen, setLogoutDialogOpen] = useState(false);
    const [isLoggingOut, setIsLoggingOut] = useState(false);

    const navigate = useNavigate();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const fuzzyEngine = new FuzzyLogicEngine();

    // Crear un array plano de preguntas
    const preguntasPlanas = useMemo(() => {
        if (!cuestionario || !cuestionario.categorias) {
            console.error('❌ Cuestionario no encontrado o estructura incorrecta');
            return [];
        }

        const preguntas = [];
        
        cuestionario.categorias.forEach((categoria, categoriaIndex) => {
            console.log(`📋 Procesando categoría: ${categoria.name} con ${categoria.preguntas.length} preguntas`);
            
            categoria.preguntas.forEach((pregunta, preguntaIndex) => {
                const key = `${categoria.name}_${preguntaIndex}`;
                preguntas.push({
                    categoria: categoria.name,
                    pregunta,
                    key
                });
                console.log(`  ✅ Pregunta agregada: ${key}`);
            });
        });

        console.log(`📊 Total de preguntas creadas: ${preguntas.length}`);
        return preguntas;
    }, []);

    const totalPreguntas = preguntasPlanas.length;

    // Procesamiento de resultados (mover arriba para evitar ReferenceError)
    const processResults = async () => {
        setIsProcessing(true);
        setError(null);

        try {
            await new Promise(resolve => setTimeout(resolve, 1500));

            console.log('🔄 Iniciando procesamiento de resultados...');
            console.log('📋 Respuestas recibidas:', responses);
            console.log('📊 Total de respuestas:', Object.keys(responses).length);

            // Verificar que tenemos todas las respuestas esperadas
            const expectedResponses = totalPreguntas;
            const actualResponses = Object.keys(responses).length;
            
            if (actualResponses !== expectedResponses) {
                console.warn(`⚠️ Se esperaban ${expectedResponses} respuestas pero se recibieron ${actualResponses}`);
                
                // Identificar qué respuestas faltan
                const expectedKeys = preguntasPlanas.map(p => p.key);
                const actualKeys = Object.keys(responses);
                const missingKeys = expectedKeys.filter(key => !actualKeys.includes(key));
                
                console.warn('❌ Respuestas faltantes:', missingKeys);
                
                // Identificar respuestas faltantes por categoría
                const categoryMissing = {};
                cuestionario.categorias.forEach(categoria => {
                    const categoryKeys = expectedKeys.filter(key => key.startsWith(categoria.name + '_'));
                    const categoryActual = actualKeys.filter(key => key.startsWith(categoria.name + '_'));
                    const categoryMissingKeys = categoryKeys.filter(key => !categoryActual.includes(key));
                    
                    if (categoryMissingKeys.length > 0) {
                        categoryMissing[categoria.name] = {
                            expected: categoryKeys.length,
                            actual: categoryActual.length,
                            missing: categoryMissingKeys
                        };
                    }
                });
                
                console.warn('📊 Análisis por categoría:', categoryMissing);
                
                // Mostrar error específico por categoría
                if (Object.keys(categoryMissing).length > 0) {
                    const errorDetails = Object.entries(categoryMissing)
                        .map(([cat, info]) => `${cat}: faltan ${info.missing.length} respuestas`)
                        .join(', ');
                    throw new Error(`Test incompleto. ${errorDetails}`);
                }
            }

            // Definir todas las categorías que esperamos
            const expectedCategories = ['minuciosidad', 'emocionalidad', 'agresividad', 'dependiente', 'temerosidad'];
            
            // Inicializar contadores para cada categoría
            const categoryScores = {};
            const categoryCounts = {};
            
            expectedCategories.forEach(category => {
                categoryScores[category] = 0;
                categoryCounts[category] = 0;
            });

            // Procesar cada respuesta
            Object.entries(responses).forEach(([responseKey, value]) => {
                console.log(`🔄 Procesando respuesta: ${responseKey} = ${value}`);
                
                // Extraer el nombre de la categoría del key
                const parts = responseKey.split('_');
                if (parts.length >= 2) {
                    const categoryName = parts[0].toLowerCase().trim();
                    console.log(`📂 Categoría extraída: "${categoryName}"`);
                    
                    // Verificar que la categoría existe en nuestras categorías esperadas
                    if (expectedCategories.includes(categoryName)) {
                        const numericValue = parseFloat(value) || 0;
                        categoryScores[categoryName] += numericValue;
                        categoryCounts[categoryName] += 1;
                        console.log(`✅ Sumando ${numericValue} a ${categoryName}. Total: ${categoryScores[categoryName]}, Count: ${categoryCounts[categoryName]}`);
                    } else {
                        console.error(`❌ Categoría no reconocida: "${categoryName}"`);
                        console.log('🔍 Categorías esperadas:', expectedCategories);
                        console.log('🔍 Key original:', responseKey);
                    }
                } else {
                    console.error(`❌ Formato de key inválido: ${responseKey}`);
                }
            });

            // Normalizar los puntajes de cada categoría (promedio)
            expectedCategories.forEach(category => {
                if (categoryCounts[category] > 0) {
                    categoryScores[category] = categoryScores[category] / categoryCounts[category];
                }
            });

            // Verificar que todas las categorías tienen el número correcto de respuestas
            const questionsPerCategory = cuestionario.categorias.reduce((acc, cat) => {
                acc[cat.name.toLowerCase()] = cat.preguntas.length;
                return acc;
            }, {});

            console.log('📊 Preguntas por categoría esperadas:', questionsPerCategory);
            console.log('📊 Respuestas por categoría obtenidas:', categoryCounts);

            // Validar que cada categoría tenga todas sus respuestas
            let hasIncompleteCategories = false;
            expectedCategories.forEach(category => {
                const expected = questionsPerCategory[category] || 0;
                const actual = categoryCounts[category] || 0;
                
                if (actual !== expected) {
                    console.error(`❌ Categoría "${category}": se esperaban ${expected} respuestas, se obtuvieron ${actual}`);
                    hasIncompleteCategories = true;
                }
            });

            if (hasIncompleteCategories) {
                throw new Error('Test incompleto: algunas categorías no tienen todas las respuestas necesarias');
            }

            // Log final de puntuaciones
            console.log('📈 Puntuaciones TOTALES finales por categoría:');
            expectedCategories.forEach(category => {
                console.log(`  ${category}: ${categoryScores[category]} (${categoryCounts[category]} respuestas)`);
            });

            // Diagnóstico usando las reglas difusas
            console.log('🧠 Ejecutando diagnóstico con motor difuso...');
            const diagnosis = fuzzyEngine.diagnose(categoryScores, fuzzyRules);
            console.log('📋 Diagnóstico completado:', diagnosis);

            // Preparar resultados finales
            const finalResults = {
                ...diagnosis,
                categoryScores,
                totalResponses: actualResponses,
                responseCount: actualResponses,
                categoryCounts,
                questionsPerCategory,
                debugInfo: {
                    expectedResponses,
                    actualResponses,
                    hasIncompleteCategories: false,
                    totalValidResponses: actualResponses
                }
            };

            console.log('✅ Resultados finales preparados:', finalResults);
            setResults(finalResults);

        } catch (err) {
            console.error('❌ Error procesando resultados:', err);
            setError(err.message || 'Error al procesar los resultados');
        } finally {
            setIsProcessing(false);
        }
    };

    // Autenticación
    const handleLogout = async () => {
        setIsLoggingOut(true);
        try {
            const auth = getAuth();
            await signOut(auth);
            resetSystem();
            navigate('/login', { replace: true });
        } catch (error) {
            console.error('Error al cerrar sesión:', error);
            setError('Error al cerrar sesión. Inténtalo de nuevo.');
        } finally {
            setIsLoggingOut(false);
            setLogoutDialogOpen(false);
        }
    };

    // Manejo de respuestas - CORREGIDO para evitar duplicados
    const handleResponse = useCallback((responseKey, value) => {
        console.log(`📝 Guardando respuesta: ${responseKey} = ${value}`);
        
        setResponses(prev => {
            // Si ya existe esta respuesta con el mismo valor, no actualizar
            if (prev[responseKey] === value) {
                console.log(`⚠️ Respuesta duplicada detectada para ${responseKey}, ignorando`);
                return prev;
            }
            
            const updated = { ...prev, [responseKey]: value };
            console.log(`📊 Total respuestas guardadas: ${Object.keys(updated).length}`);
            console.log(`📋 Respuestas actuales:`, Object.keys(updated));
            return updated;
        });
        
        setError(null);
    }, []);

    // Nueva función para finalizar el test correctamente
    const handleFinishStep = useCallback((responseKey, value) => {
        // Guardar la última respuesta si no está guardada
        setResponses(prev => {
            if (prev[responseKey] === value) {
                // Ya está guardada, procesar resultados directamente
                processResults();
                return prev;
            }
            const updated = { ...prev, [responseKey]: value };
            // Procesar resultados después de guardar
            setTimeout(() => processResults(), 0); // Espera a que el estado se actualice
            return updated;
        });
        setError(null);
    }, [processResults]);

    // Navegación
    const nextStep = useCallback(() => {
        console.log(`🔄 Navegando desde paso ${currentStep} de ${totalPreguntas}`);
        
        if (currentStep < totalPreguntas - 1) {
            const nextStepValue = currentStep + 1;
            console.log(`➡️ Avanzando al paso ${nextStepValue}`);
            setCurrentStep(nextStepValue);
        } else {
            console.log('🏁 Última pregunta completada, procesando resultados...');
            processResults();
        }
    }, [currentStep, totalPreguntas]);

    const prevStep = useCallback(() => {
        if (currentStep > 0) {
            const prevStepValue = currentStep - 1;
            console.log(`⬅️ Retrocediendo al paso ${prevStepValue}`);
            setCurrentStep(prevStepValue);
        }
    }, [currentStep]);

    // Utilidades
    const resetSystem = () => {
        console.log('🔄 Reiniciando sistema...');
        setCurrentStep(-1);
        setResponses({});
        setResults(null);
        setError(null);
        setMobileMenuOpen(false);
    };

    const startDiagnosis = () => {
        console.log('🚀 Iniciando diagnóstico...');
        console.log(`📊 Total de preguntas a responder: ${totalPreguntas}`);
        setCurrentStep(0);
        setError(null);
    };

    const getCurrentResponse = () => {
        if (currentStep < 0 || currentStep >= preguntasPlanas.length) return undefined;
        const preguntaActual = preguntasPlanas[currentStep];
        return responses[preguntaActual.key];
    };

    const isCurrentQuestionAnswered = () => {
        return getCurrentResponse() !== undefined;
    };

    const getCompletionPercentage = () => {
        if (currentStep < 0) return 0;
        return ((currentStep + 1) / totalPreguntas) * 100;
    };

    // Componentes
    const LogoutConfirmDialog = () => (
        <Dialog
            open={logoutDialogOpen}
            onClose={() => setLogoutDialogOpen(false)}
            maxWidth="xs"
            fullWidth
        >
            <DialogTitle sx={{ textAlign: 'center', color: '#1976d2', fontWeight: 600 }}>
                Cerrar Sesión
            </DialogTitle>
            <DialogContent sx={{ textAlign: 'center', py: 2 }}>
                <Typography variant="body1" sx={{ mb: 2 }}>
                    ¿Estás seguro de que deseas cerrar sesión?
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    Si tienes un test en progreso, se perderá tu avance.
                </Typography>
            </DialogContent>
            <DialogActions sx={{ justifyContent: 'center', gap: 2, pb: 3 }}>
                <Button
                    onClick={() => setLogoutDialogOpen(false)}
                    variant="outlined"
                    sx={{ minWidth: 100 }}
                >
                    Cancelar
                </Button>
                <Button
                    onClick={handleLogout}
                    variant="contained"
                    disabled={isLoggingOut}
                    sx={{
                        minWidth: 100,
                        backgroundColor: '#d32f2f',
                        '&:hover': { backgroundColor: '#c62828' }
                    }}
                >
                    {isLoggingOut ? 'Cerrando...' : 'Cerrar Sesión'}
                </Button>
            </DialogActions>
        </Dialog>
    );

    const MobileMenu = () => (
        <Drawer
            anchor="right"
            open={mobileMenuOpen}
            onClose={() => setMobileMenuOpen(false)}
            PaperProps={{ sx: { width: 280 } }}
        >
            <Box sx={{ p: 2, borderBottom: '1px solid #e0e0e0' }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="h6" fontWeight={600} color="#1976d2">
                        Menú
                    </Typography>
                    <IconButton onClick={() => setMobileMenuOpen(false)}>
                        <Close />
                    </IconButton>
                </Box>
            </Box>
            <List>
                <ListItem button onClick={resetSystem}>
                    <ListItemIcon><Home sx={{ color: '#1976d2' }} /></ListItemIcon>
                    <ListItemText primary="Inicio" />
                </ListItem>
                <ListItem button onClick={resetSystem}>
                    <ListItemIcon><Assessment sx={{ color: '#1976d2' }} /></ListItemIcon>
                    <ListItemText primary="Nuevo Test" />
                </ListItem>
                <Divider sx={{ my: 1 }} />
                <ListItem button>
                    <ListItemIcon><Info sx={{ color: '#666' }} /></ListItemIcon>
                    <ListItemText primary="Información" />
                </ListItem>
                <Divider sx={{ my: 1 }} />
                <ListItem button onClick={() => setLogoutDialogOpen(true)}>
                    <ListItemIcon><Logout sx={{ color: '#d32f2f' }} /></ListItemIcon>
                    <ListItemText primary="Cerrar Sesión" />
                </ListItem>
            </List>

            {/* Progreso en el menú móvil */}
            {currentStep >= 0 && (
                <Box sx={{ p: 2, mt: 'auto' }}>
                    <Paper elevation={2} sx={{ p: 2, borderRadius: 2 }}>
                        <Typography variant="body2" fontWeight={600} sx={{ mb: 1 }}>
                            Progreso del Test
                        </Typography>
                        <Typography variant="h6" color="#1976d2" fontWeight={600}>
                            {Math.round(getCompletionPercentage())}% completado
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                            Pregunta {currentStep + 1} de {totalPreguntas}
                        </Typography>
                    </Paper>
                </Box>
            )}
        </Drawer>
    );

    // Determinar componente actual
    const getCurrentComponent = () => {
        if (error) {
            return <ErrorMessage error={error} onRetry={resetSystem} />;
        }

        if (isProcessing) {
            return <ProcessingScreen />;
        }

        if (results) {
            return <ResultsDisplay results={results} onReset={resetSystem} />;
        }

        if (currentStep === -1) {
            return <WelcomeScreen onStart={startDiagnosis} />;
        }

        if (currentStep >= 0 && currentStep < totalPreguntas) {
            const preguntaActual = preguntasPlanas[currentStep];
            const isLastQuestion = currentStep === totalPreguntas - 1;

            return (
                <QuestionCard
                    currentStep={currentStep}
                    totalSteps={totalPreguntas}
                    preguntaActual={preguntaActual}
                    currentResponse={getCurrentResponse()}
                    onResponse={handleResponse}
                    onNext={isLastQuestion
                        ? () => handleFinishStep(preguntaActual.key, getCurrentResponse())
                        : nextStep}
                    onPrevious={prevStep}
                    isAnswered={isCurrentQuestionAnswered()}
                    opciones={cuestionario.opciones}
                />
            );
        }

        return null;
    };

    return (
        <Box sx={{
            minHeight: '100vh',
            backgroundColor: '#f5f5f5',
            position: 'relative'
        }}>
            <NavigationBar
                currentStep={currentStep}
                totalSteps={totalPreguntas}
                onReset={resetSystem}
                onHome={resetSystem}
                showProgress={currentStep >= 0 && !results}
                mobileMenuOpen={mobileMenuOpen}
                onToggleMobileMenu={() => setMobileMenuOpen(!mobileMenuOpen)}
                onLogout={() => setLogoutDialogOpen(true)}
            />

            <MobileMenu />
            <LogoutConfirmDialog />

            <Box sx={{
                pt: { xs: 12, md: 10 },
                pb: { xs: 4, md: 6 },
                px: { xs: 1, sm: 2, md: 3 }
            }}>
                <Container
                    maxWidth="xl"
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        minHeight: 'calc(100vh - 120px)'
                    }}
                >
                    {getCurrentComponent()}
                </Container>
            </Box>

            {/* Overlay para móvil */}
            {mobileMenuOpen && (
                <Box
                    sx={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        backgroundColor: 'rgba(0,0,0,0.5)',
                        zIndex: 1200,
                        display: { xs: 'block', md: 'none' }
                    }}
                    onClick={() => setMobileMenuOpen(false)}
                />
            )}
        </Box>
    );
};

export default ExpertSystemInterface;