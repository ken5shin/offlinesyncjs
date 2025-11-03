import Queue from './queue';
declare class Sync {
    private queue;
    private onSyncSuccess;
    private onSyncError;
    constructor(queue: Queue);
    setSyncSuccessCallback(callback: (syncedActions: any[]) => void): void;
    setSyncErrorCallback(callback: (error: Error, failedActions: any[]) => void): void;
    start(): Promise<void>;
    private syncAction;
}
export default Sync;
