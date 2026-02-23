import {
  User,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
  GoogleAuthProvider,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  UserCredential,
  updateEmail,
  updatePassword,
  reauthenticateWithCredential,
  EmailAuthProvider,
} from 'firebase/auth';
import { auth, isFirebaseConfigured } from '@/firebase/config';
import { logger } from '@/utils/logger';

export interface AuthError {
  code: string;
  message: string;
}

const getAuthErrorMessage = (error: any): string => {
  const code = error?.code || '';
  const message = error?.message || 'Erro desconhecido';

  const errorMessages: Record<string, string> = {
    'auth/user-not-found': 'Usuário não encontrado',
    'auth/wrong-password': 'Senha incorreta',
    'auth/email-already-in-use': 'Este email já está em uso',
    'auth/weak-password': 'Senha muito fraca. Use pelo menos 6 caracteres',
    'auth/invalid-email': 'Email inválido',
    'auth/popup-closed-by-user': 'Login cancelado',
    'auth/popup-blocked': 'Popup bloqueado. Permita popups para este site',
    'auth/unauthorized-domain': `Domínio não autorizado. Adicione "${window.location.hostname}" nas configurações do Firebase`,
    'auth/operation-not-allowed': 'Login com Google não está habilitado',
    'auth/network-request-failed': 'Erro de conexão. Verifique sua internet',
  };

  return errorMessages[code] || message;
};

const checkFirebaseConfig = () => {
  if (!isFirebaseConfigured() || !auth) {
    throw new Error(
      'Firebase não está configurado. Configure as variáveis de ambiente em .env.local'
    );
  }
};

