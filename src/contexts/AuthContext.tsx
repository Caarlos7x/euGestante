import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User } from 'firebase/auth';
import { authService, updateUserService } from '@/services/auth';
import { profileService } from '@/services/profileService';
import { isFirebaseConfigured } from '@/firebase/config';
import { logger } from '@/utils/logger';

interface UserProfile {
  id?: string;
  nome?: string;
  dataGestacaoInicio?: string;
  dataPrevistaParto?: string;
  idadeGestacionalAtual?: number;
  telefone?: string;
  [key: string]: any;
}

interface AuthContextType {
  user: User | null;
  profile: UserProfile | null;
  loading: boolean;
  signInWithEmail: (email: string, password: string) => Promise<void>;
  signUpWithEmail: (email: string, password: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
  updateEmail: (newEmail: string, password: string) => Promise<void>;
  updatePassword: (currentPassword: string, newPassword: string) => Promise<void>;
  updateDisplayName: (nome: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  // Carregar perfil do usuário
  const loadProfile = async (currentUser: User) => {
    try {
      const profileData = await profileService.getProfile(currentUser.uid);
      if (profileData) {
        setProfile(profileData as UserProfile);
      } else {
        // Se não existe perfil, criar um básico
        setProfile(null);
      }
    } catch (error) {
      console.error('Erro ao carregar perfil:', error);
      setProfile(null);
    }
  };

  // Atualizar perfil manualmente
  const refreshProfile = async () => {
    if (user) {
      await loadProfile(user);
    }
  };

  // Processar redirect do Google
  useEffect(() => {
    // Só processar redirect se Firebase estiver configurado
    if (!isFirebaseConfigured()) {
      setLoading(false);
      return;
    }

    // Verificar resultado de redirect do Google
    // No Safari iOS, pode levar um tempo para processar o redirect
    const processRedirect = async () => {
      try {
        logger.debug('Iniciando processamento de redirect...');
        
        // No Safari iOS, o redirect pode demorar mais para ser processado
        // Tentar múltiplas vezes com intervalos maiores
        const isSafariIOS = /iPhone|iPad|iPod/.test(navigator.userAgent) && /Safari/.test(navigator.userAgent) && !/Chrome|CriOS|FxiOS/.test(navigator.userAgent);
        const maxAttempts = isSafariIOS ? 5 : 1;
        const delay = isSafariIOS ? 1000 : 200;
        
        let result = null;
        
        // Verificar se há indicação de redirect na URL antes de começar
        const hasRedirectParams = window.location.search.includes('code=') || 
                                   window.location.search.includes('state=') ||
                                   window.location.hash.includes('code=') ||
                                   window.location.hash.includes('state=');
        logger.debug('Verificando URL para parâmetros de redirect:', hasRedirectParams);
        logger.debug('URL completa:', window.location.href);
        
        for (let attempt = 1; attempt <= maxAttempts; attempt++) {
          logger.debug(`Tentativa ${attempt}/${maxAttempts} - Aguardando ${delay}ms...`);
          await new Promise(resolve => setTimeout(resolve, delay));
          
          logger.debug(`Tentativa ${attempt}: Chamando getRedirectResult...`);
          result = await authService.getRedirectResult();
          
          if (result?.user) {
            logger.debug(`Tentativa ${attempt}: Usuário encontrado!`, result.user.email);
            break;
          } else {
            logger.debug(`Tentativa ${attempt}: Nenhum resultado ainda...`);
            // Se não há parâmetros de redirect na URL, não adianta continuar tentando
            if (attempt === 1 && !hasRedirectParams) {
              logger.debug('Nenhum parâmetro de redirect encontrado na URL. Pode não ter havido redirect.');
              break;
            }
          }
        }
        
        if (result?.user) {
          logger.debug('Usuário encontrado no redirect:', result.user.email);
          // Aguardar um pouco mais para garantir que o Firebase processe completamente
          await new Promise(resolve => setTimeout(resolve, 500));
          logger.debug('Aguardou 500ms, definindo usuário...');
          
          // O onAuthStateChanged vai atualizar o estado automaticamente
          // Mas também vamos garantir que o usuário seja definido aqui
          setUser(result.user);
          logger.debug('Usuário definido no estado');
          
          await loadProfile(result.user);
          logger.debug('Perfil carregado');
        } else {
          logger.debug('Nenhum resultado de redirect encontrado após todas as tentativas');
        }
        setLoading(false);
        logger.debug('Loading definido como false');
      } catch (error: any) {
        logger.error('Erro ao processar redirect:', error?.code || error?.message || error);
        
        // Ignorar erros quando Firebase não está configurado
        if (error.message?.includes('Firebase não está configurado')) {
          setLoading(false);
          return;
        }
        // Ignorar erros de cancelamento
        if (
          error?.code === 'auth/popup-closed-by-user' ||
          error?.code === 'auth/cancelled-popup-request'
        ) {
          logger.debug('Login cancelado pelo usuário');
          setLoading(false);
          return;
        }
        // Para outros erros, ainda definir loading como false
        // O onAuthStateChanged pode ter atualizado o estado
        setLoading(false);
      }
    };

    processRedirect();
  }, []);

  // Observar mudanças no estado de autenticação
  useEffect(() => {
    // Se Firebase não estiver configurado, definir loading como false imediatamente
    if (!isFirebaseConfigured()) {
      setLoading(false);
      setUser(null);
      setProfile(null);
      return;
    }

    let isInitialLoad = true;
    let redirectProcessed = false;

    const unsubscribe = authService.onAuthStateChanged(async (currentUser) => {
      logger.debug('onAuthStateChanged chamado:', currentUser ? `usuário: ${currentUser.email}` : 'usuário: null');
      
      // No Safari iOS, após redirect, o onAuthStateChanged pode ser chamado antes do getRedirectResult
      // Aguardar um pouco mais para garantir que tudo seja processado
      if (isInitialLoad && !redirectProcessed) {
        isInitialLoad = false;
        logger.debug('Primeiro carregamento, aguardando 800ms...');
        // Aguardar mais tempo no Safari iOS para garantir que o redirect seja processado
        await new Promise(resolve => setTimeout(resolve, 800));
        redirectProcessed = true;
        logger.debug('Aguardou 800ms, processando...');
      }

      setUser(currentUser);
      logger.debug('Usuário definido no estado via onAuthStateChanged:', currentUser?.email || 'null');
      
      setLoading(false);

      if (currentUser) {
        logger.debug('Carregando perfil do usuário...');
        await loadProfile(currentUser);
        logger.debug('Perfil carregado com sucesso');
      } else {
        logger.debug('Nenhum usuário, limpando perfil');
        setProfile(null);
      }
    });

    return () => unsubscribe();
  }, []);

  const signInWithEmail = async (email: string, password: string) => {
    await authService.signInWithEmail(email, password);
    // O onAuthStateChanged vai atualizar o estado automaticamente
  };

  const signUpWithEmail = async (email: string, password: string) => {
    await authService.signUpWithEmail(email, password);
    // O onAuthStateChanged vai atualizar o estado automaticamente
  };

  const signInWithGoogle = async () => {
    await authService.signInWithGoogle();
    // O onAuthStateChanged vai atualizar o estado automaticamente
  };

  const signOut = async () => {
    await authService.signOut();
    setProfile(null);
  };

  const updateEmail = async (newEmail: string, password: string) => {
    if (!user) throw new Error('Usuário não autenticado');
    await updateUserService.updateUserEmail(user, newEmail, password);
    // O perfil será recarregado automaticamente quando o user mudar
  };

  const updatePassword = async (currentPassword: string, newPassword: string) => {
    if (!user) throw new Error('Usuário não autenticado');
    await updateUserService.updateUserPassword(user, currentPassword, newPassword);
  };

  const updateDisplayName = async (nome: string) => {
    if (!user) throw new Error('Usuário não autenticado');
    await profileService.updateName(user.uid, nome);
    await refreshProfile(); // Recarregar perfil atualizado
  };

  const value: AuthContextType = {
    user,
    profile,
    loading,
    signInWithEmail,
    signUpWithEmail,
    signInWithGoogle,
    signOut,
    refreshProfile,
    updateEmail,
    updatePassword,
    updateDisplayName,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
