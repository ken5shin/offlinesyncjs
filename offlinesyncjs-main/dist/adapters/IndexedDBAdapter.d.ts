import { StorageAdapter } from '../core/StorageAdapter';
export declare class IndexedDBAdapter<T> implements StorageAdapter<T> {
    private readonly dbName;
    private readonly storeName;
    private dbPromise;
    constructor(dbName?: string);
    private initDB;
    savePending(data: T): Promise<IDBValidKey>;
    peekPending(): Promise<T[]>;
    dequeuePending(): Promise<T[]>;
    clear(): Promise<void>;
}
