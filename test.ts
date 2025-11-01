import { OfflineSync } from "./src";

const sync = new OfflineSync({
  endpoint: "https://jsonplaceholder.typicode.com/posts"
});

sync.save({ title: "Offline post", body: "Contenido local", userId: 1 });
