/**
 * Define la estructura de una solicitud pendiente almacenada en la cola.
 * Los adaptadores (IndexedDB, LocalStorage) almacenarán objetos de este tipo.
 */
export interface PendingRequest {
    id?: IDBValidKey;
    url?: string;
    method?: 'POST' | 'PUT' | 'PATCH' | 'DELETE';
    body: any;
    metadata?: {
        retries: number;
        timestamp: number;
    };
    /**
     * 🔑 CORRECCIÓN: Índice de firma. Permite propiedades de datos de negocio
     * adicionales (como 'title' o 'userId') en el objeto que se guarda en la cola.
     * Resuelve el error de 'title' does not exist.
     */
    [key: string]: any;
}
