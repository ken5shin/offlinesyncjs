"use strict";
// test.ts
Object.defineProperty(exports, "__esModule", { value: true });
// 🔑 CORRECCIÓN: Importar directamente desde el archivo de entrada
var index_1 = require("./src/index");
var sync = new index_1.OfflineSync({
    endpoint: "https://jsonplaceholder.typicode.com/posts"
});
sync.save({ title: "Offline post", body: "contenido local", userId: 1 });
