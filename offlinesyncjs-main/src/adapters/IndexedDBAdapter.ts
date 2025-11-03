// src/adapters/IndexedDBAdapter.ts

import { openDB, IDBPDatabase, DBSchema } from 'idb';
import { StorageAdapter } from '../core/StorageAdapter';

interface OfflineSyncDB<T> extends DBSchema {
  pendingQueue: {
    key: number;
    value: T;
  };
}

export class IndexedDBAdapter<T> implements StorageAdapter<T> {
  private readonly dbName: string;
  private readonly storeName = 'pendingQueue';
  private dbPromise: Promise<IDBPDatabase<OfflineSyncDB<T>>>;

  constructor(dbName: string = 'OfflineSyncDB') {
    this.dbName = dbName;
    this.dbPromise = this.initDB();
  }

  private initDB(): Promise<IDBPDatabase<OfflineSyncDB<T>>> {
    return openDB<OfflineSyncDB<T>>(this.dbName, 1, {
      upgrade(db) {
        if (!db.objectStoreNames.contains('pendingQueue')) {
          db.createObjectStore('pendingQueue', { autoIncrement: true });
        }
      },
      // 🔑 CORRECCIÓN: Usar funciones de flecha para preservar el contexto (this)
      blocked: () => { 
        console.warn(`IndexedDB '${this.dbName}' está bloqueada. Cierre otras pestañas.`);
      },
      blocking: () => {
        console.warn(`Esta pestaña está bloqueando una actualización de IndexedDB.`);
      },
    });
  }

  async savePending(data: T): Promise<IDBValidKey> {
    const db = await this.dbPromise;
    return db.add(this.storeName, data);
  }

  async peekPending(): Promise<T[]> {
    const db = await this.dbPromise;
    return db.getAll(this.storeName);
  }

  async dequeuePending(): Promise<T[]> {
    const db = await this.dbPromise;

    const tx = db.transaction(this.storeName, 'readwrite');
    const store = tx.objectStore(this.storeName);

    const [items] = await Promise.all([
      store.getAll(),
      store.clear(),
    ]);

    await tx.done;

    return items;
  }

  async clear(): Promise<void> {
    const db = await this.dbPromise;
    return db.clear(this.storeName);
  }
}