"use strict";
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
exports.LocalStorageAdapter = void 0;
/**
 * Una implementación de StorageAdapter que usa la API síncrona de LocalStorage.
 *
 * NOTA: LocalStorage es síncrono (bloquea el hilo principal), tiene un
 * límite de tamaño pequeño (~5MB) y no es verdaderamente atómico entre
 * pestañas. Debería usarse principalmente como un fallback si IndexedDB no
 * está disponible.
 *
 * @template T El tipo de datos que se almacenará en la cola.
 */
class LocalStorageAdapter {
    /**
     * @param key La clave bajo la cual se guardará la cola en LocalStorage.
     */
    constructor(key = 'OfflineSyncQueue') {
        this.key = key;
    }
    /**
     * Obtiene y parsea la cola desde localStorage.
     * Incluye auto-reparación si los datos están corruptos.
     */
    getQueue() {
        try {
            const rawData = localStorage.getItem(this.key);
            // Si hay datos, los parsea; de lo contrario, devuelve un array vacío.
            return rawData ? JSON.parse(rawData) : [];
        }
        catch (error) {
            console.error('LocalStorageAdapter: Fallo al parsear la cola. Limpiando datos corruptos.', error);
            // Auto-reparación: si los datos son inválidos, limpia la clave.
            localStorage.removeItem(this.key);
            return [];
        }
    }
    /**
     * Serializa y guarda la cola en localStorage.
     * Propaga errores si la escritura falla (ej. cuota excedida).
     */
    setQueue(data) {
        try {
            localStorage.setItem(this.key, JSON.stringify(data));
        }
        catch (e) {
            console.error('LocalStorageAdapter: Fallo al guardar en localStorage. El almacenamiento puede estar lleno.', e);
            // Propaga el error para que la promesa de quien llamó sea rechazada.
            throw new Error('LocalStorage quota exceeded or write failed.');
        }
    }
    // --- Implementación de la Interfaz StorageAdapter ---
    /**
     * Guarda un elemento en la cola.
     * @returns Resuelve con el nuevo índice del elemento como "key".
     */
    savePending(data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const currentQueue = this.getQueue();
                currentQueue.push(data);
                this.setQueue(currentQueue);
                // Devolvemos el nuevo índice como "IDBValidKey" (un número)
                return currentQueue.length - 1;
            }
            catch (error) {
                // Si setQueue falla (ej. cuota excedida), la promesa será rechazada.
                return Promise.reject(error);
            }
        });
    }
    /**
     * Obtiene todos los elementos sin eliminarlos (inspección).
     */
    peekPending() {
        return __awaiter(this, void 0, void 0, function* () {
            // getQueue es síncrono, pero lo devolvemos como una promesa
            // que se resuelve inmediatamente.
            return this.getQueue();
        });
    }
    /**
     * Operación "pseudo-atómica": Obtiene todos los elementos Y limpia la cola.
     * Es atómica para este hilo, pero no entre pestañas.
     */
    dequeuePending() {
        return __awaiter(this, void 0, void 0, function* () {
            // 1. Leer la cola actual
            const currentQueue = this.getQueue();
            // 2. Limpiar el almacenamiento (sincrónicamente)
            localStorage.removeItem(this.key);
            // 3. Devolver los elementos que se leyeron
            return currentQueue;
        });
    }
    /**
     * Limpia la cola (elimina todos los elementos).
     */
    clear() {
        return __awaiter(this, void 0, void 0, function* () {
            localStorage.removeItem(this.key);
            // No necesitamos devolver nada, pero cumplimos con la firma de la promesa
            return Promise.resolve();
        });
    }
}
exports.LocalStorageAdapter = LocalStorageAdapter;
//# sourceMappingURL=LocalStorageAdapter.js.map