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

export interface BloodPressureRecord {
  id?: string;
  userId: string;
  date: string;
  pressure: string; // Formato: "120/80" ou similar
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
}

const COLLECTION_NAME = 'bloodPressureRecords';

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

export const bloodPressureService = {
  // Salvar novo registro de pressão arterial
  async saveRecord(userId: string, record: Omit<BloodPressureRecord, 'id' | 'userId' | 'createdAt' | 'updatedAt'>): Promise<string> {
    if (!isFirebaseConfigured() || !db) {
      throw new Error('Firebase não está configurado');
    }

    try {
      const recordData = {
        userId,
        ...record,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
      };

      const docRef = await addDoc(collection(db, COLLECTION_NAME), recordData);
      return docRef.id;
    } catch (error: any) {
      console.error('Erro ao salvar registro de pressão arterial:', error);
      throw new Error(getFirestoreErrorMessage(error));
    }
  },

  // Atualizar registro existente
  async updateRecord(recordId: string, record: Partial<Omit<BloodPressureRecord, 'id' | 'userId' | 'createdAt'>>): Promise<void> {
    if (!isFirebaseConfigured() || !db) {
      throw new Error('Firebase não está configurado');
    }

    try {
      const recordRef = doc(db, COLLECTION_NAME, recordId);
      await updateDoc(recordRef, {
        ...record,
        updatedAt: Timestamp.now(),
      });
    } catch (error: any) {
      console.error('Erro ao atualizar registro de pressão arterial:', error);
      throw new Error(getFirestoreErrorMessage(error));
    }
  },

  // Deletar registro
  async deleteRecord(recordId: string): Promise<void> {
    if (!isFirebaseConfigured() || !db) {
      throw new Error('Firebase não está configurado');
    }

    try {
      const recordRef = doc(db, COLLECTION_NAME, recordId);
      await deleteDoc(recordRef);
    } catch (error: any) {
      console.error('Erro ao deletar registro de pressão arterial:', error);
      throw new Error(getFirestoreErrorMessage(error));
    }
  },

  // Carregar todos os registros do usuário
  async getUserRecords(userId: string): Promise<BloodPressureRecord[]> {
    if (!isFirebaseConfigured() || !db) {
      console.warn('Firebase não está configurado, retornando array vazio');
      return [];
    }

    try {
      // Filtrar por userId, depois ordenar localmente
      const q = query(
        collection(db, COLLECTION_NAME),
        where('userId', '==', userId)
      );

      const querySnapshot = await getDocs(q);
      const records: BloodPressureRecord[] = [];

      querySnapshot.forEach((doc) => {
        const data = doc.data();
        records.push({
          id: doc.id,
          ...data,
        } as BloodPressureRecord);
      });

      // Ordenar por data (descendente) localmente
      records.sort((a, b) => {
        const dateA = new Date(a.date).getTime();
        const dateB = new Date(b.date).getTime();
        return dateB - dateA; // Descendente
      });

      return records;
    } catch (error: any) {
      console.error('Erro ao carregar registros de pressão arterial:', error);
      return [];
    }
  },
};
