export declare class NetworkManager {
    private online;
    private listeners;
    constructor();
    private updateStatus;
    on(event: "online" | "offline", callback: Function): void;
    emit(event: string): void;
    isOnline(): boolean;
}
