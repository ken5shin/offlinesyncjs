"use strict";
// src/index.ts
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
exports.OfflineSync = void 0;
const NetworkManager_1 = require("./core/NetworkManager");
const LocalStorageAdapter_1 = require("./adapters/LocalStorageAdapter");
const IndexedDBAdapter_1 = require("./adapters/IndexedDBAdapter");
const SyncEngine_1 = require("./core/SyncEngine");
/**
 * Clase principal de la librería de sincronización.
 * @template T El tipo de payload (debe extender PendingRequest).
 */
class OfflineSync {
    constructor(config) {
        this.config = config;
        this.network = new NetworkManager_1.NetworkManager();
        // Lógica de inyección y default (IndexedDB preferido)
        let defaultStorage;
        if (typeof window !== 'undefined' && window.indexedDB) {
            defaultStorage = new IndexedDBAdapter_1.IndexedDBAdapter();
        }
        else {
            defaultStorage = new LocalStorageAdapter_1.LocalStorageAdapter();
        }
        this.storage = config.storage || defaultStorage;
        this.syncEngine = new SyncEngine_1.SyncEngine(this.storage, this.network, config.endpoint);
        this.setupListeners();
    }
    setupListeners() {
        this.network.on('change', (status) => {
            if (status === 'offline') {
                console.log('⚠️ Modo offline (Conexión real perdida)');
            }
        });
        // Reenvío de eventos del SyncEngine a través del NetworkManager
        // 🔑 CORRECCIÓN: Tipado explícito de 'data' como 'any' para resolver ts(7006)
        this.network.on('synced', (data) => this.emit('synced', data));
        this.network.on('syncFailed', (data) => this.emit('syncFailed', data));
        this.network.on('discarded', (data) => this.emit('discarded', data));
    }
    /**
     * Guarda datos localmente y dispara la sincronización si está online.
     */
    save(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const key = yield this.storage.savePending(data);
            console.log(`💾 Guardado localmente con ID ${key}.`);
            if (this.network.isOnline()) {
                this.syncEngine.sync();
            }
            return key;
        });
    }
    /**
     * Fuerza la sincronización inmediatamente.
     */
    syncNow() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.network.isOnline()) {
                console.log('⚡️ Sincronización manual forzada...');
                yield this.syncEngine.sync();
            }
            else {
                console.log('⚠️ No se puede sincronizar: Conexión no disponible.');
            }
        });
    }
    /**
     * Devuelve el estado de conectividad real.
     */
    isOnline() {
        return this.network.isOnline();
    }
    /**
     * Wrapper para escuchar eventos importantes de la librería.
     */
    on(event, callback) {
        this.network.on(event, callback);
    }
    /**
     * Helper privado para emitir eventos a través del NetworkManager.
     */
    emit(event, data) {
        this.network.emit(event, data);
    }
}
exports.OfflineSync = OfflineSync;
//# sourceMappingURL=index.js.map