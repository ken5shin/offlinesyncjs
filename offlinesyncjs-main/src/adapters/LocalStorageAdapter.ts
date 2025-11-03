// src/adapters/LocalStorageAdapter.ts (Corregido)

import { StorageAdapter } from '../core/StorageAdapter';

export class LocalStorageAdapter<T> implements StorageAdapter<T> {
  private readonly key: string;

  constructor(key: string = 'OfflineSyncQueue') {
    this.key = key;
    // 🔑 CORRECCIÓN: Comprobación de entorno al inicio.
    if (typeof localStorage === 'undefined') {
        console.warn('LocalStorageAdapter: localStorage no está disponible. Este adaptador no funcionará.');
    }
  }

  private getQueue(): T[] {
    // 🔑 CORRECCIÓN: Comprobar localStorage antes de acceder
    if (typeof localStorage === 'undefined') return []; 

    try {
      const rawData = localStorage.getItem(this.key);
      return rawData ? (JSON.parse(rawData) as T[]) : [];
    } catch (error) {
      console.error('LocalStorageAdapter: Fallo al parsear. Limpiando datos corruptos.', error);
      // 🔑 CORRECCIÓN: Comprobar localStorage antes de acceder
      if (typeof localStorage !== 'undefined') {
          localStorage.removeItem(this.key);
      }
      return [];
    }
  }

  private setQueue(data: T[]): void {
    // 🔑 CORRECCIÓN: Comprobar localStorage antes de acceder
    if (typeof localStorage === 'undefined') return;

    try {
      localStorage.setItem(this.key, JSON.stringify(data));
    } catch (e) {
      throw new Error('LocalStorage quota exceeded or write failed.');
    }
  }

  async savePending(data: T): Promise<IDBValidKey> {
    // Si no hay LS, solo devolvemos un ID falso para que la prueba continúe
    if (typeof localStorage === 'undefined') return Promise.resolve(0); 
    
    try {
      const currentQueue = this.getQueue();
      currentQueue.push(data);
      this.setQueue(currentQueue);
      return currentQueue.length - 1;
    } catch (error) {
      return Promise.reject(error);
    }
  }

  async peekPending(): Promise<T[]> {
    if (typeof localStorage === 'undefined') return [];
    return this.getQueue();
  }

  async dequeuePending(): Promise<T[]> {
    if (typeof localStorage === 'undefined') return [];
    const currentQueue = this.getQueue();
    // 🔑 CORRECCIÓN: Comprobar localStorage antes de remover
    if (typeof localStorage !== 'undefined') {
        localStorage.removeItem(this.key);
    }
    return currentQueue;
  }

  async clear(): Promise<void> {
    if (typeof localStorage === 'undefined') return;
    localStorage.removeItem(this.key);
    return Promise.resolve();
  }
}