import { NetworkManager } from "./core/NetworkManager";
import { LocalStorageAdapter } from "./adapters/LocalStorageAdapter";
import { SyncEngine } from "./core/SyncEngine";

interface OfflineSyncConfig {
  storage?: "localStorage";
  endpoint: string;
}

export class OfflineSync {
  private network: NetworkManager;
  private storage: LocalStorageAdapter;
  private syncEngine: SyncEngine;

  constructor(private config: OfflineSyncConfig) {
    this.network = new NetworkManager();
    this.storage = new LocalStorageAdapter();
    this.syncEngine = new SyncEngine(this.storage, config.endpoint);
    this.setupListeners();
  }

  private setupListeners() {
    this.network.on("online", () => this.syncEngine.sync());
    this.network.on("offline", () => console.log("⚠️ Offline mode"));
  }

  async save(data: any) {
    await this.storage.savePending(data);
    console.log("💾 Saved locally:", data);
  }

  async syncNow() {
    await this.syncEngine.sync();
  }
}
