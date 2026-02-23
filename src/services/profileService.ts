import {
  doc,
  setDoc,
  getDoc,
  Timestamp,
  FirestoreError,
} from 'firebase/firestore';
import { db } from '@/firebase/config';
import { isFirebaseConfigured } from '@/firebase/config';

export interface UserProfile {
  id?: string;
  userId: string;
  nome?: string;
  email?: string;
  dataGestacaoInicio?: string;
  dataPrevistaParto?: string;
  idadeGestacionalAtual?: number;
  telefone?: string;
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
}

const COLLECTION_NAME = 'userProfiles';

// Helper para converter erro do Firestore em mensagem amigável
const getFirestoreErrorMessage = (error: FirestoreError): string => {
  switch (error.code) {
    case 'permission-denied':
      return 'Você não tem permissão para realizar esta operação.';
    case 'unavailable':
      return 'Serviço temporariamente indisponível. Tente novamente mais tarde.';
    case 'deadline-exceeded':
      return 'Operação expirou. Tente novamente.';
    default:
      return error.message || 'Erro ao salvar dados. Tente novamente.';
  }
};

export const profileService = {
  // Obter perfil do usuário
  async getProfile(userId: string): Promise<UserProfile | null> {
    if (!isFirebaseConfigured() || !db) {
      console.warn('Firebase não está configurado');
      return null;
    }

    try {
      const docRef = doc(db, COLLECTION_NAME, userId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        return {
          id: docSnap.id,
          ...docSnap.data(),
        } as UserProfile;
      }

      return null;
    } catch (error: any) {
      console.error('Erro ao carregar perfil:', error);
      return null;
    }
  },

  // Criar ou atualizar perfil do usuário
  async updateProfile(userId: string, data: Partial<Omit<UserProfile, 'id' | 'userId' | 'createdAt'>>): Promise<void> {
    if (!isFirebaseConfigured() || !db) {
      throw new Error('Firebase não está configurado');
    }

    try {
      const docRef = doc(db, COLLECTION_NAME, userId);
      const docSnap = await getDoc(docRef);

      const profileData: any = {
        userId,
        ...data,
        updatedAt: Timestamp.now(),
      };

      // Se o perfil não existe, adicionar createdAt
      if (!docSnap.exists()) {
        profileData.createdAt = Timestamp.now();
      } else {
        // Manter createdAt existente
        const existingData = docSnap.data();
        if (existingData.createdAt) {
          profileData.createdAt = existingData.createdAt;
        } else {
          profileData.createdAt = Timestamp.now();
        }
      }

      await setDoc(docRef, profileData, { merge: true });
    } catch (error: any) {
      console.error('Erro ao atualizar perfil:', error);
      throw new Error(getFirestoreErrorMessage(error));
    }
  },

  // Atualizar apenas o nome
  async updateName(userId: string, nome: string): Promise<void> {
    await this.updateProfile(userId, { nome });
  },
};
