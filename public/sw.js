// Service Worker para notificações em background
const CACHE_NAME = 'euGestante-v1';
const scheduledNotifications = new Map(); // Armazenar timeouts agendados

// Instalar Service Worker
self.addEventListener('install', (event) => {
  console.log('Service Worker instalado');
  self.skipWaiting();
});

// Ativar Service Worker
self.addEventListener('activate', (event) => {
  console.log('Service Worker ativado');
  event.waitUntil(self.clients.claim());
});

// Receber mensagens do cliente
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SCHEDULE_NOTIFICATION') {
    const { title, body, tag, scheduledTime } = event.data;
    scheduleNotificationInSW(title, body, tag, scheduledTime);
  } else if (event.data && event.data.type === 'CANCEL_NOTIFICATION') {
    const { tag } = event.data;
    cancelNotificationInSW(tag);
  }
});

// Agendar notificação no Service Worker
function scheduleNotificationInSW(title, body, tag, scheduledTime) {
  const now = Date.now();
  const delay = scheduledTime - now;

  if (delay <= 0) {
    // Horário já passou, não agendar
    return;
  }

  // Cancelar notificação anterior com a mesma tag, se existir
  if (scheduledNotifications.has(tag)) {
    clearTimeout(scheduledNotifications.get(tag));
  }

  // Usar setTimeout no Service Worker
  // Nota: Em alguns navegadores, setTimeout pode ser limitado quando o Service Worker está inativo
  // Mas funciona melhor que no contexto do navegador quando minimizado
  const timeoutId = setTimeout(() => {
    self.registration.showNotification(title, {
      body,
      tag,
      icon: '/euGestante-logo.png',
      badge: '/euGestante-logo.png',
      requireInteraction: false,
      vibrate: [200, 100, 200], // Vibrar em mobile
      data: {
        url: '/my-notes',
        timestamp: Date.now(),
      },
    });
    
    // Remover da lista após exibir
    scheduledNotifications.delete(tag);
  }, delay);

  scheduledNotifications.set(tag, timeoutId);
}

// Cancelar notificação agendada
function cancelNotificationInSW(tag) {
  if (scheduledNotifications.has(tag)) {
    clearTimeout(scheduledNotifications.get(tag));
    scheduledNotifications.delete(tag);
  }
}

// Clique na notificação
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      // Se já existe uma janela aberta, focar nela
      for (let i = 0; i < clientList.length; i++) {
        const client = clientList[i];
        if (client.url === '/' && 'focus' in client) {
          return client.focus();
        }
      }
      // Se não existe, abrir nova janela
      if (clients.openWindow) {
        return clients.openWindow('/my-notes');
      }
    })
  );
});
