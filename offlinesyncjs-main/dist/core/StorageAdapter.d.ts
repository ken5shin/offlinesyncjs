/**
 * Define una interfaz genérica para cualquier adaptador de almacenamiento
 * de la cola de sincronización.
 *
 * @template T El tipo de datos (payload) que se almacenará en la cola.
 */
export interface StorageAdapter<T> {
    /**
     * Guarda un elemento de datos en la cola pendiente.
     *
     * @param data El objeto de datos (payload) a guardar.
     * @returns Una promesa que se resuelve con la clave (ID) del elemento guardado.
     * (En IndexedDB es la ID generada; en LocalStorage es el índice).
     */
    savePending(data: T): Promise<IDBValidKey>;
    /**
     * Obtiene (pero no elimina) todos los elementos pendientes.
     * Se utiliza principalmente para inspeccionar el contenido de la cola.
     *
     * @returns Una promesa que se resuelve con un array de todos los elementos pendientes.
     */
    peekPending(): Promise<T[]>;
    /**
     * Obtiene y elimina atómicamente todos los elementos pendientes de la cola.
     * Esta es la operación crítica de "desencolamiento" (dequeue) y asegura
     * que los datos no se pierdan o dupliquen durante el proceso de sincronización.
     *
     * @returns Una promesa que se resuelve con un array de los elementos que fueron eliminados.
     */
    dequeuePending(): Promise<T[]>;
    /**
     * Limpia todo el almacenamiento, eliminando todos los elementos de la cola.
     *
     * @returns Una promesa que se resuelve cuando el almacenamiento está vacío.
     */
    clear(): Promise<void>;
}
