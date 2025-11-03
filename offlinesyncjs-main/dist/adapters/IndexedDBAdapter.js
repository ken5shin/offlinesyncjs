"use strict";
// src/adapters/IndexedDBAdapter.ts
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
exports.IndexedDBAdapter = void 0;
const idb_1 = require("idb");
class IndexedDBAdapter {
    constructor(dbName = 'OfflineSyncDB') {
        this.storeName = 'pendingQueue';
        this.dbName = dbName;
        this.dbPromise = this.initDB();
    }
    initDB() {
        return (0, idb_1.openDB)(this.dbName, 1, {
            upgrade(db) {
                if (!db.objectStoreNames.contains('pendingQueue')) {
                    db.createObjectStore('pendingQueue', { autoIncrement: true });
                }
            },
            // 🔑 CORRECCIÓN: Usar funciones de flecha para preservar el contexto (this)
            blocked: () => {
                console.warn(`IndexedDB '${this.dbName}' está bloqueada. Cierre otras pestañas.`);
            },
            blocking: () => {
                console.warn(`Esta pestaña está bloqueando una actualización de IndexedDB.`);
            },
        });
    }
    savePending(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const db = yield this.dbPromise;
            return db.add(this.storeName, data);
        });
    }
    peekPending() {
        return __awaiter(this, void 0, void 0, function* () {
            const db = yield this.dbPromise;
            return db.getAll(this.storeName);
        });
    }
    dequeuePending() {
        return __awaiter(this, void 0, void 0, function* () {
            const db = yield this.dbPromise;
            const tx = db.transaction(this.storeName, 'readwrite');
            const store = tx.objectStore(this.storeName);
            const [items] = yield Promise.all([
                store.getAll(),
                store.clear(),
            ]);
            yield tx.done;
            return items;
        });
    }
    clear() {
        return __awaiter(this, void 0, void 0, function* () {
            const db = yield this.dbPromise;
            return db.clear(this.storeName);
        });
    }
}
exports.IndexedDBAdapter = IndexedDBAdapter;
//# sourceMappingURL=IndexedDBAdapter.js.map