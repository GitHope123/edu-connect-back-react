import React, { useRef, useMemo, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
  Box,
  Chip,
  Divider,
  Grid
} from "@mui/material";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { styled } from "@mui/material/styles";
import {
  School as SchoolIcon,
  PictureAsPdf as PictureAsPdfIcon,
  Description as DescriptionIcon,
  Visibility as VisibilityIcon,
  BusinessCenter as BusinessCenterIcon,
  Assessment as AssessmentIcon
} from "@mui/icons-material";
import logoSJ from "../../../assets/logo_colegio.jpg";

// Colores azules formales y organizacionales
const COLORS = {
  primaryBlue: "#1565C0",      // Azul principal corporativo
  secondaryBlue: "#2196F3",    // Azul secundario
  lightBlue: "#E3F2FD",        // Azul claro para fondos
  darkBlue: "#0D47A1",         // Azul oscuro para texto
  accentBlue: "#42A5F5",       // Azul de acento
  white: "#FFFFFF",
  lightGray: "#F8F9FA",
  mediumGray: "#E0E0E0",
  darkGray: "#424242"
};

// Estilos mejorados para el PDF
const PdfContent = styled("div")(({ theme, isPreview = false }) => ({
  display: "flex", // <-- Añade esto
  flexDirection: "column", // <-- Añade esto
  minHeight: "1000px", // <-- Ajusta según el tamaño de tu PDF, para asegurar espacio
  padding: theme.spacing(3),
  fontFamily: "'Arial', 'Helvetica', sans-serif",
  backgroundColor: COLORS.white,
  ...(isPreview && {
    border: `2px solid ${COLORS.primaryBlue}`,
    maxHeight: "600px",
    overflow: "auto",
    marginBottom: theme.spacing(2),
    boxShadow: theme.shadows[3]
  }),
  "& .header": {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: theme.spacing(3),
    paddingBottom: theme.spacing(2),
    borderBottom: `3px solid ${COLORS.primaryBlue}`,
    background: COLORS.white, // Fondo blanco
    color: COLORS.primaryBlue, // Texto azul corporativo
    padding: theme.spacing(2.5),
    borderRadius: "8px 8px 0 0",
    "& .title": {
      fontWeight: "600",
      fontSize: "26px",
      display: "flex",
      alignItems: "center",
      letterSpacing: "0.5px",
      "& svg": {
        marginRight: theme.spacing(1),
        color: COLORS.white,
        fontSize: "28px"
      }
    },
    "& .logo-container": {
      display: "flex",
      alignItems: "center",
      "& img": {
        height: "75px",
        marginRight: theme.spacing(2),
        border: `2px solid ${COLORS.white}`,
        borderRadius: "6px",
        boxShadow: "0 2px 8px rgba(0,0,0,0.1)"
      }
    }
  },
  "& .student-info": {
    backgroundColor: COLORS.lightBlue,
    padding: theme.spacing(2.5),
    borderRadius: "8px",
    marginBottom: theme.spacing(3),
    borderLeft: `5px solid ${COLORS.primaryBlue}`,
    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
    "& .info-grid": {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
      gap: theme.spacing(2)
    },
    "& .info-item": {
      "& .label": {
        fontWeight: "600",
        color: COLORS.darkBlue,
        display: "inline-block",
        minWidth: "120px",
        fontSize: "14px"
      },
      "& .value": {
        color: COLORS.darkGray,
        fontSize: "14px"
      }
    }
  },
  "& .section-title": {
    color: COLORS.primaryBlue,
    fontWeight: "600",
    margin: `${theme.spacing(3)} 0 ${theme.spacing(1.5)} 0`,
    display: "flex",
    alignItems: "center",
    fontSize: "18px",
    paddingBottom: theme.spacing(1),
    borderBottom: `2px solid ${COLORS.lightBlue}`,
    "& svg": {
      marginRight: theme.spacing(1),
      color: COLORS.accentBlue,
      fontSize: "22px"
    }
  },
  "& .incidents-table": {
    marginTop: theme.spacing(2),
    borderRadius: "8px",
    overflow: "hidden",
    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
    "& th": {
      backgroundColor: `${COLORS.primaryBlue} !important`,
      color: `${COLORS.white} !important`,
      fontWeight: "600 !important",
      fontSize: "14px",
      padding: "12px 16px"
    },
    "& tr:nth-of-type(even)": {
      backgroundColor: `${COLORS.lightGray} !important`
    },
    "& tr:hover": {
      backgroundColor: `${COLORS.lightBlue} !important`
    },
    "& .positive": {
      borderLeft: `4px solid ${COLORS.accentBlue}`
    },
    "& .negative": {
      borderLeft: `4px solid ${COLORS.primaryBlue}`
    },
    "& td": {
      padding: "10px 16px",
      fontSize: "13px"
    }
  },
  "& .summary-card": {
    backgroundColor: COLORS.lightGray,
    padding: theme.spacing(2.5),
    borderRadius: "8px",
    marginBottom: theme.spacing(3),
    borderTop: `4px solid ${COLORS.accentBlue}`,
    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
    "& .summary-item": {
      display: "flex",
      justifyContent: "space-between",
      marginBottom: theme.spacing(1.5),
      padding: theme.spacing(0.5, 0),
      "& .label": {
        fontWeight: "500",
        color: COLORS.darkBlue,
        fontSize: "14px"
      },
      "& .count": {
        fontWeight: "600",
        color: COLORS.primaryBlue,
        fontSize: "16px",
        backgroundColor: COLORS.white,
        padding: "4px 12px",
        borderRadius: "12px",
        border: `1px solid ${COLORS.mediumGray}`
      }
    }
  },
  "& .footer": {
    marginTop: theme.spacing(4),
    textAlign: "center",
    color: COLORS.darkBlue,
    borderTop: `2px solid ${COLORS.lightBlue}`,
    paddingTop: theme.spacing(3),
    fontSize: "12px",
    backgroundColor: COLORS.lightGray,
    padding: theme.spacing(3),
    borderRadius: "0 0 8px 8px",
    "& .signature-section": {
      marginTop: theme.spacing(4),
      display: "flex",
      justifyContent: "space-around",
      "& .signature-line": {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        "& .line": {
          width: "180px",
          borderTop: `1px solid ${COLORS.primaryBlue}`,
          marginBottom: theme.spacing(1)
        },
        "& .label": {
          fontSize: "11px",
          color: COLORS.darkBlue,
          fontWeight: "500"
        }
      }
    }
  }
}));

