// test.ts

// 1. CONFIGURACIÓN DE POLYFILLS PARA NODE.JS
// (Necesarios para que el código interno de la librería no falle con errores de 'window', 'fetch', etc.)

global.indexedDB = require('fake-indexeddb');
global.IDBKeyRange = require('fake-indexeddb/lib/FDBKeyRange'); 

const { LocalStorage } = require('node-localstorage');
global.localStorage = new LocalStorage('./scratch'); 

if (typeof global.fetch === 'undefined') {
    global.fetch = require('node-fetch');
}


// 2. IMPORTACIÓN DE LA LIBRERÍA Y EL ADAPTADOR
import { OfflineSync } from "./src/index";
import { PendingRequest } from "./src/core/PendingRequest"; 
// 🔑 Importar el adaptador de almacenamiento que usaremos
// Asumimos que estás usando el MemoryAdapter para pruebas, aunque lo hayas hecho persistente.
import { MemoryAdapter } from "./src/adapters/MemoryAdapter"; 


// 3. DEFINICIÓN DEL TIPO Y EJECUCIÓN

interface TestData extends PendingRequest {
    title: string;
    userId: number;
    body: any; 
}

// 🔑 CORRECCIÓN CLAVE 1: Inicializar el adaptador
const adapter = new MemoryAdapter<TestData>();

// 🔑 CORRECCIÓN CLAVE 2: Inyectar el adaptador en la configuración
const sync = new OfflineSync<TestData>({
    endpoint: "https://jsonplaceholder.typicode.com/posts",
    // ⬅️ INYECCIÓN: Forzamos a this.storage a ser este objeto
    storage: adapter 
});

console.log("Iniciando prueba de guardado en entorno de prueba con Polyfills...");

sync.save({ 
    url: "https://ejemplo.com/api/post", 
    method: 'POST',
    body: { content: "contenido local" }, 
    title: "Offline post", 
    userId: 1 
});

// Puedes añadir listeners de prueba aquí:
sync.on('synced', (data: any) => console.log('✅ Sincronizado exitosamente:', (data as any).success.length, 'items'));
sync.on('syncFailed', (data: any) => console.error('❌ Falló la sincronización:', data));