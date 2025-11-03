class Storage {
  // Load data from localStorage by key
  static load(key: string): any {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : null;
  }

  // Save data to localStorage under a key
  static save(key: string, value: any): void {
    localStorage.setItem(key, JSON.stringify(value));
  }

  // Remove an item from localStorage by key
  static remove(key: string): void {
    localStorage.removeItem(key);
  }

  // Clear all data from localStorage
  static clear(): void {
    localStorage.clear();
  }
}

export default Storage;
