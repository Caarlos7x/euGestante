import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User } from 'firebase/auth';
import { authService, updateUserService } from '@/services/auth';
import { profileService, UserProfile as ProfileData } from '@/services/profileService';
import { isFirebaseConfigured } from '@/firebase/config';

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

    console.log('Verificando resultado de redirect do Google...');
    authService
      .getRedirectResult()
      .then((result) => {
        if (result) {
          console.log('Login Google bem-sucedido via redirect:', result.user?.email);
          // O onAuthStateChanged vai atualizar o estado automaticamente
        } else {
          console.log('Nenhum resultado de redirect encontrado');
        }
        setLoading(false);
      })
      .catch((error) => {
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
          console.log('Login cancelado pelo usuário');
          setLoading(false);
          return;
        }
        console.error('Erro ao processar redirect:', error);
        setLoading(false);
      });
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

    const unsubscribe = authService.onAuthStateChanged(async (currentUser) => {
      setUser(currentUser);
      setLoading(false);

      if (currentUser) {
        await loadProfile(currentUser);
      } else {
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
