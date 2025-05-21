// src/api/firebaseAdmin.js
import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import fs from 'fs';

// Leer archivo de configuración desde firebase-admin.json
const serviceAccount = JSON.parse(
  fs.readFileSync('./firebase-admin.json', 'utf8')
);

// Inicializar Firebase Admin SDK
const app = initializeApp({
  credential: cert(serviceAccount),
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
});

// Inicializar Firestore
const db = getFirestore(app);

// Exportar Firestore para usar en otros archivos
export default db;
