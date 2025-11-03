import { StorageAdapter } from "./StorageAdapter";

export class SyncEngine {
  constructor(private storage: StorageAdapter, private endpoint: string) {}

  async sync() {
    const pending = await this.storage.getPending();
    if (pending.length === 0) return;

    console.log("🔄 Syncing data:", pending);
    for (const item of pending) {
      try {
        await fetch(this.endpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(item)
        });
      } catch (err) {
        console.error("❌ Error syncing:", err);
        return;
      }
    }

    await this.storage.clear();
    console.log("✅ Sync complete!");
  }
}
