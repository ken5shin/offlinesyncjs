import Queue from './components/queue';
import Storage from './components/storage';
import Sync from './components/sync';
import { LatestActionStrategy } from './components/conflict';
import { isOnline, getCurrentTimestamp } from './components/utils';

class OfflineSync {
  private queue: Queue;
  private sync: Sync;
  private conflictResolution: LatestActionStrategy;
  public onlineStatus: boolean;
  private statusCheckInterval: NodeJS.Timeout | null = null;

  constructor(config: { maxQueueSize: number; conflictStrategy: string }) {
    this.queue = new Queue(config);
    this.sync = new Sync(this.queue);
    this.conflictResolution = new LatestActionStrategy();
    this.onlineStatus = isOnline(); // Set initial online status

    // Load the queue from localStorage if there are any saved actions
    const savedActions = Storage.load('offlineActions');
    if (savedActions) {
      savedActions.forEach((action: any) => this.queue.add(action));
    }

    // Attach sync success callback
    this.sync.setSyncSuccessCallback((syncedActions) => {
      console.log('Sync completed successfully:', syncedActions);
      // Remove successfully synced actions and update localStorage
      syncedActions.forEach((action: any) => this.queue.remove(action.id));
      Storage.save('offlineActions', this.queue.get()); // Sync queue to localStorage
    });

    // Start detecting the status automatically
    this.detectStatus();

    // Listen for manual online/offline status changes
    window.addEventListener('online', this.handleOnlineStatus);
    window.addEventListener('offline', this.handleOfflineStatus);
  }

  // Detect and update online status every second
  detectStatus() {
    this.statusCheckInterval = setInterval(() => {
      const currentStatus = isOnline();
      this.handleStatusChange(currentStatus);
    }, 1000);
  }

  // Handle status changes
  private handleStatusChange = (status: boolean) => {
    if (this.onlineStatus !== status) {
      this.onlineStatus = status;
      console.log('Online Status Changed:', this.onlineStatus ? 'Online' : 'Offline');

      if (this.onlineStatus) {
        this.startSync();
      }
    }
  };

  private handleOnlineStatus = () => this.handleStatusChange(true);
  private handleOfflineStatus = () => this.handleStatusChange(false);

  // Add an action to the queue and save to localStorage
  addAction(action: any): void {
    const timestamp = getCurrentTimestamp();
    this.queue.add({ ...action, timestamp });

    // Save the updated queue to localStorage
    Storage.save('offlineActions', this.queue.get());
  }

  // Start the syncing process
  startSync(): void {
    if (this.onlineStatus) {
      this.sync.start().catch((err) => {
        console.error('Sync process failed:', err);
      });
      console.log('Sync process started - Online');
    } else {
      console.log('Offline. Queuing actions.');
    }
  }

  getQueuedActions(): Action[] {
    const queued = this.queue?.get() || [];
    return queued
  }

  removeActionFromQueue(actionId: string): void {
    if (!this.queue) {
      console.error('Queue is not initialized.');
      return;
    }
  
    this.queue.remove(actionId);
  
    // Save the updated queue to localStorage after removing the action
    Storage.save('offlineActions', this.queue.get());
    console.log(`Action with ID ${actionId} has been removed from the queue.`);
  }
  

  clearQueuedAction(): void {
    if (!this.queue) {
      console.error('Queue is not initialized.');
      return;
    }

    this.queue.clear();

    // Clear the queue in localStorage
    Storage.save('offlineActions', []);
    console.log('All actions have been cleared from the queue.');
  }


  // Process the queue manually
  processQueue(): void {
    if (this.onlineStatus) {
      this.startSync();
    } else {
      console.log('Offline. Actions are in the queue.');
    }
  }

  // Resolve conflicts between local and remote actions
  resolveConflict(localAction: any, remoteAction: any): any {
    return this.conflictResolution.resolve(localAction, remoteAction);
  }

  // Cleanup resources when the object is destroyed
  destroy(): void {
    if (this.statusCheckInterval) {
      clearInterval(this.statusCheckInterval); // Stop the status checking interval
    }
    window.removeEventListener('online', this.handleOnlineStatus);
    window.removeEventListener('offline', this.handleOfflineStatus);
    console.log('OfflineSync instance destroyed.');
  }
}

export default OfflineSync;
