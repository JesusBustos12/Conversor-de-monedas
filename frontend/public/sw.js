const CACHE_NAME = 'currencyhub-v1';
const ASSETS_TO_CACHE = [
    '/',
    '/index.html',
    '/manifest.json',
    '/assets/logo.png',
    '/assets/convertir-dinero.png',
    '/assets/data/latest.json'
];

// Install Event
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            console.log('SW: Precision Caching Assets');
            return cache.addAll(ASSETS_TO_CACHE);
        })
    );
});

// Activate Event
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((keys) => {
            return Promise.all(
                keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
            );
        })
    );
});

// Fetch Event (Cache First, then Network)
self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request).then((response) => {
            return response || fetch(event.request).then((fetchResponse) => {
                // Opción: Cachear dinámicamente nuevos recursos si se desea
                return fetchResponse;
            });
        }).catch((err) => {
            // Fallback en caso de fallo total (si es navegación)
            if (event.request.mode === 'navigate') {
                return caches.match('/index.html');
            }
            // Si no es navegación, lanzamos el error para que el navegador sepa que falló la red
            throw err;
        })
    );
});
