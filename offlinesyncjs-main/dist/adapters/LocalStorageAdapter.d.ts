import { StorageAdapter } from '../core/StorageAdapter';
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
export declare class LocalStorageAdapter<T> implements StorageAdapter<T> {
    private readonly key;
    /**
     * @param key La clave bajo la cual se guardará la cola en LocalStorage.
     */
    constructor(key?: string);
    /**
     * Obtiene y parsea la cola desde localStorage.
     * Incluye auto-reparación si los datos están corruptos.
     */
    private getQueue;
    /**
     * Serializa y guarda la cola en localStorage.
     * Propaga errores si la escritura falla (ej. cuota excedida).
     */
    private setQueue;
    /**
     * Guarda un elemento en la cola.
     * @returns Resuelve con el nuevo índice del elemento como "key".
     */
    savePending(data: T): Promise<IDBValidKey>;
    /**
     * Obtiene todos los elementos sin eliminarlos (inspección).
     */
    peekPending(): Promise<T[]>;
    /**
     * Operación "pseudo-atómica": Obtiene todos los elementos Y limpia la cola.
     * Es atómica para este hilo, pero no entre pestañas.
     */
    dequeuePending(): Promise<T[]>;
    /**
     * Limpia la cola (elimina todos los elementos).
     */
    clear(): Promise<void>;
}
