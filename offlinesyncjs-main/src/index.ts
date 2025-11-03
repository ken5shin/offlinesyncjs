// src/index.ts

import { PendingRequest } from "./core/PendingRequest";
import { NetworkManager, NetworkManagerConfig, NetworkCallback } from "./core/NetworkManager";
import { SyncEngine } from "./core/SyncEngine";
import { StorageAdapter } from "./core/StorageAdapter";

/**
 * Tipo para un constructor genérico de StorageAdapter que acepta un parámetro genérico U.
 * Esto permite hacer: new IndexedDBAdapter<T>()
 */
type StorageAdapterCtor = new <U extends PendingRequest>() => StorageAdapter<U>;

// Adaptadores de Almacenamiento (constructores)
let IndexedDBAdapter: StorageAdapterCtor | undefined;
let LocalStorageAdapter: StorageAdapterCtor | undefined;

// Detectar entorno de ejecución (navegador o Node con polyfills)
const hasStorageEnvironment = typeof window !== "undefined"
    || (typeof globalThis !== "undefined" && (
        "indexedDB" in (globalThis as any) ||
        "localStorage" in (globalThis as any)
    ));

// Intentar cargar los adaptadores si el entorno lo permite
if (hasStorageEnvironment) {
    try {
        const mod = require('./adapters/IndexedDBAdapter');
        // Si el módulo exporta la clase IndexedDBAdapter:
        if (mod && typeof mod.IndexedDBAdapter === 'function') {
            IndexedDBAdapter = mod.IndexedDBAdapter as StorageAdapterCtor;
        }
    } catch (e) {
        // no hay IndexedDB adapter disponible — ok
    }

    try {
        const mod = require('./adapters/LocalStorageAdapter');
        if (mod && typeof mod.LocalStorageAdapter === 'function') {
            LocalStorageAdapter = mod.LocalStorageAdapter as StorageAdapterCtor;
        }
    } catch (e) {
        // no hay LocalStorage adapter disponible — ok
    }
}

export interface OfflineSyncConfig<T extends PendingRequest> extends NetworkManagerConfig {
    endpoint: string;
    maxRetries?: number;
    storage?: StorageAdapter<T>;
}

/**
 * 💡 Clase principal para gestionar la sincronización offline.
 * @template T - El tipo de dato a guardar, debe extender PendingRequest.
 */
export class OfflineSync<T extends PendingRequest> {
    private network: NetworkManager;
    private syncEngine: SyncEngine<T>;
    private storage: StorageAdapter<T>;

    constructor(config: OfflineSyncConfig<T>) {
        this.network = new NetworkManager(config);

        let defaultStorage: StorageAdapter<T> | undefined = config.storage;

        if (!defaultStorage) {
            // Elegir adaptador por defecto si existe en runtime
            if (hasStorageEnvironment) {
                if (IndexedDBAdapter) {
                    // Ahora IndexedDBAdapter tiene un tipo de constructor genérico,
                    // por eso esta llamada con <T> ya es válida.
                    defaultStorage = new IndexedDBAdapter<T>();
                } else if (LocalStorageAdapter) {
                    defaultStorage = new LocalStorageAdapter<T>();
                }
            }
        }

        if (!defaultStorage) {
            console.warn(
                'OfflineSync: No se inicializó ningún StorageAdapter. ' +
                'Asegúrate de inyectar uno (ej. MemoryAdapter) en entornos de prueba.'
            );
            // Para evitar problemas posteriores, crear un "stub" mínimo podría ser buena idea,
            // pero aquí mantenemos undefined y casteamos más abajo.
        }

        this.storage = defaultStorage as StorageAdapter<T>;

        // Inicializar SyncEngine con la configuración necesaria
        this.syncEngine = new SyncEngine<T>({
            network: this.network,
            storage: this.storage,
            endpoint: config.endpoint,
            maxRetries: config.maxRetries,
        });

        // Iniciar el SyncEngine para que escuche los cambios de red
        this.syncEngine.init();
    }

    /**
     * Guarda una solicitud para ser sincronizada más tarde.
     */
    async save(data: T): Promise<number | IDBValidKey> {
        if (!this.storage) {
            console.error("No se pudo guardar: No se inicializó ningún StorageAdapter.");
            return Promise.reject(new Error("No StorageAdapter initialized."));
        }

        if (this.network.isOnline()) {
            console.log('Online. Intentando envío inmediato...');
        }

        const key = await this.storage.savePending(data);
        console.log(`Petición guardada con clave: ${key}`);

        this.syncEngine.sync();

        return key;
    }

    /**
     * Suscribe una función a eventos específicos.
     * @param event - El evento a escuchar ('synced', 'syncFailed', 'online', 'offline', etc.)
     * @param callback - La función a ejecutar.
     */
    on(event: string, callback: NetworkCallback): void {
        this.network.on(event, (data: any) => {
            callback(data);
        });
    }

    /**
     * Remueve una función de eventos específicos.
     */
    off(event: string, callback: NetworkCallback): void {
        this.network.off(event, callback);
    }
}
