import { StorageAdapter } from "./StorageAdapter";
export declare class SyncEngine {
    private storage;
    private endpoint;
    constructor(storage: StorageAdapter, endpoint: string);
    sync(): Promise<void>;
}
