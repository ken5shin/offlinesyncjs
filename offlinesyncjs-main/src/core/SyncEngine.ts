// src/core/SyncEngine.ts

import { NetworkManager } from './NetworkManager';
import { StorageAdapter } from './StorageAdapter';
import { PendingRequest, RequestBody } from './PendingRequest';

export interface SyncEngineConfig<T extends PendingRequest> {
    network: NetworkManager;
    storage: StorageAdapter<T>;
    endpoint: string;
    maxRetries?: number;
}

export class SyncEngine<T extends PendingRequest> {
    private network: NetworkManager;
    private storage: StorageAdapter<T>;
    private endpoint: string;
    private maxRetries: number;
    private isSyncing: boolean = false;
    private readonly defaultMaxRetries: number = 3;

    // 🔑 CORRECCIÓN 1: Asegurar que el constructor acepta todos los argumentos del config.
    constructor(config: SyncEngineConfig<T>) {
        this.network = config.network;
        this.storage = config.storage;
        this.endpoint = config.endpoint;
        this.maxRetries = config.maxRetries ?? this.defaultMaxRetries;
    }

    // 🔑 CORRECCIÓN 3: Implementar el método 'init' que faltaba.
    public init(): void {
        this.network.on('online', this.handleOnline);
        console.log('SyncEngine inicializado. Escuchando cambios de red.');
    }

    /**
     * Listener llamado cuando la red pasa a estar 'online'.
     */
    private handleOnline = () => {
        if (!this.isSyncing) {
            this.sync();
        }
    }

    /**
     * Procesa la cola de peticiones pendientes.
     */
    public async sync(): Promise<void> {
        if (this.isSyncing || !this.network.isOnline()) {
            return;
        }

        this.isSyncing = true;
        console.log('🌐 Iniciando sincronización de cola pendiente...');

        try {
            const items = await this.storage.peekPending();
            if (items.length === 0) {
                console.log('✅ Cola pendiente vacía. Sincronización terminada.');
                this.isSyncing = false;
                return;
            }

            const succeeded: T[] = [];
            const failed: T[] = [];
            
            for (const item of items) {
                try {
                    await this.sendRequest(item);
                    succeeded.push(item);
                } catch (error) {
                    failed.push(item);
                }
            }

            if (succeeded.length > 0) {
                // Si la sincronización fue exitosa, vaciamos la cola solo de los elementos exitosos.
                await this.removeSuccessfulItems(succeeded);
                this.handleSyncSuccess(succeeded);
            }
            
            if (failed.length > 0) {
                // Manejar reintentos y descarte de fallidos.
                this.handleSyncFailure(failed);
            }

        } catch (storageError) {
            console.error('❌ Error fatal al acceder al almacenamiento:', storageError);
            this.network.emit('syncError', storageError);
        } finally {
            this.isSyncing = false;
        }
    }
    
    /**
     * Envía una petición individual a la red.
     */
    private async sendRequest(item: T): Promise<void> {
        const url = item.url || this.endpoint;
        const method = item.method || 'POST';
        const body = item.body;
        
        // 🔑 NOTA: Node.js necesita 'node-fetch' (polyfill) para que 'fetch' funcione.
        const response = await fetch(url, {
            method: method,
            headers: {
                'Content-Type': 'application/json',
                // Agregar encabezados de autenticación si es necesario
            },
            body: JSON.stringify(body),
        });

        if (!response.ok) {
            throw new Error(`Request failed with status: ${response.status}`);
        }
    }

    /**
     * Remueve los items sincronizados de la cola.
     */
    private async removeSuccessfulItems(succeeded: T[]): Promise<void> {
        // En un escenario real, harías un 'dequeue' solo de los items exitosos
        // Para simplicidad, si la mayoría tuvo éxito, limpiamos toda la cola actual y re-guardamos los fallidos.
        // Una implementación más robusta es mejor, pero para este código:
        
        // 1. Obtener la cola actual (incluyendo los fallidos)
        const currentItems = await this.storage.peekPending();
        
        // 2. Filtrar solo los que NO tuvieron éxito
        const itemsToKeep = currentItems.filter(item => !succeeded.some(s => s.id === item.id));

        // 3. Limpiar el almacenamiento y guardar solo los que fallaron
        await this.storage.clear();
        for (const item of itemsToKeep) {
            await this.storage.savePending(item);
        }
    }
    
    /**
     * Emite evento de éxito de sincronización.
     */
    private handleSyncSuccess(succeeded: T[]) {
        console.log(`✅ Sincronización exitosa. Items: ${succeeded.length}`);
        // 🔑 CORRECCIÓN 4: Llamada correcta a emit (evento, data)
        this.network.emit('synced', { success: succeeded }); 
    }

    /**
     * Maneja fallas, incrementando el contador de reintentos.
     */
    private handleSyncFailure(failed: T[]) {
        const discarded: T[] = [];
        
        failed.forEach(item => {
            item.retries = (item.retries || 0) + 1;
            if (item.retries > this.maxRetries) {
                discarded.push(item);
                // 🔑 En un proyecto real, se podría mover a una cola 'discarded'
            } else {
                // Actualizar el item para reintentar (requiere un método update en StorageAdapter)
                // Para este ejemplo, solo emitimos el error.
            }
        });
        
        console.error(`❌ Fallo en la sincronización. Fallidos: ${failed.length}, Descartados: ${discarded.length}`);
        
        if (failed.length > 0) {
            // 🔑 CORRECCIÓN 5: Llamada correcta a emit (evento, data)
            this.network.emit('syncFailed', { failed: failed }); 
        }

        if (discarded.length > 0) {
            // 🔑 CORRECCIÓN 6: Llamada correcta a emit (evento, data)
            this.network.emit('discarded', { discarded: discarded }); 
        }
    }
}