export type NetworkCallback = (data?: any) => void;
export interface NetworkManagerConfig {
    heartbeatUrl?: string;
    heartbeatInterval?: number;
    requestTimeout?: number;
}
export declare class NetworkManager {
    private status;
    private config;
    private heartbeatTimer;
    private listeners;
    private isBrowser;
    private static readonly defaultConfig;
    constructor(config?: NetworkManagerConfig);
    private handleBrowserStatusChange;
    private startHeartbeat;
    private stopHeartbeat;
    private checkConnection;
    private updateStatus;
    emit(event: string, data?: any): void;
    on(event: string, callback: NetworkCallback): void;
    off(event: string, callback: NetworkCallback): void;
    isOnline(): boolean;
}
