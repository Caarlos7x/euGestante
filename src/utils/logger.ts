// Utilitário para logging condicional (apenas em desenvolvimento)

const isDevelopment = import.meta.env.DEV;

// Detectar Safari iOS para debug
const isSafariIOS = /iPhone|iPad|iPod/.test(navigator.userAgent) && /Safari/.test(navigator.userAgent) && !/Chrome|CriOS|FxiOS/.test(navigator.userAgent);

// Armazenar logs de debug para exibição na tela (apenas em Safari iOS ou desenvolvimento)
const debugLogs: string[] = [];
const MAX_DEBUG_LOGS = 20;

const addDebugLog = (message: string) => {
  const timestamp = new Date().toLocaleTimeString();
  const logMessage = `[${timestamp}] ${message}`;
  debugLogs.push(logMessage);
  if (debugLogs.length > MAX_DEBUG_LOGS) {
    debugLogs.shift();
  }
  // Em Safari iOS, sempre logar no console também
  if (isSafariIOS || isDevelopment) {
    console.log(`[DEBUG] ${logMessage}`);
  }
  // Forçar atualização do array para garantir que seja detectado
  if (isSafariIOS) {
    // Disparar evento customizado para forçar atualização
    try {
      window.dispatchEvent(new CustomEvent('debugLogUpdated'));
    } catch (e) {
      // Ignorar erro se não suportar
    }
  }
};

export const logger = {
  log: (...args: any[]) => {
    if (isDevelopment || isSafariIOS) {
      console.log(...args);
      addDebugLog(args.map(a => typeof a === 'object' ? JSON.stringify(a) : String(a)).join(' '));
    }
  },
  warn: (...args: any[]) => {
    if (isDevelopment || isSafariIOS) {
      console.warn(...args);
      addDebugLog(`WARN: ${args.map(a => typeof a === 'object' ? JSON.stringify(a) : String(a)).join(' ')}`);
    }
  },
  error: (...args: any[]) => {
    // Erros sempre são logados
    console.error(...args);
    addDebugLog(`ERROR: ${args.map(a => typeof a === 'object' ? JSON.stringify(a) : String(a)).join(' ')}`);
  },
  debug: (...args: any[]) => {
    if (isDevelopment || isSafariIOS) {
      console.log('[DEBUG]', ...args);
      addDebugLog(args.map(a => typeof a === 'object' ? JSON.stringify(a) : String(a)).join(' '));
    }
  },
  getDebugLogs: () => [...debugLogs],
  clearDebugLogs: () => {
    debugLogs.length = 0;
  },
};
