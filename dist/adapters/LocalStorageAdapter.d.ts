import { StorageAdapter } from "../core/StorageAdapter";
export declare class LocalStorageAdapter implements StorageAdapter {
    private key;
    savePending(data: any): Promise<void>;
    getPending(): Promise<any[]>;
    clear(): Promise<void>;
}