export const authService = {
  // Login com email e senha
  async signInWithEmail(email: string, password: string): Promise<UserCredential> {
    checkFirebaseConfig();
    try {
      return await signInWithEmailAndPassword(auth!, email.trim(), password);
    } catch (error: any) {
      throw new Error(getAuthErrorMessage(error));
    }
  },

  // Criar conta com email e senha
  async signUpWithEmail(email: string, password: string): Promise<UserCredential> {
    checkFirebaseConfig();
    try {
      return await createUserWithEmailAndPassword(auth!, email.trim(), password);
    } catch (error: any) {
      throw new Error(getAuthErrorMessage(error));
    }
  },

  // Login com Google
  async signInWithGoogle(): Promise<UserCredential> {
    checkFirebaseConfig();
    const provider = new GoogleAuthProvider();
    provider.addScope('profile');
    provider.addScope('email');
    
    // Configurar para usar redirect em Safari iOS (mais confiável)
    provider.setCustomParameters({
      prompt: 'select_account',
    });

    // Detecção melhorada de dispositivos e navegadores
    const userAgent = navigator.userAgent.toLowerCase();
    const isIOS = /iphone|ipad|ipod/.test(userAgent);
    const isSafari = /safari/.test(userAgent) && !/chrome|crios|fxios/.test(userAgent);
    const isSafariIOS = isIOS && isSafari;
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    const isAndroid = /android/i.test(userAgent);

    logger.debug('=== DEBUG LOGIN GOOGLE ===');
    logger.debug('User agent:', navigator.userAgent);
    logger.debug('iOS:', isIOS);
    logger.debug('Safari:', isSafari);
    logger.debug('Safari iOS:', isSafariIOS);
    logger.debug('Mobile:', isMobile);
    logger.debug('Android:', isAndroid);
    logger.debug('==========================');

    try {
      // Safari iOS: usar redirect diretamente (mais confiável)
      if (isSafariIOS) {
        logger.debug('Safari iOS detectado: usando redirect diretamente...');
        await signInWithRedirect(auth!, provider);
        throw new Error('Redirect iniciado');
      }

      // Android: tentar popup primeiro, fallback para redirect
      if (isAndroid || isMobile) {
        logger.debug('Mobile detectado: tentando popup primeiro...');
        try {
          const result = await signInWithPopup(auth!, provider);
          logger.debug('Popup bem-sucedido:', result.user?.email);
          return result;
        } catch (popupError: any) {
          logger.debug('Popup falhou, usando redirect...', popupError?.code);
          
          // Se popup foi bloqueado ou não suportado, usar redirect
          if (
            popupError?.code === 'auth/popup-blocked' ||
            popupError?.code === 'auth/popup-closed-by-user' ||
            popupError?.code === 'auth/operation-not-allowed' ||
            popupError?.code === 'auth/cancelled-popup-request' ||
            popupError?.code === 'auth/popup-closed-by-user'
          ) {
            logger.debug('Usando redirect como fallback...');
            await signInWithRedirect(auth!, provider);
            throw new Error('Redirect iniciado');
          }
          throw popupError;
        }
      }

      // Desktop: tentar popup primeiro, fallback para redirect
      logger.debug('Desktop: tentando popup...');
      try {
        const result = await signInWithPopup(auth!, provider);
        logger.debug('Popup bem-sucedido:', result.user?.email);
        return result;
      } catch (popupError: any) {
        logger.debug('Popup falhou, tentando redirect...', popupError?.code);
        
        // Se popup foi bloqueado ou não suportado, usar redirect
        if (
          popupError?.code === 'auth/popup-blocked' ||
          popupError?.code === 'auth/popup-closed-by-user' ||
          popupError?.code === 'auth/operation-not-allowed' ||
          popupError?.code === 'auth/cancelled-popup-request'
        ) {
          logger.debug('Usando redirect como fallback...');
          await signInWithRedirect(auth!, provider);
          throw new Error('Redirect iniciado');
        }
        throw popupError;
      }
    } catch (error: any) {
      // Se for o erro de redirect iniciado, relançar sem modificar
      if (error.message === 'Redirect iniciado') {
        throw error;
      }
      throw new Error(getAuthErrorMessage(error));
    }
  },

  // Processar resultado do redirect do Google
  async getRedirectResult(): Promise<UserCredential | null> {
    if (!isFirebaseConfigured() || !auth) {
      logger.debug('getRedirectResult: Firebase não configurado ou auth não disponível');
      return null;
    }
    try {
      // Log da URL atual para debug
      logger.debug('getRedirectResult: URL atual:', window.location.href);
      logger.debug('getRedirectResult: Parâmetros da URL:', window.location.search);
      logger.debug('getRedirectResult: Hash da URL:', window.location.hash);
      
      logger.debug('getRedirectResult: Chamando Firebase getRedirectResult...');
      const result = await getRedirectResult(auth);
      logger.debug('getRedirectResult: Resultado recebido:', result ? `usuário: ${result.user?.email}` : 'null');
      
      if (!result) {
        // Verificar se há parâmetros na URL que indiquem um redirect
        const urlParams = new URLSearchParams(window.location.search);
        const hashParams = new URLSearchParams(window.location.hash.substring(1));
        logger.debug('getRedirectResult: URL params:', Array.from(urlParams.entries()));
        logger.debug('getRedirectResult: Hash params:', Array.from(hashParams.entries()));
        
        // Verificar localStorage/sessionStorage para debug
        try {
          const authState = localStorage.getItem('firebase:authUser');
          logger.debug('getRedirectResult: localStorage authUser:', authState ? 'existe' : 'não existe');
        } catch (e) {
          logger.debug('getRedirectResult: Erro ao acessar localStorage:', e);
        }
      }
      
      return result;
    } catch (error: any) {
      logger.error('getRedirectResult: Erro:', error?.code || error?.message || error);
      logger.error('getRedirectResult: Stack:', error?.stack);
      
      // Ignorar erros de cancelamento
      if (
        error?.code === 'auth/popup-closed-by-user' ||
        error?.code === 'auth/cancelled-popup-request'
      ) {
        logger.debug('getRedirectResult: Login cancelado pelo usuário');
        return null;
      }
      logger.error('Erro no redirect do Google:', error);
      throw new Error(getAuthErrorMessage(error));
    }
  },

  // Logout
  async signOut(): Promise<void> {
    checkFirebaseConfig();
    try {
      await firebaseSignOut(auth!);
    } catch (error: any) {
      throw new Error(getAuthErrorMessage(error));
    }
  },

  // Obter usuário atual
  getCurrentUser(): User | null {
    if (!isFirebaseConfigured() || !auth) {
      return null;
    }
    return auth.currentUser;
  },

  // Observar mudanças no estado de autenticação
  onAuthStateChanged(callback: (user: User | null) => void): () => void {
    if (!isFirebaseConfigured() || !auth) {
      // Retornar função vazia se Firebase não estiver configurado
      return () => {};
    }
    return onAuthStateChanged(auth, callback);
  },
};

export const updateUserService = {
  // Atualizar email do usuário
  async updateUserEmail(user: User, newEmail: string, password: string): Promise<void> {
    checkFirebaseConfig();
    try {
      // Reautenticar o usuário antes de mudar o email
      const credential = EmailAuthProvider.credential(user.email || '', password);
      await reauthenticateWithCredential(user, credential);
      
      // Atualizar email
      await updateEmail(user, newEmail.trim());
    } catch (error: any) {
      throw new Error(getAuthErrorMessage(error));
    }
  },

  // Atualizar senha do usuário
  async updateUserPassword(user: User, currentPassword: string, newPassword: string): Promise<void> {
    checkFirebaseConfig();
    try {
      // Reautenticar o usuário antes de mudar a senha
      const credential = EmailAuthProvider.credential(user.email || '', currentPassword);
      await reauthenticateWithCredential(user, credential);
      
      // Atualizar senha
      await updatePassword(user, newPassword);
    } catch (error: any) {
      throw new Error(getAuthErrorMessage(error));
    }
  },
};
