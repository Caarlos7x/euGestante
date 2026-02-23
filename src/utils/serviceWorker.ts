// Utilitário para registrar e gerenciar Service Worker
import { logger } from './logger';

/**
 * Registra o Service Worker
 */
export async function registerServiceWorker(): Promise<ServiceWorkerRegistration | null> {
  if ('serviceWorker' in navigator) {
    try {
      const registration = await navigator.serviceWorker.register('/sw.js', {
        scope: '/',
      });
      
      logger.debug('Service Worker registrado com sucesso:', registration.scope);
      
      // Aguardar o Service Worker estar ativo
      if (registration.installing) {
        logger.debug('Service Worker instalando...');
      } else if (registration.waiting) {
        logger.debug('Service Worker aguardando...');
      } else if (registration.active) {
        logger.debug('Service Worker ativo');
      }
      
      return registration;
    } catch (error) {
      logger.error('Erro ao registrar Service Worker:', error);
      return null;
    }
  } else {
    logger.warn('Service Workers não são suportados neste navegador');
    return null;
  }
}

/**
 * Envia mensagem para o Service Worker agendar notificação
 */
export async function scheduleNotificationInSW(
  title: string,
  body: string,
  tag: string,
  scheduledTime: number
): Promise<boolean> {
  if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
    try {
      navigator.serviceWorker.controller.postMessage({
        type: 'SCHEDULE_NOTIFICATION',
        title,
        body,
        tag,
        scheduledTime,
      });
      return true;
    } catch (error) {
      logger.error('Erro ao enviar mensagem para Service Worker:', error);
      return false;
    }
  }
  return false;
}

/**
 * Cancela notificação no Service Worker
 */
export async function cancelNotificationInSW(tag: string): Promise<boolean> {
  if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
    try {
      navigator.serviceWorker.controller.postMessage({
        type: 'CANCEL_NOTIFICATION',
        tag,
      });
      return true;
    } catch (error) {
      logger.error('Erro ao cancelar notificação no Service Worker:', error);
      return false;
    }
  }
  return false;
}

/**
 * Verifica se Service Worker está disponível
 */
export function isServiceWorkerSupported(): boolean {
  return 'serviceWorker' in navigator;
}
