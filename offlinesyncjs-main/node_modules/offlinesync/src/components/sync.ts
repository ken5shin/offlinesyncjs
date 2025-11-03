import Queue from './queue';

class Sync {
  private queue: Queue;
  private onSyncSuccess: ((syncedActions: any[]) => void) | null;
  private onSyncError: ((error: Error, failedActions: any[]) => void) | null;

  constructor(queue: Queue) {
    this.queue = queue;
    this.onSyncSuccess = null;
    this.onSyncError = null;
  }

  // Set success callback
  setSyncSuccessCallback(callback: (syncedActions: any[]) => void): void {
    this.onSyncSuccess = callback;
  }

  // Set error callback
  setSyncErrorCallback(callback: (error: Error, failedActions: any[]) => void): void {
    this.onSyncError = callback;
  }

  // Start syncing the actions
  async start(): Promise<void> {
    const actions = this.queue.get();
    if (actions.length === 0) {
      console.log('No actions to sync.');
      return;
    }

    const syncedActions: any[] = [];
    const failedActions: any[] = [];

    try {
      for (const action of actions) {
        try {
          // Simulate API call for syncing
          await this.syncAction(action);
          console.log(`Action synced: ${action.type}`);
          await syncedActions.push(action);
          this.queue?.remove(action.id)
        } catch (error: any) {
          console.error(`Failed to sync action: ${action.type}. Error: ${error.message}`);
          failedActions.push(action);
        }
      }

      // Update the queue with failed actions
      this.queue.set(failedActions);

      if (failedActions.length > 0 && this.onSyncError) {
        const error = new Error('Some actions failed to sync');
        this.onSyncError(error, failedActions);
      }

      if (syncedActions.length > 0 && this.onSyncSuccess) {
        this.onSyncSuccess(syncedActions);
      }
    } catch (error) {
      console.error('Unexpected error during sync:', error);
      if (this.onSyncError) {
        this.onSyncError(error as Error, actions);
      }
    }
  }

  // Simulate syncing an action
  private async syncAction(action: any): Promise<void> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (Math.random() > 0.8) {
          reject(new Error('Simulated network or server issue'));
        } else {
          resolve();
        }
      }, 1000);
    });
  }
}

export default Sync;
