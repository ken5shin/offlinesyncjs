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
exports.SyncEngine = void 0;
// Un motor de sincronización profesional debe ser genérico
class SyncEngine {
    // Las dependencias inyectadas son privadas y de solo lectura (read-only).
    constructor(storage, network, syncEndpoint) {
        this.storage = storage;
        this.network = network;
        this.syncEndpoint = syncEndpoint;
        // Escucha el evento 'change' del NetworkManager
        // CORRECCIÓN: Se añade el tipo explícito 'status: "online" | "offline"' al parámetro
        // para resolver el error ts(7006).
        this.network.on('change', (status) => this.handleNetworkStatusChange(status));
    }
    /**
     * 1. CORRECCIÓN: Implementación del método handleNetworkStatusChange.
     * Maneja el cambio de estado de la red.
     */
    handleNetworkStatusChange(status) {
        if (status === 'online') {
            console.log('🌐 Conexión reestablecida. Iniciando sincronización...');
            // Dispara la sincronización asíncronamente para no bloquear el hilo
            setTimeout(() => this.sync(), 100);
        }
    }
    /**
     * Intenta enviar una sola solicitud pendiente al servidor.
     * @returns true si el envío fue exitoso y el elemento puede ser eliminado.
     */
    attemptSend(item) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // 2. CORRECCIÓN: Agregar la llamada a fetch y declarar 'response'.
                const response = yield fetch(item.url || this.syncEndpoint, {
                    method: item.method || 'POST', // Asume POST si no se especifica
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(item.body),
                });
                if (response.ok) {
                    return true; // Éxito
                }
                // Manejo inteligente de errores de servidor
                if (response.status >= 400 && response.status < 500) {
                    // Errores de cliente (4xx). El elemento es "venenoso" y debe descartarse.
                    console.error(`❌ Error de cliente (${response.status}) para el item ${item.id}. Descartando.`);
                    // La llamada a this.network.emit() ahora funciona si emit es público.
                    this.network.emit('discarded', item);
                    return true; // Eliminar de la cola local
                }
                // Errores de servidor (5xx) o fallos de red desconocidos
                throw new Error(`Error HTTP: ${response.status}`);
            }
            catch (err) {
                console.error(`❌ Fallo al enviar item ${item.id}:`, err);
                // Falla, no debe eliminarse de la cola.
                return false;
            }
        });
    }
    /**
     * Ejecuta el proceso de sincronización (lógica atómica).
     */
    sync() {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            if (!this.network.isOnline()) {
                console.warn('⚠️ Sincronización pospuesta: La red no está disponible.');
                return;
            }
            // 1. ATOMICIDAD: Leer la cola Y vaciarla en una única transacción.
            const itemsToSync = yield this.storage.dequeuePending();
            if (itemsToSync.length === 0) {
                console.log('✅ La cola de sincronización está vacía.');
                return;
            }
            console.log(`🔄 Sincronizando ${itemsToSync.length} elementos...`);
            const successfullySynced = [];
            const failedItems = [];
            for (const item of itemsToSync) {
                const sentSuccessfully = yield this.attemptSend(item);
                if (sentSuccessfully) {
                    successfullySynced.push(item);
                }
                else {
                    // 2. TOLERANCIA A FALLOS: Almacenar elementos fallidos para reintentar
                    // Actualizamos el contador de reintentos antes de devolverlo a la cola.
                    item.metadata = {
                        retries: (((_a = item.metadata) === null || _a === void 0 ? void 0 : _a.retries) || 0) + 1,
                        timestamp: ((_b = item.metadata) === null || _b === void 0 ? void 0 : _b.timestamp) || Date.now()
                    };
                    failedItems.push(item);
                }
            }
            // 3. REINYECCIÓN: Devolvemos los elementos fallidos a la cola.
            if (failedItems.length > 0) {
                console.warn(`⚠️ ${failedItems.length} elementos fallaron. Reinsertando en la cola para el próximo intento.`);
                for (const item of failedItems) {
                    yield this.storage.savePending(item);
                }
            }
            // 4. EMISIÓN DE EVENTOS (Ahora funciona si NetworkManager.emit es público)
            if (successfullySynced.length > 0) {
                console.log(`✅ Sincronización parcial completa. Éxito: ${successfullySynced.length}, Fallo: ${failedItems.length}.`);
                this.network.emit('synced', { success: successfullySynced, failed: failedItems });
            }
            else if (failedItems.length > 0) {
                this.network.emit('syncFailed', failedItems);
            }
        });
    }
}
exports.SyncEngine = SyncEngine;
//# sourceMappingURL=SyncEngine.js.map