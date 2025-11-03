"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NetworkManager = void 0;
class NetworkManager {
    constructor() {
        this.online = navigator.onLine;
        this.listeners = {};
        window.addEventListener("online", () => this.updateStatus(true));
        window.addEventListener("offline", () => this.updateStatus(false));
    }
    updateStatus(status) {
        this.online = status;
        this.emit(status ? "online" : "offline");
    }
    on(event, callback) {
        if (!this.listeners[event])
            this.listeners[event] = [];
        this.listeners[event].push(callback);
    }
    emit(event) {
        var _a;
        (_a = this.listeners[event]) === null || _a === void 0 ? void 0 : _a.forEach(cb => cb());
    }
    isOnline() {
        return this.online;
    }
}
exports.NetworkManager = NetworkManager;
