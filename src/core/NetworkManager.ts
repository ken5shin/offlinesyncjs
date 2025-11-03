export class NetworkManager {
  private online: boolean = navigator.onLine;
  private listeners: { [key: string]: Function[] } = {};

  constructor() {
    window.addEventListener("online", () => this.updateStatus(true));
    window.addEventListener("offline", () => this.updateStatus(false));
  }

  private updateStatus(status: boolean) {
    this.online = status;
    this.emit(status ? "online" : "offline");
  }

  on(event: "online" | "offline", callback: Function) {
    if (!this.listeners[event]) this.listeners[event] = [];
    this.listeners[event].push(callback);
  }

  emit(event: string) {
    this.listeners[event]?.forEach(cb => cb());
  }

  isOnline() {
    return this.online;
  }
}
