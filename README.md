#  OfflineSync.js

[![npm version](https://img.shields.io/npm/v/offlinesyncjs.svg)](https://www.npmjs.com/package/offlinesyncjs)
[![GitHub stars](https://img.shields.io/github/stars/ken5shin/offlinesyncjs.svg)](https://github.com/ken5shin/offlinesyncjs/stargazers)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

**OfflineSync.js** es una librería escrita en **TypeScript** que permite a las aplicaciones web y móviles funcionar sin conexión a internet, almacenando datos localmente y sincronizándolos automáticamente con el servidor al recuperar la conectividad.

Ideal para aplicaciones **educativas, médicas, logísticas o de telecomunicaciones** donde la conexión es inestable.

---

##  Características principales

- Detección automática de conexión/desconexión
- Almacenamiento local en `localStorage`, `sessionStorage` o `IndexedDB`
- Sincronización automática con APIs REST o Firebase
- Resolución inteligente de conflictos
- Eventos personalizables (`onSync`, `onOffline`, `onOnline`, etc.)
- Compatible con navegadores modernos y entornos híbridos

---

##  Instalación

### Con NPM
```bash
npm install offlinesyncjs

 ##como se usa
import { OfflineSync } from "offlinesyncjs";

const sync = new OfflineSync({
  endpoint: "https://jsonplaceholder.typicode.com/posts", // URL de tu servidor que vallas a ocupar
});

// Guardar datos localmente
sync.save({ title: "Offline Post", body: "Contenido local", userId: 1 });

// Sincronización manual
sync.syncNow();
// Escuchar eventos
sync.on("online", () => console.log("Conexión restablecida"));
sync.on("offline", () => console.log("Sin conexión"));
sync.on("synced", (data) => console.log("Datos sincronizados:", data));


//Ejemplo usando IndexedDB
import { OfflineSync, IndexedDBAdapter } from "offlinesyncjs";

const sync = new OfflineSync({
  endpoint: "https://api.tuapp.com/data",
  storage: new IndexedDBAdapter("OfflineDB"),
});

Ejemplo práctico en React
import React, { useEffect } from "react";
import { OfflineSync } from "offlinesyncjs";

export default function App() {
  const sync = new OfflineSync({ endpoint: "/api/posts" });

  useEffect(() => {
    sync.on("synced", () => alert("Datos sincronizados con el servidor!"));
  }, []);

  const handleSubmit = () => {
    sync.save({ title: "Nuevo post offline", body: "Guardado sin conexión" });
  };

  return (
    <button onClick={handleSubmit}>Guardar offline</button>
  );
}
