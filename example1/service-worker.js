const PRECACHE = "version1"
const OFFLINE_URL = "offline.html";

self.addEventListener('install', event => {
	console.log("[Service Worker] Installed");
	caches.delete(PRECACHE)
	event.waitUntil (
		caches.open(PRECACHE)
			.then(cache => cache.add(OFFLINE_URL))
			.then(    _ => self.skipWaiting())
	);
});

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
				console.log('[Service Worker] Cleared old cache');
 			})
	);
});

this.addEventListener('fetch', function(event) {
	if (event.request.method !== 'GET') return;

	console.log("[Service Worker] Handling Request ");
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