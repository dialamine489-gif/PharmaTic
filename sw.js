const CACHE_NAME = 'pharmatic-v1';
const ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './icon.jpeg',
  './src/data/pharmacies.json'
];

// Installation : Mise en cache des fichiers essentiels
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.addAll(ASSETS);
        })
    );
});

// Fetch : Permet à l'application de charger depuis le cache
self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request).then((cachedResponse) => {
            // Si le fichier est dans le cache, on le retourne immédiatement
            if (cachedResponse) {
                return cachedResponse;
            }
            // Sinon, on va sur le réseau
            return fetch(event.request);
        })
    );
});
// Force le nouveau Service Worker à s'activer immédiatement
self.addEventListener('install', (event) => {
    self.skipWaiting(); 
});

self.addEventListener('activate', (event) => {
    event.waitUntil(clients.claim()); 
});