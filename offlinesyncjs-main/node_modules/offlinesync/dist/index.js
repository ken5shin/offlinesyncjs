'use strict';

/******************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */
/* global Reflect, Promise, SuppressedError, Symbol, Iterator */


var __assign = function() {
    __assign = Object.assign || function __assign(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};

function __awaiter(thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
}

function __generator(thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
}

function __spreadArray(to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
}

typeof SuppressedError === "function" ? SuppressedError : function (error, suppressed, message) {
    var e = new Error(message);
    return e.name = "SuppressedError", e.error = error, e.suppressed = suppressed, e;
};

const byteToHex = [];
for (let i = 0; i < 256; ++i) {
  byteToHex.push((i + 0x100).toString(16).slice(1));
}
function unsafeStringify(arr, offset = 0) {
  return (byteToHex[arr[offset + 0]] + byteToHex[arr[offset + 1]] + byteToHex[arr[offset + 2]] + byteToHex[arr[offset + 3]] + '-' + byteToHex[arr[offset + 4]] + byteToHex[arr[offset + 5]] + '-' + byteToHex[arr[offset + 6]] + byteToHex[arr[offset + 7]] + '-' + byteToHex[arr[offset + 8]] + byteToHex[arr[offset + 9]] + '-' + byteToHex[arr[offset + 10]] + byteToHex[arr[offset + 11]] + byteToHex[arr[offset + 12]] + byteToHex[arr[offset + 13]] + byteToHex[arr[offset + 14]] + byteToHex[arr[offset + 15]]).toLowerCase();
}

let getRandomValues;
const rnds8 = new Uint8Array(16);
function rng() {
  if (!getRandomValues) {
    if (typeof crypto === 'undefined' || !crypto.getRandomValues) {
      throw new Error('crypto.getRandomValues() not supported. See https://github.com/uuidjs/uuid#getrandomvalues-not-supported');
    }
    getRandomValues = crypto.getRandomValues.bind(crypto);
  }
  return getRandomValues(rnds8);
}

const randomUUID = typeof crypto !== 'undefined' && crypto.randomUUID && crypto.randomUUID.bind(crypto);
var native = {
  randomUUID
};

function v4(options, buf, offset) {
  if (native.randomUUID && !buf && !options) {
    return native.randomUUID();
  }
  options = options || {};
  const rnds = options.random || (options.rng || rng)();
  rnds[6] = rnds[6] & 0x0f | 0x40;
  rnds[8] = rnds[8] & 0x3f | 0x80;
  return unsafeStringify(rnds);
}

var Queue = /** @class */function () {
  function Queue(config) {
    if (config === void 0) {
      config = {
        maxQueueSize: 100
      };
    }
    this.queue = [];
    this.maxQueueSize = config.maxQueueSize;
  }
  // Add an action to the queue
  Queue.prototype.add = function (action) {
    if (!action.id) {
      action.id = "".concat(action.type, "-").concat(Date.now(), "-").concat(v4()); // Generate unique ID
    }
    // Check for duplicate actions
    var exists = this.queue.some(function (existingAction) {
      return existingAction.id === action.id || existingAction.type === action.type && JSON.stringify(existingAction.data) === JSON.stringify(action.data);
    });
    if (exists) {
      console.warn("Duplicate action detected: ".concat(action.id));
      return;
    }
    // Maintain max queue size
    if (this.queue.length >= this.maxQueueSize) {
      this.queue.shift();
    }
    this.queue.push(action);
  };
  // Get all queued actions
  Queue.prototype.get = function () {
    return __spreadArray([], this.queue, true); // Return a copy to avoid mutation
  };
  // Replace the queue with new actions
  Queue.prototype.set = function (actions) {
    if (actions.length > this.maxQueueSize) {
      actions = actions.slice(0, this.maxQueueSize); // Truncate if necessary
    }
    this.queue = actions;
  };
  // Remove action by ID
  Queue.prototype.remove = function (actionId) {
    this.queue = this.queue.filter(function (action) {
      return action.id !== actionId;
    });
  };
  // Clear all actions
  Queue.prototype.clear = function () {
    this.queue = [];
  };
  // Check if the queue is empty
  Queue.prototype.isEmpty = function () {
    return this.queue.length === 0;
  };
  // Get the size of the queue
  Queue.prototype.size = function () {
    return this.queue.length;
  };
  return Queue;
}();

var Storage = /** @class */function () {
  function Storage() {}
  // Load data from localStorage by key
  Storage.load = function (key) {
    var data = localStorage.getItem(key);
    return data ? JSON.parse(data) : null;
  };
  // Save data to localStorage under a key
  Storage.save = function (key, value) {
    localStorage.setItem(key, JSON.stringify(value));
  };
  // Remove an item from localStorage by key
  Storage.remove = function (key) {
    localStorage.removeItem(key);
  };
  // Clear all data from localStorage
  Storage.clear = function () {
    localStorage.clear();
  };
  return Storage;
}();

var Sync = /** @class */function () {
  function Sync(queue) {
    this.queue = queue;
    this.onSyncSuccess = null;
    this.onSyncError = null;
  }
  // Set success callback
  Sync.prototype.setSyncSuccessCallback = function (callback) {
    this.onSyncSuccess = callback;
  };
  // Set error callback
  Sync.prototype.setSyncErrorCallback = function (callback) {
    this.onSyncError = callback;
  };
  // Start syncing the actions
  Sync.prototype.start = function () {
    return __awaiter(this, void 0, void 0, function () {
      var actions, syncedActions, failedActions, _i, actions_1, action, error_1, error, error_2;
      var _a;
      return __generator(this, function (_b) {
        switch (_b.label) {
          case 0:
            actions = this.queue.get();
            if (actions.length === 0) {
              console.log('No actions to sync.');
              return [2 /*return*/];
            }
            syncedActions = [];
            failedActions = [];
            _b.label = 1;
          case 1:
            _b.trys.push([1, 9,, 10]);
            _i = 0, actions_1 = actions;
            _b.label = 2;
          case 2:
            if (!(_i < actions_1.length)) return [3 /*break*/, 8];
            action = actions_1[_i];
            _b.label = 3;
          case 3:
            _b.trys.push([3, 6,, 7]);
            // Simulate API call for syncing
            return [4 /*yield*/, this.syncAction(action)];
          case 4:
            // Simulate API call for syncing
            _b.sent();
            console.log("Action synced: ".concat(action.type));
            return [4 /*yield*/, syncedActions.push(action)];
          case 5:
            _b.sent();
            (_a = this.queue) === null || _a === void 0 ? void 0 : _a.remove(action.id);
            return [3 /*break*/, 7];
          case 6:
            error_1 = _b.sent();
            console.error("Failed to sync action: ".concat(action.type, ". Error: ").concat(error_1.message));
            failedActions.push(action);
            return [3 /*break*/, 7];
          case 7:
            _i++;
            return [3 /*break*/, 2];
          case 8:
            // Update the queue with failed actions
            this.queue.set(failedActions);
            if (failedActions.length > 0 && this.onSyncError) {
              error = new Error('Some actions failed to sync');
              this.onSyncError(error, failedActions);
            }
            if (syncedActions.length > 0 && this.onSyncSuccess) {
              this.onSyncSuccess(syncedActions);
            }
            return [3 /*break*/, 10];
          case 9:
            error_2 = _b.sent();
            console.error('Unexpected error during sync:', error_2);
            if (this.onSyncError) {
              this.onSyncError(error_2, actions);
            }
            return [3 /*break*/, 10];
          case 10:
            return [2 /*return*/];
        }
      });
    });
  };
  // Simulate syncing an action
  Sync.prototype.syncAction = function (action) {
    return __awaiter(this, void 0, void 0, function () {
      return __generator(this, function (_a) {
        return [2 /*return*/, new Promise(function (resolve, reject) {
          setTimeout(function () {
            if (Math.random() > 0.8) {
              reject(new Error('Simulated network or server issue'));
            } else {
              resolve();
            }
          }, 1000);
        })];
      });
    });
  };
  return Sync;
}();

var LatestActionStrategy = /** @class */function () {
  function LatestActionStrategy() {}
  LatestActionStrategy.prototype.resolve = function (localAction, remoteAction) {
    return localAction.timestamp > remoteAction.timestamp ? localAction : remoteAction;
  };
  return LatestActionStrategy;
}();

function isOnline() {
  return navigator.onLine;
}
function getCurrentTimestamp() {
  return Date.now();
}

var OfflineSync = /** @class */function () {
  function OfflineSync(config) {
    var _this = this;
    this.statusCheckInterval = null;
    // Handle status changes
    this.handleStatusChange = function (status) {
      if (_this.onlineStatus !== status) {
        _this.onlineStatus = status;
        console.log('Online Status Changed:', _this.onlineStatus ? 'Online' : 'Offline');
        if (_this.onlineStatus) {
          _this.startSync();
        }
      }
    };
    this.handleOnlineStatus = function () {
      return _this.handleStatusChange(true);
    };
    this.handleOfflineStatus = function () {
      return _this.handleStatusChange(false);
    };
    this.queue = new Queue(config);
    this.sync = new Sync(this.queue);
    this.conflictResolution = new LatestActionStrategy();
    this.onlineStatus = isOnline(); // Set initial online status
    // Load the queue from localStorage if there are any saved actions
    var savedActions = Storage.load('offlineActions');
    if (savedActions) {
      savedActions.forEach(function (action) {
        return _this.queue.add(action);
      });
    }
    // Attach sync success callback
    this.sync.setSyncSuccessCallback(function (syncedActions) {
      console.log('Sync completed successfully:', syncedActions);
      // Remove successfully synced actions and update localStorage
      syncedActions.forEach(function (action) {
        return _this.queue.remove(action.id);
      });
      Storage.save('offlineActions', _this.queue.get()); // Sync queue to localStorage
    });
    // Start detecting the status automatically
    this.detectStatus();
    // Listen for manual online/offline status changes
    window.addEventListener('online', this.handleOnlineStatus);
    window.addEventListener('offline', this.handleOfflineStatus);
  }
  // Detect and update online status every second
  OfflineSync.prototype.detectStatus = function () {
    var _this = this;
    this.statusCheckInterval = setInterval(function () {
      var currentStatus = isOnline();
      _this.handleStatusChange(currentStatus);
    }, 1000);
  };
  // Add an action to the queue and save to localStorage
  OfflineSync.prototype.addAction = function (action) {
    var timestamp = getCurrentTimestamp();
    this.queue.add(__assign(__assign({}, action), {
      timestamp: timestamp
    }));
    // Save the updated queue to localStorage
    Storage.save('offlineActions', this.queue.get());
  };
  // Start the syncing process
  OfflineSync.prototype.startSync = function () {
    if (this.onlineStatus) {
      this.sync.start().catch(function (err) {
        console.error('Sync process failed:', err);
      });
      console.log('Sync process started - Online');
    } else {
      console.log('Offline. Queuing actions.');
    }
  };
  OfflineSync.prototype.getQueuedActions = function () {
    var _a;
    var queued = ((_a = this.queue) === null || _a === void 0 ? void 0 : _a.get()) || [];
    return queued;
  };
  OfflineSync.prototype.removeActionFromQueue = function (actionId) {
    if (!this.queue) {
      console.error('Queue is not initialized.');
      return;
    }
    this.queue.remove(actionId);
    // Save the updated queue to localStorage after removing the action
    Storage.save('offlineActions', this.queue.get());
    console.log("Action with ID ".concat(actionId, " has been removed from the queue."));
  };
  OfflineSync.prototype.clearQueuedAction = function () {
    if (!this.queue) {
      console.error('Queue is not initialized.');
      return;
    }
    this.queue.clear();
    // Clear the queue in localStorage
    Storage.save('offlineActions', []);
    console.log('All actions have been cleared from the queue.');
  };
  // Process the queue manually
  OfflineSync.prototype.processQueue = function () {
    if (this.onlineStatus) {
      this.startSync();
    } else {
      console.log('Offline. Actions are in the queue.');
    }
  };
  // Resolve conflicts between local and remote actions
  OfflineSync.prototype.resolveConflict = function (localAction, remoteAction) {
    return this.conflictResolution.resolve(localAction, remoteAction);
  };
  // Cleanup resources when the object is destroyed
  OfflineSync.prototype.destroy = function () {
    if (this.statusCheckInterval) {
      clearInterval(this.statusCheckInterval); // Stop the status checking interval
    }
    window.removeEventListener('online', this.handleOnlineStatus);
    window.removeEventListener('offline', this.handleOfflineStatus);
    console.log('OfflineSync instance destroyed.');
  };
  return OfflineSync;
}();

module.exports = OfflineSync;
//# sourceMappingURL=index.js.map
