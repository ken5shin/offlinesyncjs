declare class OfflineSync {
    private queue;
    private sync;
    private conflictResolution;
    onlineStatus: boolean;
    private statusCheckInterval;
    constructor(config: {
        maxQueueSize: number;
        conflictStrategy: string;
    });
    detectStatus(): void;
    private handleStatusChange;
    private handleOnlineStatus;
    private handleOfflineStatus;
    addAction(action: any): void;
    startSync(): void;
    getQueuedActions(): Action[];
    removeActionFromQueue(actionId: string): void;
    clearQueuedAction(): void;
    processQueue(): void;
    resolveConflict(localAction: any, remoteAction: any): any;
    destroy(): void;
}
export default OfflineSync;
