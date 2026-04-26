const CACHE_NAME = 'pharmatic-v1.60'; // On passe en 1.60
const ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './icon.jpeg',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css'
];

// Installation : on met en cache les fichiers de structure (pas le JSON ici pour éviter de figer les données)
self.addEventListener('install', (e) => {
  self.skipWaiting();
  e.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS))
  );
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then(keys => Promise.all(
      keys.map(key => {
        if(key !== CACHE_NAME) return caches.delete(key);
      })
    ))
  );
  return self.clients.claim();
});

// STRATÉGIE : Network First avec mise à jour dynamique du cache
self.addEventListener('fetch', (e) => {
  e.respondWith(
    fetch(e.request)
      .then(response => {
        // Si la réponse est valide, on en fait une copie dans le cache
        const resClone = response.clone();
        caches.open(CACHE_NAME).then(cache => {
          cache.put(e.request, resClone);
        });
        return response;
      })
      .catch(() => {
        // Si le réseau échoue (mode hors-ligne), on prend ce qu'on a en cache
        return caches.match(e.request);
      })
  );
});

self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
