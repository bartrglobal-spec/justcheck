self.addEventListener("install", event => {
  self.skipWaiting();
});

self.addEventListener("activate", event => {
  return self.clients.claim();
});

self.addEventListener("fetch", event => {
  const url = new URL(event.request.url);

  // 🚨 DO NOT TOUCH API CALLS
  if (url.pathname.startsWith("/check") || 
      url.pathname.startsWith("/report") || 
      url.pathname.startsWith("/pay")) {
    return; // let browser handle normally
  }

  // Basic cache-first for static files only
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request);
    })
  );
});