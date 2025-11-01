interface OfflineSyncConfig {
    storage?: "localStorage";
    endpoint: string;
}
export declare class OfflineSync {
    private config;
    private network;
    private storage;
    private syncEngine;
    constructor(config: OfflineSyncConfig);
    private setupListeners;
    save(data: any): Promise<void>;
    syncNow(): Promise<void>;
}
export {};
