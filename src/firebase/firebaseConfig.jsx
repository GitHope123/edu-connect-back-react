import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

// Verificación de variables de entorno
if (!import.meta.env.VITE_FIREBASE_API_KEY) {
  console.error("Faltan variables de entorno de Firebase!");
  throw new Error("Configuración de Firebase incompleta");
}

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || ''
};

// Inicialización con verificación de errores
let app;
try {
  app = initializeApp(firebaseConfig);
} catch (error) {
  console.error("Error al inicializar Firebase:", error);
  throw error;
}

export const db = getFirestore(app);
export const auth = getAuth(app);