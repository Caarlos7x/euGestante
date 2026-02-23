import {
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  getDocs,
  query,
  where,
  orderBy,
  Timestamp,
  FirestoreError,
} from 'firebase/firestore';
import { db } from '@/firebase/config';
import { isFirebaseConfigured } from '@/firebase/config';

export interface Appointment {
  id?: string;
  userId: string;
  title: string;
  date: string; // Formato: YYYY-MM-DD
  time: string; // Formato: HH:mm
  type: 'exame' | 'consulta';
  doctor?: string;
  doctorSpecialty?: string; // Especialidade do médico
  hospitalName?: string; // Nome do hospital/clínica
  address?: string; // Endereço completo
  location?: string; // Localização (pode ser o mesmo que hospitalName ou address)
  notes?: string; // Observações adicionais
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
}

const COLLECTION_NAME = 'appointments';

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

export const appointmentService = {
  // Salvar novo exame/consulta
  async saveAppointment(
    userId: string,
    appointment: Omit<Appointment, 'id' | 'userId' | 'createdAt' | 'updatedAt'>
  ): Promise<string> {
    if (!isFirebaseConfigured() || !db) {
      throw new Error('Firebase não está configurado');
    }

    try {
      const appointmentData = {
        userId,
        ...appointment,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
      };

      const docRef = await addDoc(collection(db, COLLECTION_NAME), appointmentData);
      return docRef.id;
    } catch (error: any) {
      console.error('Erro ao salvar exame/consulta:', error);
      throw new Error(getFirestoreErrorMessage(error));
    }
  },

  // Atualizar exame/consulta existente
  async updateAppointment(
    appointmentId: string,
    appointment: Partial<Omit<Appointment, 'id' | 'userId' | 'createdAt'>>
  ): Promise<void> {
    if (!isFirebaseConfigured() || !db) {
      throw new Error('Firebase não está configurado');
    }

    try {
      const docRef = doc(db, COLLECTION_NAME, appointmentId);
      await updateDoc(docRef, {
        ...appointment,
        updatedAt: Timestamp.now(),
      });
    } catch (error: any) {
      console.error('Erro ao atualizar exame/consulta:', error);
      throw new Error(getFirestoreErrorMessage(error));
    }
  },

  // Deletar exame/consulta
  async deleteAppointment(appointmentId: string): Promise<void> {
    if (!isFirebaseConfigured() || !db) {
      throw new Error('Firebase não está configurado');
    }

    try {
      const docRef = doc(db, COLLECTION_NAME, appointmentId);
      await deleteDoc(docRef);
    } catch (error: any) {
      console.error('Erro ao deletar exame/consulta:', error);
      throw new Error(getFirestoreErrorMessage(error));
    }
  },

  // Obter todos os exames/consultas do usuário
  async getUserAppointments(userId: string): Promise<Appointment[]> {
    if (!isFirebaseConfigured() || !db) {
      console.warn('Firebase não está configurado');
      return [];
    }

    try {
      // Tentar com orderBy primeiro (requer índice)
      const q = query(
        collection(db, COLLECTION_NAME),
        where('userId', '==', userId),
        orderBy('date', 'asc'),
        orderBy('time', 'asc')
      );
      const querySnapshot = await getDocs(q);

      return querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Appointment[];
    } catch (error: any) {
      // Se o erro for por falta de índice, buscar sem orderBy e ordenar manualmente
      if (error.code === 'failed-precondition' || error.message?.includes('index')) {
        console.warn('Índice não encontrado, buscando sem ordenação e ordenando manualmente...');
        try {
          const q = query(
            collection(db, COLLECTION_NAME),
            where('userId', '==', userId)
          );
          const querySnapshot = await getDocs(q);
          const appointments = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          })) as Appointment[];
          
          // Ordenar manualmente por data e depois por horário
          return appointments.sort((a, b) => {
            const dateCompare = a.date.localeCompare(b.date);
            if (dateCompare !== 0) return dateCompare;
            return a.time.localeCompare(b.time);
          });
        } catch (retryError: any) {
          console.error('Erro ao carregar exames/consultas:', retryError);
          throw new Error(getFirestoreErrorMessage(retryError));
        }
      }
      console.error('Erro ao carregar exames/consultas:', error);
      throw new Error(getFirestoreErrorMessage(error));
    }
  },

  // Obter próximos exames/consultas (futuros)
  async getUpcomingAppointments(userId: string, limit?: number): Promise<Appointment[]> {
    const allAppointments = await this.getUserAppointments(userId);
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    const upcoming = allAppointments.filter((appointment) => {
      const appointmentDate = new Date(appointment.date);
      return appointmentDate >= today;
    });

    if (limit) {
      return upcoming.slice(0, limit);
    }

    return upcoming;
  },
};
