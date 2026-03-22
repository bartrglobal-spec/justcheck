self.addEventListener("install", () => self.skipWaiting());

self.addEventListener("activate", () => self.clients.claim());

self.addEventListener("fetch", (event) => {
  // ONLY cache static assets (not API)
  if (
    event.request.method !== "GET" ||
    event.request.url.includes("/check") ||
    event.request.url.includes("/report") ||
    event.request.url.includes("/pay")
  ) {
    return; // never touch API
  }

  event.respondWith(
    fetch(event.request).catch(() => caches.match(event.request))
  );
});