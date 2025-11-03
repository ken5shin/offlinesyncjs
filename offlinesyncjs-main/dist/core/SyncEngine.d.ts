import { StorageAdapter } from './StorageAdapter';
import { NetworkManager } from './NetworkManager';
import { PendingRequest } from './PendingRequest';
export declare class SyncEngine<T extends PendingRequest> {
    private readonly storage;
    private readonly network;
    private readonly syncEndpoint;
    constructor(storage: StorageAdapter<T>, network: NetworkManager, syncEndpoint: string);
    /**
     * 1. CORRECCIÓN: Implementación del método handleNetworkStatusChange.
     * Maneja el cambio de estado de la red.
     */
    private handleNetworkStatusChange;
    /**
     * Intenta enviar una sola solicitud pendiente al servidor.
     * @returns true si el envío fue exitoso y el elemento puede ser eliminado.
     */
    private attemptSend;
    /**
     * Ejecuta el proceso de sincronización (lógica atómica).
     */
    sync(): Promise<void>;
}
