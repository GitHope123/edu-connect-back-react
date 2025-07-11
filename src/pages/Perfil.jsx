import React from 'react';
import { 
  Box, 
  Typography, 
  Card, 
  CardContent, 
  Grid, 
  Chip, 
  Avatar,
  Container,
  Paper,
  Stack,
  Divider,
  useTheme,
  alpha
} from '@mui/material';
import {
  School,
  LocationOn,
  Phone,
  Email,
  Groups,
  CalendarToday,
  Star,
  Church,
  MenuBook,
  EmojiEvents,
  Language,
  AccessTime
} from '@mui/icons-material';

const Perfil = () => {
  const theme = useTheme();
  const heroImage = "https://prelaturayauyos.org.pe/wp-content/uploads/2021/01/IMG_2992-copia-1024x683.jpg";
  const schoolImage = "https://colegiosparroquiales.com/wp-content/uploads/2020/04/sanjose_higinio.jpg";
  const studentsImage = "https://images.unsplash.com/photo-1509062522246-3755977927d7?w=600&h=400&fit=crop";
  const churchImage = "https://colegiosparroquiales.com/wp-content/uploads/2025/03/mixto-san-jose.jpg";

  const InfoCard = ({ icon, title, subtitle, color = "primary" }) => (
    <Paper 
      elevation={0} 
      sx={{ 
        p: 2.5, 
        height: '100%', 
        borderRadius: 3,
        border: `1px solid ${alpha(theme.palette.grey[300], 0.5)}`,
        transition: 'all 0.2s ease-in-out',
        '&:hover': {
          transform: 'translateY(-2px)',
          boxShadow: theme.shadows[4]
        }
      }}
    >
      <Stack direction="row" spacing={2} alignItems="center">
        <Avatar 
          sx={{ 
            bgcolor: alpha(theme.palette[color].main, 0.1),
            color: theme.palette[color].main,
            width: 44, 
            height: 44
          }}
        >
          {icon}
        </Avatar>
        <Box sx={{ minWidth: 0, flex: 1 }}>
          <Typography variant="caption" color="text.secondary" sx={{ textTransform: 'uppercase', letterSpacing: 0.5 }}>
            {title}
          </Typography>
          <Typography variant="body2" fontWeight="600" color="text.primary">
            {subtitle}
          </Typography>
        </Box>
      </Stack>
    </Paper>
  );

  const StatsCard = ({ number, label, color = "primary" }) => (
    <Paper 
      elevation={0} 
      sx={{ 
        p: 3, 
        textAlign: 'center', 
        borderRadius: 3,
        border: `1px solid ${alpha(theme.palette.grey[300], 0.5)}`,
        transition: 'all 0.2s ease-in-out',
        '&:hover': {
          transform: 'translateY(-2px)',
          boxShadow: theme.shadows[4]
        }
      }}
    >
      <Typography variant="h3" color={`${color}.main`} fontWeight="700" sx={{ mb: 0.5 }}>
        {number}
      </Typography>
      <Typography variant="body2" color="text.secondary" fontWeight="500">
        {label}
      </Typography>
    </Paper>
  );

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#fafafa' }}>
      {/* Hero Section */}
      <Box
        sx={{
          position: 'relative',
          height: { xs: 300, md: 400 },
          backgroundImage: `linear-gradient(135deg, rgba(25, 118, 210, 0.85) 0%, rgba(21, 101, 192, 0.9) 100%), url(${heroImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          textAlign: 'center'
        }}
      >
        <Container maxWidth="md">
          <Typography variant="h2" component="h1" gutterBottom fontWeight="700" sx={{ fontSize: { xs: '2rem', md: '3rem' }, color: 'white' }}>
            Colegio San José
          </Typography>
          <Typography variant="h5" gutterBottom sx={{ opacity: 0.9, fontWeight: 300 }}>
            Cerro Alegre de Cañete
          </Typography>
          <Typography variant="subtitle1" sx={{ opacity: 0.8, mb: 3, maxWidth: 600, mx: 'auto' }}>
            87 años formando líderes éticos con inspiración cristiana
          </Typography>
          <Box sx={{ mt: 3 }}>
            <Chip 
              label="Educación Integral" 
              variant="outlined"
              sx={{ 
                mr: 1, 
                mb: 1, 
                borderColor: 'rgba(255,255,255,0.3)', 
                color: 'white',
                '&:hover': { borderColor: 'rgba(255,255,255,0.5)' }
              }} 
            />
            <Chip 
              label="Valores Cristianos" 
              variant="outlined"
              sx={{ 
                mr: 1, 
                mb: 1, 
                borderColor: 'rgba(255,255,255,0.3)', 
                color: 'white',
                '&:hover': { borderColor: 'rgba(255,255,255,0.5)' }
              }} 
            />
            <Chip 
              label="Excelencia Académica" 
              variant="outlined"
              sx={{ 
                mr: 1, 
                mb: 1, 
                borderColor: 'rgba(255,255,255,0.3)', 
                color: 'white',
                '&:hover': { borderColor: 'rgba(255,255,255,0.5)' }
              }} 
            />
          </Box>
        </Container>
      </Box>

      <Container sx={{ py: 5 }} maxWidth="lg">
        {/* Stats Section */}
        <Grid container spacing={3} sx={{ mb: 6 }}>
          <Grid item xs={12} sm={6} md={3}>
            <StatsCard number="648" label="Estudiantes" color="primary" />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatsCard number="87" label="Años de Historia" color="success" />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatsCard number="3" label="Niveles Educativos" color="warning" />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatsCard number="1937" label="Año de Fundación" color="info" />
          </Grid>
        </Grid>

        {/* Contact Info Cards */}
        <Grid container spacing={2} sx={{ mb: 6 }}>
          <Grid item xs={12} md={6}>
            <InfoCard 
              icon={<LocationOn />} 
              title="Ubicación" 
              subtitle="Parque CPM Cerro Alegre s/n, Imperial, Cañete"
              color="error"
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <InfoCard 
              icon={<Phone />} 
              title="Teléfono" 
              subtitle="01 284 7901"
              color="success"
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <InfoCard 
              icon={<Email />} 
              title="Email Secundaria" 
              subtitle="pcalegre@mail.udep.edu"
              color="info"
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <InfoCard 
              icon={<AccessTime />} 
              title="Horario de Atención" 
              subtitle="Lunes a viernes 8:00 a.m. - 1:00 p.m."
              color="warning"
            />
          </Grid>
        </Grid>

        {/* Main Content */}
        <Grid container spacing={4}>
          {/* Historia */}
          <Grid item xs={12} md={6}>
            <Card 
              elevation={0} 
              sx={{ 
                height: '100%', 
                borderRadius: 3,
                border: `1px solid ${alpha(theme.palette.grey[300], 0.5)}`,
                overflow: 'hidden'
              }}
            >
              <Box
                sx={{
                  height: 180,
                  backgroundImage: `url(${schoolImage})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center'
                }}
              />
              <CardContent sx={{ p: 3 }}>
                <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2 }}>
                  <CalendarToday color="primary" fontSize="small" />
                  <Typography variant="h6" component="h2" fontWeight="600">
                    Historia
                  </Typography>
                </Stack>
                <Typography paragraph color="text.secondary" variant="body2" sx={{ lineHeight: 1.6 }}>
                  Fundado originalmente como Escuela Fiscalizada Nº 21504 en 1937 por los Padres Agustinos. 
                  En 1975 se autorizó oficialmente el funcionamiento del Centro Educativo Particular Mixto "San José" 
                  de Cerro Alegre para secundaria.
                </Typography>
                <Typography color="text.secondary" variant="body2" sx={{ lineHeight: 1.6 }}>
                  En 1982, se convierte en Centro Educativo Parroquial Mixto "San José" bajo la promoción de la 
                  Parroquia Nuestra Señora de la Asunción de Cerro Alegre.
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          {/* Misión y Valores */}
          <Grid item xs={12} md={6}>
            <Card 
              elevation={0} 
              sx={{ 
                height: '100%', 
                borderRadius: 3,
                border: `1px solid ${alpha(theme.palette.grey[300], 0.5)}`,
                overflow: 'hidden'
              }}
            >
              <Box
                sx={{
                  height: 180,
                  backgroundImage: `url(${churchImage})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center'
                }}
              />
              <CardContent sx={{ p: 3 }}>
                <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2 }}>
                  <Church color="primary" fontSize="small" />
                  <Typography variant="h6" component="h2" fontWeight="600">
                    Misión y Valores
                  </Typography>
                </Stack>
                <Typography paragraph color="text.secondary" variant="body2" sx={{ lineHeight: 1.6 }}>
                  Brindar una educación integral en las dimensiones espiritual, 
                  cognitiva y corporal, en consonancia con la fe católica y la práctica de valores, 
                  formando personas responsables y líderes éticos.
                </Typography>
                <Box sx={{ mt: 2 }}>
                  <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                    <Chip label="Inspiración cristiana" size="small" variant="outlined" />
                    <Chip label="Ética" size="small" variant="outlined" />
                    <Chip label="Liderazgo" size="small" variant="outlined" />
                    <Chip label="Responsabilidad" size="small" variant="outlined" />
                  </Stack>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* Infraestructura */}
          <Grid item xs={12} md={6}>
            <Card 
              elevation={0} 
              sx={{ 
                height: '100%', 
                borderRadius: 3,
                border: `1px solid ${alpha(theme.palette.grey[300], 0.5)}`,
                overflow: 'hidden'
              }}
            >
              <Box
                sx={{
                  height: 180,
                  backgroundImage: `url(${studentsImage})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center'
                }}
              />
              <CardContent sx={{ p: 3 }}>
                <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2 }}>
                  <MenuBook color="primary" fontSize="small" />
                  <Typography variant="h6" component="h2" fontWeight="600">
                    Metodología
                  </Typography>
                </Stack>
                <Typography paragraph color="text.secondary" variant="body2" sx={{ lineHeight: 1.6 }}>
                  Espacios diseñados para potenciar el aprendizaje y el desarrollo socioemocional. 
                  Docentes actualizados y comprometidos con la mejora educativa.
                </Typography>
                <Typography color="text.secondary" variant="body2" sx={{ lineHeight: 1.6 }}>
                  Metodología centrada en el aprendizaje colaborativo y el acompañamiento personalizado.
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          {/* Reconocimientos */}
          <Grid item xs={12} md={6}>
            <Card 
              elevation={0} 
              sx={{ 
                height: '100%', 
                borderRadius: 3,
                border: `1px solid ${alpha(theme.palette.grey[300], 0.5)}`
              }}
            >
              <CardContent sx={{ p: 3 }}>
                <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2 }}>
                  <EmojiEvents color="primary" fontSize="small" />
                  <Typography variant="h6" component="h2" fontWeight="600">
                    Reconocimientos
                  </Typography>
                </Stack>
                <Typography paragraph color="text.secondary" variant="body2" sx={{ lineHeight: 1.6 }}>
                  Diversos reconocimientos por rendimiento académico a nivel nacional, regional y provincial.
                </Typography>
                <Typography paragraph color="text.secondary" variant="body2" sx={{ lineHeight: 1.6 }}>
                  Miles de egresados que han contribuido al desarrollo de la sociedad en Cañete, 
                  Perú y el extranjero.
                </Typography>
                <Typography color="text.secondary" variant="body2" sx={{ lineHeight: 1.6 }}>
                  Participación activa en celebraciones religiosas y culturales.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Autoridades */}
        <Card 
          elevation={0} 
          sx={{ 
            mt: 5, 
            borderRadius: 3,
            border: `1px solid ${alpha(theme.palette.grey[300], 0.5)}`
          }}
        >
          <CardContent sx={{ p: 4 }}>
            <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 3 }}>
              <Groups color="primary" />
              <Typography variant="h5" component="h2" fontWeight="600">
                Autoridades
              </Typography>
            </Stack>
            <Grid container spacing={3}>
              <Grid item xs={12} md={4}>
                <Paper 
                  elevation={0} 
                  sx={{ 
                    p: 3, 
                    textAlign: 'center',
                    border: `1px solid ${alpha(theme.palette.grey[300], 0.3)}`,
                    borderRadius: 2
                  }}
                >
                  <Avatar sx={{ width: 56, height: 56, mx: 'auto', mb: 2, bgcolor: 'primary.main' }}>
                    <School />
                  </Avatar>
                  <Typography variant="subtitle1" fontWeight="600">Pbro. Alejandro Zelada</Typography>
                  <Typography variant="body2" color="text.secondary">Promotor</Typography>
                </Paper>
              </Grid>
              <Grid item xs={12} md={4}>
                <Paper 
                  elevation={0} 
                  sx={{ 
                    p: 3, 
                    textAlign: 'center',
                    border: `1px solid ${alpha(theme.palette.grey[300], 0.3)}`,
                    borderRadius: 2
                  }}
                >
                  <Avatar sx={{ width: 56, height: 56, mx: 'auto', mb: 2, bgcolor: 'success.main' }}>
                    <School />
                  </Avatar>
                  <Typography variant="subtitle1" fontWeight="600">Saúl Guzmán Sánchez</Typography>
                  <Typography variant="body2" color="text.secondary">Director Secundaria</Typography>
                </Paper>
              </Grid>
              <Grid item xs={12} md={4}>
                <Paper 
                  elevation={0} 
                  sx={{ 
                    p: 3, 
                    textAlign: 'center',
                    border: `1px solid ${alpha(theme.palette.grey[300], 0.3)}`,
                    borderRadius: 2
                  }}
                >
                  <Avatar sx={{ width: 56, height: 56, mx: 'auto', mb: 2, bgcolor: 'warning.main' }}>
                    <School />
                  </Avatar>
                  <Typography variant="subtitle1" fontWeight="600">Carlos Puemape</Typography>
                  <Typography variant="body2" color="text.secondary">Director Primaria</Typography>
                </Paper>
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        {/* Footer Info */}
        <Card 
          elevation={0} 
          sx={{ 
            mt: 5, 
            borderRadius: 3, 
            background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
            color: 'white'
          }}
        >
          <CardContent sx={{ p: 4 }}>
            <Grid container spacing={3} alignItems="center">
              <Grid item xs={12} md={8}>
                <Typography variant="h6" gutterBottom fontWeight="600">
                  Colegio Parroquial Mixto San José de Cerro Alegre
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.9 }}>
                  Formando líderes éticos con valores cristianos desde 1937
                </Typography>
              </Grid>
              <Grid item xs={12} md={4} sx={{ textAlign: { xs: 'left', md: 'right' } }}>
                <Typography variant="body2" sx={{ opacity: 0.9 }}>
                  UGEL 08 Cañete | Código Modular: 0484576
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.9 }}>
                  Gestión Privada - Parroquial
                </Typography>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
};

export default Perfil;