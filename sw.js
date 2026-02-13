const CACHE_NAME = 'pharmatic-v1';
const ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './icon.jpeg'
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
        caches.match(event.request).then((response) => {
            return response || fetch(event.request);
        })
    );
});