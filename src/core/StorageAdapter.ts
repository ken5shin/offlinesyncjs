export interface StorageAdapter {
  savePending(data: any): Promise<void>;
  getPending(): Promise<any[]>;
  clear(): Promise<void>;
}
