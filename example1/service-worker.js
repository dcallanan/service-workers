const PRECACHE = "version1"
const OFFLINE_URL = "offline.html";
const CACHED = [OFFLINE_URL];

// Caches "offline.html" incase there is no internet
self.addEventListener('install', event => {
    console.log("[Service Worker] Installed");
    caches.delete(PRECACHE)
    event.waitUntil (
        caches.open(PRECACHE)
            .then(cache => cache.addAll(CACHED))
            .then(    _ => self.skipWaiting())
    );
});

// Clears any caches that do not match this version
self.addEventListener("activate", event => {
    event.waitUntil (
        caches.keys()
            .then(keys => {
                return Promise.all (
                    keys.filter(key => {
                        return !key.startsWith(PRECACHE);
                    })
                    .map(key => {
                        return caches.delete(key);
                    })
                );
            })
            .then(() => {
                console.log('[Service Worker] Cleared Old Cache');
            })
    );
});

this.addEventListener('fetch', function(event) {
    if (event.request.method !== 'GET') return;

    console.log("[Service Worker] Handling Request ");

    // If the request to `index.html` works it shows it, but if it fails it shows the cached version of `offline.html`

    // This isn't working because `fetch` doesn't fail when there is no internet for some reason...

    event.respondWith (
        fetch(event.request)
            .then(response => {
                console.log("[Service Worker] Served from NETWORK");
                return response;
            }, () => {
                console.log("[Service Worker] Served from CACHE");
                return caches.match(OFFLINE_URL);
            })
    );
});