"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OfflineSync = void 0;
const NetworkManager_1 = require("./core/NetworkManager");
const LocalStorageAdapter_1 = require("./adapters/LocalStorageAdapter");
const SyncEngine_1 = require("./core/SyncEngine");
class OfflineSync {
    constructor(config) {
        this.config = config;
        this.network = new NetworkManager_1.NetworkManager();
        this.storage = new LocalStorageAdapter_1.LocalStorageAdapter();
        this.syncEngine = new SyncEngine_1.SyncEngine(this.storage, config.endpoint);
        this.setupListeners();
    }
    setupListeners() {
        this.network.on("online", () => this.syncEngine.sync());
        this.network.on("offline", () => console.log("⚠️ Offline mode"));
    }
    save(data) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.storage.savePending(data);
            console.log("💾 Saved locally:", data);
        });
    }
    syncNow() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.syncEngine.sync();
        });
    }
}
exports.OfflineSync = OfflineSync;
