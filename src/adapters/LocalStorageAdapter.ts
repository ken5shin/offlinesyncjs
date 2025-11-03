import { StorageAdapter } from "../core/StorageAdapter";

export class LocalStorageAdapter implements StorageAdapter {
  private key = "OfflineSyncQueue";

  async savePending(data: any): Promise<void> {
    const current = JSON.parse(localStorage.getItem(this.key) || "[]");
    current.push(data);
    localStorage.setItem(this.key, JSON.stringify(current));
  }

  async getPending(): Promise<any[]> {
    return JSON.parse(localStorage.getItem(this.key) || "[]");
  }

  async clear(): Promise<void> {
    localStorage.removeItem(this.key);
  }
}
