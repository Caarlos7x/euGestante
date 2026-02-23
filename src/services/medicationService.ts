import {
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  getDocs,
  query,
  where,
  Timestamp,
  FirestoreError,
} from 'firebase/firestore';
import { db } from '@/firebase/config';
import { isFirebaseConfigured } from '@/firebase/config';

export interface Medication {
  id?: string;
  userId: string;
  name: string;
  times: string[]; // Array de horários no formato "HH:mm"
  active: boolean; // Se o medicamento está ativo
  notes?: string; // Observações opcionais
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
}

const COLLECTION_NAME = 'medications';

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

export const medicationService = {
  // Salvar novo medicamento
  async saveMedication(userId: string, medication: Omit<Medication, 'id' | 'userId' | 'createdAt' | 'updatedAt'>): Promise<string> {
    if (!isFirebaseConfigured() || !db) {
      throw new Error('Firebase não está configurado');
    }

    try {
      const medicationData = {
        userId,
        ...medication,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
      };

      const docRef = await addDoc(collection(db, COLLECTION_NAME), medicationData);
      return docRef.id;
    } catch (error: any) {
      console.error('Erro ao salvar medicamento:', error);
      throw new Error(getFirestoreErrorMessage(error));
    }
  },

  // Atualizar medicamento existente
  async updateMedication(medicationId: string, medication: Partial<Omit<Medication, 'id' | 'userId' | 'createdAt'>>): Promise<void> {
    if (!isFirebaseConfigured() || !db) {
      throw new Error('Firebase não está configurado');
    }

    try {
      const docRef = doc(db, COLLECTION_NAME, medicationId);
      await updateDoc(docRef, {
        ...medication,
        updatedAt: Timestamp.now(),
      });
    } catch (error: any) {
      console.error('Erro ao atualizar medicamento:', error);
      throw new Error(getFirestoreErrorMessage(error));
    }
  },

  // Deletar medicamento
  async deleteMedication(medicationId: string): Promise<void> {
    if (!isFirebaseConfigured() || !db) {
      throw new Error('Firebase não está configurado');
    }

    try {
      const docRef = doc(db, COLLECTION_NAME, medicationId);
      await deleteDoc(docRef);
    } catch (error: any) {
      console.error('Erro ao deletar medicamento:', error);
      throw new Error(getFirestoreErrorMessage(error));
    }
  },

  // Obter todos os medicamentos do usuário
  async getUserMedications(userId: string): Promise<Medication[]> {
    if (!isFirebaseConfigured() || !db) {
      console.warn('Firebase não está configurado');
      return [];
    }

    try {
      const q = query(collection(db, COLLECTION_NAME), where('userId', '==', userId));
      const querySnapshot = await getDocs(q);
      
      return querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Medication[];
    } catch (error: any) {
      console.error('Erro ao carregar medicamentos:', error);
      throw new Error(getFirestoreErrorMessage(error));
    }
  },

  // Obter apenas medicamentos ativos
  async getActiveMedications(userId: string): Promise<Medication[]> {
    const allMedications = await this.getUserMedications(userId);
    return allMedications.filter((med) => med.active);
  },
};
