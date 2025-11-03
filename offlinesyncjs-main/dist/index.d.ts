import { StorageAdapter } from './core/StorageAdapter';
import { PendingRequest } from './core/PendingRequest';
type OfflineSyncEvent = 'change' | 'synced' | 'syncFailed' | 'discarded';
type OfflineSyncCallback = (data?: any) => void;
/**
 * La interfaz de configuración ahora es genérica.
 * @template T El tipo de payload que se guardará (asume un PendingRequest).
 */
export interface OfflineSyncConfig<T extends PendingRequest> {
    storage?: StorageAdapter<T>;
    endpoint: string;
}
/**
 * Clase principal de la librería de sincronización.
 * @template T El tipo de payload (debe extender PendingRequest).
 */
export declare class OfflineSync<T extends PendingRequest> {
    private readonly config;
    private readonly network;
    private readonly storage;
    private readonly syncEngine;
    constructor(config: OfflineSyncConfig<T>);
    private setupListeners;
    /**
     * Guarda datos localmente y dispara la sincronización si está online.
     */
    save(data: T): Promise<IDBValidKey>;
    /**
     * Fuerza la sincronización inmediatamente.
     */
    syncNow(): Promise<void>;
    /**
     * Devuelve el estado de conectividad real.
     */
    isOnline(): boolean;
    /**
     * Wrapper para escuchar eventos importantes de la librería.
     */
    on(event: OfflineSyncEvent, callback: OfflineSyncCallback): void;
    /**
     * Helper privado para emitir eventos a través del NetworkManager.
     */
    private emit;
}
export {};
