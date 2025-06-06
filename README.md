# EduConnet Backend

## 🛠️ Sistema de Gestión Centralizada de Incidencias Escolares (Back-End)

Este repositorio contiene el **back-end** del sistema **EduConnet**, una solución diseñada para que **usuarios administradores** gestionen incidencias escolares de forma eficiente y segura.  
Se basa en tecnologías modernas como **Firebase**, brindando escalabilidad, seguridad y velocidad en el desarrollo.

---

## 🔐 Autenticación y Control de Acceso

La autenticación se realiza mediante **Firebase Authentication**, lo que garantiza un acceso seguro y gestionado para usuarios autorizados.  
Además, el sistema incluye un **control de roles** básico, permitiendo que solo usuarios con perfil **administrador** puedan:

- Iniciar sesión en el sistema
- Administrar miembros de la institución y datos sensibles
---

## 🌐 Comunicación con la Base de Datos

Se utiliza **Cloud Firestore**, una base de datos NoSQL en tiempo real, ideal para aplicaciones con alta demanda de lecturas y escrituras.

Funciones modulares y reutilizables permiten realizar operaciones como:

- Administración de usuarios, miembros e incidencias
- Consultas históricas con filtros y agrupaciones en tiempo real

---

## 📊 Procesamiento de Datos para Visualización

Aunque se trata del **back-end**, se ha incluido lógica de procesamiento para alimentar dashboards y reportes visuales del **front-end**.

Funciones destacadas:

- Consultas optimizadas para gráficas e informes
- Preparación de datos estructurados para visualización
- Interfaces listas para ser consumidas por componentes del cliente

---

## ⚙️ Despliegue Automatizado (CI/CD con Jenkins)

El flujo de **Integración y Entrega Continua (CI/CD)** está automatizado mediante **Jenkins**, permitiendo despliegues rápidos, seguros y sin interrupciones.

Cada cambio en la rama principal activa una pipeline que ejecuta:

1. ✅ Pruebas unitarias y validación del código  
2. 🛠️ Construcción del proyecto  
3. 🚀 Despliegue automático en **Firebase Hosting**

---

## 🧩 Tecnologías Utilizadas

| Tecnología                | Propósito                                          |
|--------------------------|----------------------------------------------------|
| **Firebase Authentication** | Gestión de autenticación y roles de usuario       |
| **Cloud Firestore**         | Base de datos en tiempo real                      |
| **Jenkins**                 | Automatización del ciclo CI/CD                    |
| **Firebase Hosting**        | Hosting del proyecto backend                      |

---

## 📁 Estructura y Componentes Principales

El proyecto incluye los siguientes archivos y módulos clave:

### Configuración

- `.env` – Variables de entorno (API keys, credenciales, etc.)  
- `.firebaserc` – Configuración de proyectos para Firebase CLI  
- `firebase.json` – Configuración de Firebase Hosting  
- `firebase-admin.json` – Credenciales de servicio para Admin SDK  
- `firebaseAdmin.js` – Inicialización del SDK administrador de Firebase  

### Código Fuente (`/src`)

- `App.jsx` – Componente principal de la app  
- `main.jsx` – Punto de entrada de la app (Vite + React)  
- `contexts/AuthContext.jsx` – Contexto global de autenticación  
- `components/ProtectedRoute.jsx` – Protección de rutas privadas  
- `pages/Dashboard.jsx` – Vista principal del sistema  
- `pages/Login.jsx` – Pantalla de inicio de sesión  
- `pages/graficos/ResumenGeneral.jsx` – Panel estadístico general  
- `models/` – Modelos CRUD para estudiantes, profesores e incidencias  

### Otros Archivos
- `Jenkinsfile` – Configuración de pipeline CI/CD  
- `README.md` – Documentación del proyecto
---

## 📌 Requisitos Previos

Antes de comenzar, asegúrate de contar con:

- **Node.js v16+**  
- **Firebase CLI** (`npm install -g firebase-tools`)  
- **Jenkins** correctamente configurado para CI/CD  
- Una **cuenta en Firebase** con proyecto creado  
