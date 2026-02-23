import { initializeApp, FirebaseApp } from 'firebase/app';
import { getAuth, Auth, setPersistence, browserLocalPersistence } from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore';

// Garantir que authDomain tenha o formato correto
const getAuthDomain = (): string => {
  const authDomain = import.meta.env.VITE_FIREBASE_AUTH_DOMAIN;
  const projectId = import.meta.env.VITE_FIREBASE_PROJECT_ID;
  
  // Se authDomain não estiver configurado ou estiver vazio, construir a partir do projectId
  if (!authDomain || authDomain.trim() === '') {
    if (projectId) {
      return `${projectId}.firebaseapp.com`;
    }
    return '';
  }
  
  // Se authDomain não tiver o protocolo e domínio completo, garantir que tenha
  if (!authDomain.includes('.')) {
    return `${authDomain}.firebaseapp.com`;
  }
  
  return authDomain;
};

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: getAuthDomain(),
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
};

// Validação das variáveis de ambiente
const requiredEnvVars = [
  'VITE_FIREBASE_API_KEY',
  'VITE_FIREBASE_AUTH_DOMAIN',
  'VITE_FIREBASE_PROJECT_ID',
  'VITE_FIREBASE_APP_ID',
];

const missingVars = requiredEnvVars.filter(
  (varName) => !import.meta.env[varName]
);

if (missingVars.length > 0 && import.meta.env.DEV) {
    console.warn(
      `Variáveis de ambiente do Firebase faltando: ${missingVars.join(', ')}`
    );
  console.warn('Configure um arquivo .env.local com as credenciais do Firebase');
}

// Inicializar Firebase
let app: FirebaseApp | null = null;
let auth: Auth | null = null;
let db: Firestore | null = null;

// Só inicializar se todas as variáveis necessárias estiverem presentes
const hasAllRequiredVars = requiredEnvVars.every(
  (varName) => import.meta.env[varName] && import.meta.env[varName] !== 'your-api-key-here'
);

if (hasAllRequiredVars) {
  try {
    app = initializeApp(firebaseConfig);
    auth = getAuth(app);
    db = getFirestore(app);

    // Configurar persistência para melhor suporte em mobile
    // No Safari iOS, usar browserLocalPersistence pode ajudar com redirects
    setPersistence(auth, browserLocalPersistence).catch((error) => {
      console.error('Erro ao configurar persistência do Firebase:', error);
    });
    
    // Log para debug no Safari iOS
    if (typeof window !== 'undefined') {
      const isSafariIOS = /iPhone|iPad|iPod/.test(navigator.userAgent) && 
                         /Safari/.test(navigator.userAgent) && 
                         !/Chrome|CriOS|FxiOS/.test(navigator.userAgent);
      if (isSafariIOS && import.meta.env.DEV) {
        console.log('Firebase configurado para Safari iOS');
        console.log('Auth Domain:', firebaseConfig.authDomain);
        console.log('Project ID:', firebaseConfig.projectId);
      }
    }
  } catch (error) {
    console.error('Erro ao inicializar Firebase:', error);
    // Não lançar erro em desenvolvimento para permitir desenvolvimento sem Firebase
    if (import.meta.env.PROD) {
      throw error;
    }
  }
} else {
    console.warn(
      'Firebase não inicializado. Configure as variáveis de ambiente em .env.local'
    );
}

// Exportar com tipos corretos
export { app, auth, db };
export default app;

// Helper para verificar se Firebase está configurado
export const isFirebaseConfigured = (): boolean => {
  return app !== null && auth !== null && db !== null;
};
