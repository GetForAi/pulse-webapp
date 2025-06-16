self.addEventListener("install", () => {
  self.skipWaiting(); // активируем сразу
});

self.addEventListener("activate", event => {
  event.waitUntil(self.clients.claim()); // захватываем управление
});

self.addEventListener("fetch", event => {
  const { request } = event;
  if (request.method !== "GET") return;

  event.respondWith(
    fetch(request).catch(() => caches.match(request)) // сеть → кэш (если офлайн)
  );
});
