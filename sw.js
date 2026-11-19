const CACHE_NAME = 'ehon-travel-v1';

const CORE_ASSETS = [
  './',
  './index.html',
  './food.html',
  './trip.html',
  './expenses.html',
  './japanese.html',
];

const STATIC_CDN_HOSTS = [
  'cdn.tailwindcss.com',
  'cdn.jsdelivr.net',
  'fonts.googleapis.com',
  'fonts.gstatic.com',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(CORE_ASSETS))
      .then(() => self.skipWaiting())
      .catch(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(
        keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
      ))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;

  const url = new URL(req.url);

  // Never intercept Supabase API / Auth / Storage requests
  if (url.hostname.endsWith('supabase.co')) return;

  // Same-origin HTML navigation: Network-First (always fresh online, fallback to cache offline)
  if (url.origin === self.location.origin && (req.mode === 'navigate' || url.pathname.endsWith('.html') || url.pathname.endsWith('/'))) {
    event.respondWith(
      fetch(req)
        .then((res) => {
          if (res && res.ok) {
            const copy = res.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(url.pathname, copy)).catch(() => {});
          }
          return res;
        })
        .catch(() => caches.match(url.pathname, { ignoreSearch: true }).then((cached) => cached || caches.match('./japanese.html')))
    );
    return;
  }

  // Static assets (local assets & font/CSS/JS CDNs): Cache-First with background refresh
  if (url.origin === self.location.origin || STATIC_CDN_HOSTS.includes(url.hostname)) {
    event.respondWith(
      caches.match(req).then((cached) => {
        const networkFetch = fetch(req).then((res) => {
          if (res && (res.ok || res.type === 'opaque')) {
            const copy = res.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(req, copy)).catch(() => {});
          }
          return res;
        }).catch(() => cached);

        return cached || networkFetch;
      })
    );
  }
});
