// Utilitário para gerenciar notificações do navegador
import { scheduleNotificationInSW, cancelNotificationInSW, isServiceWorkerSupported } from './serviceWorker';

export interface NotificationPermission {
  granted: boolean;
  denied: boolean;
  default: boolean;
}

/**
 * Solicita permissão para notificações
 */
export async function requestNotificationPermission(): Promise<NotificationPermission> {
  if (!('Notification' in window)) {
    console.warn('Este navegador não suporta notificações');
    return { granted: false, denied: false, default: false };
  }

  if (Notification.permission === 'granted') {
    return { granted: true, denied: false, default: false };
  }

  if (Notification.permission === 'denied') {
    return { granted: false, denied: true, default: false };
  }

  // Permission é 'default', solicitar permissão
  const permission = await Notification.requestPermission();
  
  return {
    granted: permission === 'granted',
    denied: permission === 'denied',
    default: permission === 'default',
  };
}

/**
 * Verifica se as notificações estão habilitadas
 */
export function isNotificationEnabled(): boolean {
  return 'Notification' in window && Notification.permission === 'granted';
}

/**
 * Exibe uma notificação
 */
export function showNotification(title: string, options?: NotificationOptions): Notification | null {
  if (!isNotificationEnabled()) {
    console.warn('Notificações não estão habilitadas');
    return null;
  }

  try {
    const notification = new Notification(title, {
      icon: '/euGestante-logo.png',
      badge: '/euGestante-logo.png',
      requireInteraction: false,
      ...options,
    });

    // Fechar automaticamente após 5 segundos
    setTimeout(() => {
      notification.close();
    }, 5000);

    return notification;
  } catch (error) {
    console.error('Erro ao exibir notificação:', error);
    return null;
  }
}

/**
 * Agenda uma notificação para um horário específico
 * Tenta usar Service Worker primeiro (funciona em background), depois fallback para setTimeout
 */
export async function scheduleNotification(
  title: string,
  scheduledTime: Date,
  options?: NotificationOptions
): Promise<number | null> {
  if (!isNotificationEnabled()) {
    console.warn('Notificações não estão habilitadas');
    return null;
  }

  const now = new Date();
  const delay = scheduledTime.getTime() - now.getTime();

  if (delay <= 0) {
    // Horário já passou, não agendar
    return null;
  }

  const tag = options?.tag || `notification-${Date.now()}`;
  const body = options?.body || '';

  // Tentar usar Service Worker primeiro (funciona melhor em background/mobile)
  if (isServiceWorkerSupported()) {
    const scheduled = await scheduleNotificationInSW(
      title,
      body,
      tag,
      scheduledTime.getTime()
    );
    
    if (scheduled) {
      // Retornar um ID simbólico para controle
      return scheduledTime.getTime() as unknown as number;
    }
  }

  // Fallback: usar setTimeout (funciona quando a aba está aberta)
  const timeoutId = window.setTimeout(() => {
    showNotification(title, options);
  }, delay);

  return timeoutId;
}

/**
 * Cancela uma notificação agendada
 */
export function cancelScheduledNotification(timeoutId: number, tag?: string): void {
  // Se tiver tag, tentar cancelar no Service Worker
  if (tag && isServiceWorkerSupported()) {
    cancelNotificationInSW(tag);
  }
  
  // Cancelar timeout também
  window.clearTimeout(timeoutId);
}
