// src/core/NetworkManager.ts

type NetworkStatus = 'online' | 'offline';
export type NetworkCallback = (data?: any) => void;

export interface NetworkManagerConfig {
  heartbeatUrl?: string;
  heartbeatInterval?: number;
  requestTimeout?: number;
}

export class NetworkManager {
  private status: NetworkStatus;
  private config: Required<NetworkManagerConfig>;
  private heartbeatTimer: any = null;
  private listeners: { [key: string]: NetworkCallback[] } = {}; 
  
  // Usamos una bandera para saber si estamos en un entorno de navegador
  private isBrowser: boolean = typeof window !== 'undefined'; 

  private static readonly defaultConfig: Required<NetworkManagerConfig> = {
    heartbeatUrl: 'https://1.1.1.1/cdn-cgi/trace',
    heartbeatInterval: 30_000,
    requestTimeout: 5_000,
  };

  constructor(config: NetworkManagerConfig = {}) {
    this.config = { ...NetworkManager.defaultConfig, ...config };
    
    // Inicializar el estado solo si 'window' existe
    // Nota: 'navigator.onLine' debe ser polyfilled o simulado en Node.js
    this.status = this.isBrowser && (typeof navigator !== 'undefined' && navigator.onLine) ? 'online' : 'offline';

    if (this.isBrowser) {
        // Envolver el código dependiente de 'window' y 'navigator'
        window.addEventListener('online', this.handleBrowserStatusChange);
        window.addEventListener('offline', this.handleBrowserStatusChange);
        this.handleBrowserStatusChange();
    }
  }

  // --- Métodos de Control de Red ---

  private handleBrowserStatusChange = () => {
    // Failsafe: esta función solo debería llamarse si estamos en el navegador
    if (!this.isBrowser) return; 

    // Aquí ya comprobamos que navigator existe gracias al 'if (this.isBrowser)'
    if (navigator.onLine) {
      this.startHeartbeat();
    } else {
      this.stopHeartbeat();
      this.updateStatus('offline');
    }
  };
  
  private startHeartbeat() {
    if (!this.isBrowser) return; 
    if (this.heartbeatTimer) return;
    this.checkConnection();
    this.heartbeatTimer = setInterval(
      this.checkConnection,
      this.config.heartbeatInterval,
    );
  }

  private stopHeartbeat() {
    if (this.heartbeatTimer) {
      clearInterval(this.heartbeatTimer);
      this.heartbeatTimer = null;
    }
  }

  private checkConnection = async () => {
    // Si no estamos en el navegador o navigator.onLine es falso, abortamos.
    if (!this.isBrowser || !navigator.onLine) {
      return this.handleBrowserStatusChange();
    }

    // Nota: 'fetch' y 'AbortController' deben ser polyfilled o simulados en Node.js
    const controller = new AbortController(); 
    const timeoutId = setTimeout(() => controller.abort(), this.config.requestTimeout);

    try {
      const response = await fetch(this.config.heartbeatUrl, {
        method: 'GET', signal: controller.signal, cache: 'no-cache',
      });
      this.updateStatus(response.ok ? 'online' : 'offline');
    } catch (error) {
      this.updateStatus('offline');
    } finally {
      clearTimeout(timeoutId);
    }
  };

  private updateStatus(newStatus: NetworkStatus) {
    if (this.status === newStatus) return;
    this.status = newStatus;
    console.log(`Network status changed to: ${newStatus}`);
    
    // 🔑 CORRECCIÓN: Llamada correcta a emit con evento y datos
    this.emit('change', newStatus); 
    this.emit(newStatus, newStatus); 
  }

  public isOnline(): boolean {
    return this.status === 'online';
  }

  // --- Métodos de Eventos ---

  // 🔑 CORRECCIÓN: Este método debe ser público para que SyncEngine pueda llamarlo.
  // Ya era público en el código que me pasaste, lo mantengo.
  public emit(event: string, data?: any) {
    this.listeners[event]?.forEach((callback) => {
      try {
        callback(data);
      } catch (error) {
        console.error('NetworkManager: Error en un callback de listener:', error);
      }
    });
  }

  public on(event: string, callback: NetworkCallback) {
    if (!this.listeners[event]) this.listeners[event] = [];
    this.listeners[event].push(callback);
  }

  public off(event: string, callback: NetworkCallback) {
    if (this.listeners[event]) {
      this.listeners[event] = this.listeners[event].filter((cb) => cb !== callback);
    }
  }
}