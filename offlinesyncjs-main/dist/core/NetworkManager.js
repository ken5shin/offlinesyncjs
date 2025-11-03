"use strict";
// src/core/NetworkManager.ts
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NetworkManager = void 0;
class NetworkManager {
    constructor(config = {}) {
        this.heartbeatTimer = null;
        this.listeners = {};
        // 🔑 CORRECCIÓN: Usamos una bandera para saber si estamos en un entorno de navegador
        this.isBrowser = typeof window !== 'undefined';
        // ... (handleBrowserStatusChange es funcional)
        this.handleBrowserStatusChange = () => {
            // Failsafe: esta función solo debería llamarse si estamos en el navegador
            if (!this.isBrowser)
                return;
            if (navigator.onLine) {
                this.startHeartbeat();
            }
            else {
                this.stopHeartbeat();
                this.updateStatus('offline');
            }
        };
        // ... (checkConnection, updateStatus, emit, on, off son funcionales)
        this.checkConnection = () => __awaiter(this, void 0, void 0, function* () {
            // Si no estamos en el navegador o navigator.onLine es falso, abortamos.
            if (!this.isBrowser || !navigator.onLine) {
                return this.handleBrowserStatusChange();
            }
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), this.config.requestTimeout);
            try {
                // Nota: Node.js debe tener polyfills para fetch si lo estás usando directamente.
                const response = yield fetch(this.config.heartbeatUrl, {
                    method: 'GET', signal: controller.signal, cache: 'no-cache',
                });
                this.updateStatus(response.ok ? 'online' : 'offline');
            }
            catch (error) {
                this.updateStatus('offline');
            }
            finally {
                clearTimeout(timeoutId);
            }
        });
        this.config = Object.assign(Object.assign({}, NetworkManager.defaultConfig), config);
        // 🔑 CORRECCIÓN: Inicializar el estado solo si 'window' existe
        this.status = this.isBrowser && navigator.onLine ? 'online' : 'offline';
        if (this.isBrowser) {
            // 🔑 CORRECCIÓN: Envolver el código dependiente de 'window' y 'navigator'
            window.addEventListener('online', this.handleBrowserStatusChange);
            window.addEventListener('offline', this.handleBrowserStatusChange);
            this.handleBrowserStatusChange();
        }
    }
    // ... (startHeartbeat, stopHeartbeat son funcionales)
    startHeartbeat() {
        if (!this.isBrowser)
            return; // No iniciar heartbeat fuera del navegador
        if (this.heartbeatTimer)
            return;
        this.checkConnection();
        this.heartbeatTimer = setInterval(this.checkConnection, this.config.heartbeatInterval);
    }
    stopHeartbeat() {
        if (this.heartbeatTimer) {
            clearInterval(this.heartbeatTimer);
            this.heartbeatTimer = null;
        }
    }
    updateStatus(newStatus) {
        if (this.status === newStatus)
            return;
        this.status = newStatus;
        console.log(`Network status changed to: ${newStatus}`);
        this.emit('change', newStatus);
        this.emit(newStatus, newStatus);
    }
    emit(event, data) {
        var _a;
        (_a = this.listeners[event]) === null || _a === void 0 ? void 0 : _a.forEach((callback) => {
            try {
                callback(data);
            }
            catch (error) {
                console.error('NetworkManager: Error en un callback de listener:', error);
            }
        });
    }
    on(event, callback) {
        if (!this.listeners[event])
            this.listeners[event] = [];
        this.listeners[event].push(callback);
    }
    off(event, callback) {
        if (this.listeners[event]) {
            this.listeners[event] = this.listeners[event].filter((cb) => cb !== callback);
        }
    }
    isOnline() {
        return this.status === 'online';
    }
}
exports.NetworkManager = NetworkManager;
NetworkManager.defaultConfig = {
    heartbeatUrl: 'https://1.1.1.1/cdn-cgi/trace',
    heartbeatInterval: 30000,
    requestTimeout: 5000,
};
//# sourceMappingURL=NetworkManager.js.map