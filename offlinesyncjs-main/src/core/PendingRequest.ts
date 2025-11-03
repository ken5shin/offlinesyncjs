// src/core/PendingRequest.ts (Asegúrate que se ve así)

// Definición de tipo para el cuerpo de la petición
export type RequestBody = { [key: string]: any } | string | FormData | null;

export interface PendingRequest {
    // Propiedades requeridas por la petición
    url: string;
    method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
    body: RequestBody; // Aquí usamos el tipo RequestBody
    
    // Propiedades internas del SyncEngine
    id?: IDBValidKey; 
    retries?: number; // Propiedad necesaria para el SyncEngine
    timestamp?: number;
    
    // Permite propiedades adicionales (como 'title', 'userId', etc.)
    [key: string]: any; 
}