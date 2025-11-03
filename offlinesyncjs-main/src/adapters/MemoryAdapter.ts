// src/adapters/MemoryAdapter.ts

import { StorageAdapter } from '../core/StorageAdapter';
import { PendingRequest } from '../core/PendingRequest';

/**
 * Adaptador de almacenamiento en memoria (RAM). 
 * Ideal para pruebas unitarias y entornos Node.js.
 */
export class MemoryAdapter<T extends PendingRequest> implements StorageAdapter<T> {
  // Utilizamos un array simple para simular la cola
  private queue: T[] = [];
  private currentId: number = 1;

  async savePending(data: T): Promise<IDBValidKey> {
    data.id = this.currentId++;
    this.queue.push(data);
    return Promise.resolve(data.id);
  }

  async peekPending(): Promise<T[]> {
    return Promise.resolve([...this.queue]); // Devuelve una copia
  }

  async dequeuePending(): Promise<T[]> {
    const items = [...this.queue];
    this.queue = []; // Vacía la cola
    return Promise.resolve(items);
  }

  async clear(): Promise<void> {
    this.queue = [];
    this.currentId = 1;
    return Promise.resolve();
  }
}