const InformeModal = ({ show, handleClose, estudiante, todasLasIncidencias }) => {
  const contentRef = useRef();
  const [generatingPDF, setGeneratingPDF] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  const incidenciasEstudiante = useMemo(() => {
    if (!todasLasIncidencias || !estudiante) return [];
    let filtradas = todasLasIncidencias.filter(
      inc => inc.idEstudiante === estudiante.idEstudiante
    );
    if (filtradas.length === 0) {
      filtradas = todasLasIncidencias.filter(
        inc =>
          inc.nombreEstudiante === estudiante.nombres &&
          inc.apellidoEstudiante === estudiante.apellidos
      );
    }
    return filtradas;
  }, [todasLasIncidencias, estudiante]);

  const incidenciasPositivas = incidenciasEstudiante.filter(
    inc => (inc.tipo || "").toLowerCase() === "reconocimiento"
  );
  const incidenciasNegativas = incidenciasEstudiante.filter(
    inc => (inc.tipo || "").toLowerCase() === "falta"
  );

  if (!estudiante) return null;

  const parseFecha = (fechaStr) => {
    if (!fechaStr) return null;
    // Si ya es un objeto Date, retorna directo
    if (fechaStr instanceof Date) return fechaStr;
    // Si es formato DD/MM/YYYY
    const parts = fechaStr.split("/");
    if (parts.length === 3) {
      // new Date(año, mes-1, día)
      return new Date(Number(parts[2]), Number(parts[1]) - 1, Number(parts[0]));
    }
    // Si es formato ISO o válido para Date, intenta parsear normal
    const d = new Date(fechaStr);
    return isNaN(d) ? null : d;
  };

  const formatDate = (dateString) => {
    const date = parseFecha(dateString);
    if (!date) return "-";
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString('es-ES', options);
  };

  const handleDownloadPDF = async () => {
    setGeneratingPDF(true);
    try {
      const element = contentRef.current;
      const filename = `Informe_Estudiantil_${estudiante.nombres}_${estudiante.apellidos}.pdf`;
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        logging: false,
        allowTaint: true,
        letterRendering: true,
      });
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgData = canvas.toDataURL('image/png');
      const pdfWidth = pdf.internal.pageSize.getWidth() - 20;
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      pdf.addImage(imgData, 'PNG', 10, 10, pdfWidth, pdfHeight);
      pdf.save(filename);
    } catch (error) {
      console.error("Error al generar PDF:", error);
      alert("Ocurrió un error al generar el PDF. Por favor intente nuevamente.");
    } finally {
      setGeneratingPDF(false);
    }
  };

  const getDetalleLimpio = (detalle = "") => {
    const match = detalle.match(/(CONDUCTUAL|PARTICIPATIVO|RESPONSABLE|ACADÉMICA):\s*(.*)/i);
    return match ? match[2].trim() : detalle;
  };

  const renderPDFContent = () => (
    <PdfContent ref={contentRef}>
      {/* Encabezado */}
      <div className="header">
        <div className="logo-container">
          <img src={logoSJ} alt="Logo Institución" style={{ width: 120, height:120, marginRight: 20, borderRadius: 8 }} />
          <div>
            <Typography variant="h6" className="title" sx={{ fontWeight: 500, fontSize: "14px", lineHeight: 1.1 }}>
              I.E. San Jose de Cerro Alegre
            </Typography>
            <Typography sx={{ fontSize: "14px", color: COLORS.darkBlue, lineHeight: 1.2 }}>
              Dirección: Av. Principal 123, Cerro Alegre<br />
              Número de Teléfono: (01) 234-5678
            </Typography>
          </div>
        </div>
        <img src={logoSJ} alt="Logo Institución" style={{ width: 120, height:120, marginRight: 20, borderRadius: 8 }} />
      </div>

      {/* Contenido principal crece y empuja el footer */}
      <div style={{ flexGrow: 1, display: "flex", flexDirection: "column" }}>
        {/* Información del estudiante */}
        <div className="student-info">
          <div className="info-item">
            <Typography paragraph>
              El colegio <strong>San Jose de Cerro Alegre</strong> hace constar que el estudiante <strong>{estudiante.nombres} {estudiante.apellidos}</strong>, identificado con DNI <strong>{estudiante.dni || "No registrado"}</strong>, del grado <strong>{estudiante.grado}°</strong>, sección <strong>"{estudiante.seccion}"</strong>, durante su periodo académico presentó un total de <strong>{incidenciasEstudiante.length}</strong> registro(s) de incidencias.
            </Typography>
          </div>
        </div>

        {/* Incidencias positivas */}
        {incidenciasPositivas.length > 0 && (
          <>
            <Typography variant="h6" className="section-title">
              <SchoolIcon /> Reconocimientos y Logros
            </Typography>
            <TableContainer component={Paper} className="incidents-table">
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell><strong>N°</strong></TableCell>
                    <TableCell><strong>Fecha</strong></TableCell>
                    <TableCell><strong>Tipo</strong></TableCell>
                    <TableCell><strong>Descripción</strong></TableCell>
            
                  </TableRow>
                </TableHead>
                <TableBody>
                  {incidenciasPositivas.map((inc, idx) => (
                    <TableRow key={`pos-${idx}`} className="positive">
                      <TableCell>{idx + 1}</TableCell>
                      <TableCell>{formatDate(inc.fecha)}</TableCell>
                      <TableCell>
                        {inc.tipo || "Reconocimiento"}
                      </TableCell>
                      <TableCell>
                        {inc.descripcion || getDetalleLimpio(inc.detalle) || "-"}
                      </TableCell>

                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </>
        )}

        {/* Incidencias negativas */}
        {incidenciasNegativas.length > 0 && (
          <>
            <Typography variant="h6" className="section-title">
              <SchoolIcon /> Incidencias Negativas
            </Typography>
            <TableContainer component={Paper} className="incidents-table">
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell><strong>N°</strong></TableCell>
                    <TableCell><strong>Fecha</strong></TableCell>
                    <TableCell><strong>Tipo</strong></TableCell>
                    <TableCell><strong>Gravedad</strong></TableCell>
                    <TableCell><strong>Descripción</strong></TableCell>

                  </TableRow>
                </TableHead>
                <TableBody>
                  {incidenciasNegativas.map((inc, idx) => (
                    <TableRow key={`neg-${idx}`} className="negative">
                      <TableCell>{idx + 1}</TableCell>
                      <TableCell>{formatDate(inc.fecha)}</TableCell>
                      <TableCell>
                        {inc.tipo}
                      </TableCell>
                      <TableCell> {inc.atencion}</TableCell>
                      <TableCell>
                        {inc.descripcion || getDetalleLimpio(inc.detalle) || "-"}
                      </TableCell>
          
 
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </>
        )}
      </div>

      {/* Footer SIEMPRE abajo */}
      <div className="footer">
        <div className="signature-section">
          <div className="signature-line">
            <div className="line"></div>
            <Typography className="label" sx={{ mt: 1 }}>
              Firma del Director(a)
            </Typography>
            <Typography sx={{ fontSize: "11px", color: COLORS.darkGray }}>
              Mg. Juan Pérez Rodríguez
            </Typography>
            <Typography sx={{ fontSize: "11px", color: COLORS.darkGray }}>
              Director Académico
            </Typography>
          </div>
        </div>
        <Divider sx={{ my: 2, borderColor: COLORS.mediumGray }} />
        <Typography variant="body2" sx={{ fontWeight: "500", mb: 1 }}>
          Sistema de Gestión Estudiantil
        </Typography>
        <Typography variant="body2" sx={{ mb: 2 }}>
          Documento generado automáticamente el {new Date().toLocaleDateString('es-ES', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          })}
        </Typography>
        <Typography variant="caption" sx={{ color: COLORS.darkGray }}>
          Este documento es válido sin firma ni sello físico.
        </Typography>
      </div>
    </PdfContent>
  );

  return (
    <Dialog
      open={show}
      onClose={handleClose}
      maxWidth="md"
      fullWidth
      aria-labelledby="informe-dialog-title"
      PaperProps={{
        sx: {
          borderRadius: 3,
          overflow: 'hidden'
        }
      }}
    >
      <DialogTitle
        id="informe-dialog-title"
        sx={{
          backgroundColor: COLORS.primaryBlue,
          color: COLORS.white,
          display: 'flex',
          alignItems: 'center',
          fontWeight: "600",
          "& svg": {
            marginRight: 1
          }
        }}
      >
        <DescriptionIcon />
        Informe Estudiantil - {estudiante.nombres} {estudiante.apellidos}
      </DialogTitle>

      <DialogContent dividers>
        {/* Contenido oculto para PDF */}
        <div style={{ position: "absolute", left: "-9999px", top: 0 }}>
          {renderPDFContent()}
        </div>

        {/* Contenido visible para el usuario */}
        {showPreview ? (
          renderPDFContent()
        ) : (
          <Box sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom sx={{ color: COLORS.primaryBlue, fontWeight: "600" }}>
              Vista previa del informe
            </Typography>

            <Grid container spacing={2} sx={{ mb: 3 }}>
              <Grid item xs={12} sm={6}>
                <Paper sx={{ p: 2, borderLeft: `4px solid ${COLORS.primaryBlue}`, backgroundColor: COLORS.lightBlue }}>
                  <Typography variant="subtitle1" sx={{ color: COLORS.darkBlue, mb: 1, fontWeight: "600" }}>
                    Datos del estudiante
                  </Typography>
                  <Typography><strong>Nombre:</strong> {estudiante.nombres} {estudiante.apellidos}</Typography>
                  <Typography><strong>Grado/Sección:</strong> {estudiante.grado}° "{estudiante.seccion}"</Typography>
                  <Typography><strong>DNI:</strong> {estudiante.dni || "No registrado"}</Typography>
                </Paper>
              </Grid>

              <Grid item xs={12} sm={6}>
                <Paper sx={{ p: 2, borderLeft: `4px solid ${COLORS.accentBlue}`, backgroundColor: COLORS.lightGray }}>
                  <Typography variant="subtitle1" sx={{ color: COLORS.darkBlue, mb: 1, fontWeight: "600" }}>
                    Resumen de registros
                  </Typography>
                  <Typography>
                    <Box component="span" sx={{ color: COLORS.accentBlue, fontWeight: "600" }}>Positivos:</Box> {incidenciasPositivas.length}
                  </Typography>
                  <Typography>
                    <Box component="span" sx={{ color: COLORS.primaryBlue, fontWeight: "600" }}>Negativas:</Box> {incidenciasNegativas.length}
                  </Typography>
                  <Typography>
                    <strong>Total:</strong> {incidenciasEstudiante.length}
                  </Typography>
                </Paper>
              </Grid>
            </Grid>

            <Typography paragraph sx={{ color: COLORS.darkBlue }}>
              Este informe generará un documento PDF profesional con diseño corporativo que incluye:
            </Typography>

            <Box component="ul" sx={{ pl: 3, mb: 3, color: COLORS.darkGray }}>
              <li>Encabezado institucional con diseño profesional</li>
              <li>Información completa y organizada del estudiante</li>
              <li>Resumen estadístico con métricas clave</li>
              <li>Tablas detalladas de reconocimientos y áreas de mejora</li>
              <li>Pie de página con espacios para firmas institucionales</li>
            </Box>

            <Paper sx={{ p: 2, backgroundColor: COLORS.lightBlue, borderRadius: 2 }}>
              <Typography variant="body2" sx={{ color: COLORS.darkBlue, fontStyle: "italic" }}>
                <strong>Nota:</strong> El documento mantendrá un formato profesional y organizacional
                apropiado para uso institucional y comunicación con padres de familia.
              </Typography>
            </Paper>
          </Box>
        )}
      </DialogContent>

      <DialogActions sx={{ p: 2, borderTop: `1px solid ${COLORS.mediumGray}` }}>
        <Button
          onClick={() => setShowPreview(!showPreview)}
          color="primary"
          variant="outlined"
          startIcon={<VisibilityIcon />}
          sx={{
            mr: 1,
            borderColor: COLORS.primaryBlue,
            color: COLORS.primaryBlue,
            '&:hover': {
              borderColor: COLORS.darkBlue,
              backgroundColor: COLORS.lightBlue
            }
          }}
        >
          {showPreview ? 'Ocultar vista previa' : 'Vista previa'}
        </Button>
        <Button
          onClick={handleClose}
          color="secondary"
          variant="outlined"
          sx={{
            mr: 'auto',
            borderColor: COLORS.mediumGray,
            color: COLORS.darkGray
          }}
        >
          Cancelar
        </Button>
        <Button
          onClick={handleDownloadPDF}
          variant="contained"
          disabled={generatingPDF}
          startIcon={generatingPDF ? <CircularProgress size={20} /> : <PictureAsPdfIcon />}
          sx={{
            backgroundColor: COLORS.primaryBlue,
            '&:hover': { backgroundColor: COLORS.darkBlue },
            fontWeight: "600"
          }}
        >
          {generatingPDF ? 'Generando PDF...' : 'Descargar Informe'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default InformeModal;