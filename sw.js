const CACHE_NAME = 'swen-tech-v1';
const ASSETS = [
    '/',
    '/index.html',
    '/styles.css',
    '/script.js',
    '/about.html',
    '/services.html',
    '/portfolio.html',
    '/dashboard.html',
    '/playground.html',
    '/tools.html',
    '/contact.html',
    'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css',
    'https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;700&family=Inter:wght@400;600&display=swap'
];

// Install Event
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            console.log(' caching shell assets');
            return cache.addAll(ASSETS);
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

// Fetch Event
self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request).then((cacheRes) => {
            return cacheRes || fetch(event.request).then((fetchRes) => {
                return caches.open(CACHE_NAME).then((cache) => {
                    // Don't cache data or external trackers
                    if (event.request.url.indexOf('http') === 0 && event.request.method === 'GET') {
                        cache.put(event.request.url, fetchRes.clone());
                    }
                    return fetchRes;
                });
            });
        }).catch(() => {
            if (event.request.url.indexOf('.html') > -1) {
                return caches.match('/index.html');
            }
        })
    );
});
