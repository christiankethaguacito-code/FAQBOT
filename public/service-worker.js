// Service Worker for SKSU SBO FAQ Bot
// Version 2.0.0 - Enhanced PWA

const CACHE_VERSION = 'v2.0.0';
const CACHE_NAME = `sksu-faq-cache-${CACHE_VERSION}`;
const DATA_CACHE_NAME = `sksu-faq-data-${CACHE_VERSION}`;
const IMAGE_CACHE_NAME = `sksu-faq-images-${CACHE_VERSION}`;

// Maximum cache sizes (in items)
const MAX_DATA_CACHE_SIZE = 100;
const MAX_IMAGE_CACHE_SIZE = 50;

// Cache duration (in milliseconds)
const CACHE_DURATION = 7 * 24 * 60 * 60 * 1000; // 7 days

// Files to cache for offline use (App Shell)
const FILES_TO_CACHE = [
    '/',
    '/index.html',
    '/admin.html',
    '/manifest.json',
    '/icon-192.png',
    '/icon-512.png'
];

// CDN resources to cache
const CDN_RESOURCES = [
    'https://cdn.tailwindcss.com',
    'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap',
    'https://fonts.gstatic.com/s/inter/v13/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hiA.woff2'
];

// Install event - cache files
self.addEventListener('install', (event) => {
    console.log('[ServiceWorker] Install', CACHE_VERSION);
    event.waitUntil(
        Promise.all([
            // Cache app shell
            caches.open(CACHE_NAME).then((cache) => {
                console.log('[ServiceWorker] Pre-caching app shell');
                return cache.addAll(FILES_TO_CACHE).catch((error) => {
                    console.error('[ServiceWorker] Cache failed:', error);
                });
            }),
            // Cache CDN resources
            caches.open(CACHE_NAME).then((cache) => {
                console.log('[ServiceWorker] Pre-caching CDN resources');
                return Promise.all(
                    CDN_RESOURCES.map(url => 
                        cache.add(url).catch(err => console.warn('[ServiceWorker] Failed to cache:', url))
                    )
                );
            })
        ])
    );
    self.skipWaiting();
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
    console.log('[ServiceWorker] Activate', CACHE_VERSION);
    event.waitUntil(
        caches.keys().then((keyList) => {
            return Promise.all(keyList.map((key) => {
                if (key !== CACHE_NAME && key !== DATA_CACHE_NAME && key !== IMAGE_CACHE_NAME) {
                    console.log('[ServiceWorker] Removing old cache', key);
                    return caches.delete(key);
                }
            }));
        })
    );
    self.clients.claim();
    
    // Clean up expired cache entries
    cleanupExpiredCache();
});

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', (event) => {
    const { request } = event;
    const url = new URL(request.url);
    
    // Skip cross-origin requests (except for CDN resources)
    if (!url.origin.includes(self.location.origin) && 
        !url.origin.includes('cdn.tailwindcss.com') &&
        !url.origin.includes('fonts.googleapis.com') &&
        !url.origin.includes('fonts.gstatic.com')) {
        return;
    }

    // Handle API requests (Network First, then Cache)
    if (request.url.includes('/api/')) {
        event.respondWith(networkFirstStrategy(request, DATA_CACHE_NAME));
        return;
    }

    // Handle image requests (Cache First, then Network)
    if (request.destination === 'image' || /\.(jpg|jpeg|png|gif|webp|svg)$/i.test(url.pathname)) {
        event.respondWith(cacheFirstStrategy(request, IMAGE_CACHE_NAME));
        return;
    }

    // Handle font requests (Cache First)
    if (request.destination === 'font' || url.origin.includes('fonts.gstatic.com')) {
        event.respondWith(cacheFirstStrategy(request, CACHE_NAME));
        return;
    }

    // Handle other requests (Cache First, then Network)
    event.respondWith(cacheFirstStrategy(request, CACHE_NAME));
});

// Network First Strategy (for API calls)
async function networkFirstStrategy(request, cacheName) {
    try {
        const networkResponse = await fetch(request);
        
        // Cache successful responses
        if (networkResponse && networkResponse.status === 200) {
            const cache = await caches.open(cacheName);
            cache.put(request, networkResponse.clone());
            
            // Cleanup cache if too large
            await limitCacheSize(cacheName, MAX_DATA_CACHE_SIZE);
        }
        
        return networkResponse;
    } catch (error) {
        console.log('[ServiceWorker] Network failed, trying cache:', request.url);
        
        // Fallback to cache
        const cachedResponse = await caches.match(request);
        if (cachedResponse) {
            return cachedResponse;
        }
        
        // Return offline page for navigation requests
        if (request.mode === 'navigate') {
            return caches.match('/index.html');
        }
        
        // Return error response
        return new Response(JSON.stringify({ error: 'Offline', offline: true }), {
            status: 503,
            headers: { 'Content-Type': 'application/json' }
        });
    }
}

// Cache First Strategy (for static assets)
async function cacheFirstStrategy(request, cacheName) {
    const cachedResponse = await caches.match(request);
    
    if (cachedResponse) {
        // Check if cache is expired
        const dateHeader = cachedResponse.headers.get('date');
        if (dateHeader) {
            const cacheDate = new Date(dateHeader).getTime();
            const now = Date.now();
            
            // If cache is old, update in background
            if (now - cacheDate > CACHE_DURATION) {
                fetch(request).then(response => {
                    if (response && response.status === 200) {
                        caches.open(cacheName).then(cache => cache.put(request, response));
                    }
                }).catch(() => {});
            }
        }
        
        return cachedResponse;
    }
    
    try {
        const networkResponse = await fetch(request);
        
        if (networkResponse && networkResponse.status === 200) {
            const cache = await caches.open(cacheName);
            cache.put(request, networkResponse.clone());
            
            // Cleanup cache if too large
            if (cacheName === IMAGE_CACHE_NAME) {
                await limitCacheSize(cacheName, MAX_IMAGE_CACHE_SIZE);
            }
        }
        
        return networkResponse;
    } catch (error) {
        console.log('[ServiceWorker] Fetch failed:', request.url);
        return new Response('Offline', { status: 503 });
    }
}

// Limit cache size
async function limitCacheSize(cacheName, maxItems) {
    const cache = await caches.open(cacheName);
    const keys = await cache.keys();
    
    if (keys.length > maxItems) {
        // Remove oldest items
        const itemsToDelete = keys.length - maxItems;
        for (let i = 0; i < itemsToDelete; i++) {
            await cache.delete(keys[i]);
        }
        console.log(`[ServiceWorker] Cleaned ${itemsToDelete} items from ${cacheName}`);
    }
}

// Clean up expired cache entries
async function cleanupExpiredCache() {
    const cacheNames = [DATA_CACHE_NAME, IMAGE_CACHE_NAME];
    
    for (const cacheName of cacheNames) {
        try {
            const cache = await caches.open(cacheName);
            const requests = await cache.keys();
            const now = Date.now();
            
            for (const request of requests) {
                const response = await cache.match(request);
                if (response) {
                    const dateHeader = response.headers.get('date');
                    if (dateHeader) {
                        const cacheDate = new Date(dateHeader).getTime();
                        if (now - cacheDate > CACHE_DURATION) {
                            await cache.delete(request);
                            console.log('[ServiceWorker] Deleted expired cache:', request.url);
                        }
                    }
                }
            }
        } catch (error) {
            console.error('[ServiceWorker] Cleanup failed:', error);
        }
    }
}

// Background sync for when connection is restored
self.addEventListener('sync', (event) => {
    console.log('[ServiceWorker] Background sync', event.tag);
    
    if (event.tag === 'sync-feedback') {
        event.waitUntil(syncFeedback());
    }
    
    if (event.tag === 'sync-analytics') {
        event.waitUntil(syncAnalytics());
    }
});

// Sync feedback when back online
async function syncFeedback() {
    try {
        const cache = await caches.open(DATA_CACHE_NAME);
        const requests = await cache.keys();
        const feedbackRequests = requests.filter(req => 
            req.url.includes('/api/feedback') && req.method === 'POST'
        );

        for (const request of feedbackRequests) {
            try {
                await fetch(request);
                await cache.delete(request);
                console.log('[ServiceWorker] Synced feedback:', request.url);
            } catch (error) {
                console.error('[ServiceWorker] Sync failed for', request.url);
            }
        }
    } catch (error) {
        console.error('[ServiceWorker] Background sync failed', error);
    }
}

// Sync analytics when back online
async function syncAnalytics() {
    try {
        const cache = await caches.open(DATA_CACHE_NAME);
        const requests = await cache.keys();
        const analyticsRequests = requests.filter(req => 
            req.url.includes('/api/analytics')
        );

        for (const request of analyticsRequests) {
            try {
                await fetch(request);
                await cache.delete(request);
                console.log('[ServiceWorker] Synced analytics:', request.url);
            } catch (error) {
                console.error('[ServiceWorker] Analytics sync failed');
            }
        }
    } catch (error) {
        console.error('[ServiceWorker] Analytics sync error', error);
    }
}

// Handle push notifications (for future use)
self.addEventListener('push', (event) => {
    console.log('[ServiceWorker] Push received');
    
    const options = {
        body: event.data ? event.data.text() : 'New update available',
        icon: '/icon-192.png',
        badge: '/icon-192.png',
        vibrate: [200, 100, 200],
        data: {
            dateOfArrival: Date.now(),
            primaryKey: 1
        },
        actions: [
            {
                action: 'explore',
                title: 'Open App',
                icon: '/icon-192.png'
            },
            {
                action: 'close',
                title: 'Close',
                icon: '/icon-192.png'
            }
        ]
    };
    
    event.waitUntil(
        self.registration.showNotification('SKSU FAQ Bot', options)
    );
});

// Handle notification clicks
self.addEventListener('notificationclick', (event) => {
    console.log('[ServiceWorker] Notification click:', event.action);
    event.notification.close();
    
    if (event.action === 'explore') {
        event.waitUntil(
            clients.openWindow('/')
        );
    }
});

// Periodic background sync (for future use)
self.addEventListener('periodicsync', (event) => {
    if (event.tag === 'update-faqs') {
        event.waitUntil(updateFAQsCache());
    }
});

// Update FAQs cache in background
async function updateFAQsCache() {
    try {
        const cache = await caches.open(DATA_CACHE_NAME);
        
        // Fetch latest categories and questions
        const categoriesResponse = await fetch('/api/categories');
        const questionsResponse = await fetch('/api/questions');
        
        if (categoriesResponse.ok) {
            await cache.put('/api/categories', categoriesResponse.clone());
        }
        
        if (questionsResponse.ok) {
            await cache.put('/api/questions', questionsResponse.clone());
        }
        
        console.log('[ServiceWorker] FAQs cache updated');
    } catch (error) {
        console.error('[ServiceWorker] FAQ update failed:', error);
    }
}

// Handle messages from the main thread
self.addEventListener('message', (event) => {
    console.log('[ServiceWorker] Message received:', event.data);
    
    if (event.data.action === 'skipWaiting') {
        self.skipWaiting();
    }
    
    if (event.data.action === 'clearCache') {
        event.waitUntil(
            caches.keys().then((keyList) => {
                return Promise.all(keyList.map((key) => caches.delete(key)));
            }).then(() => {
                // Notify all clients that cache is cleared
                self.clients.matchAll().then(clients => {
                    clients.forEach(client => {
                        client.postMessage({ action: 'cacheCleared' });
                    });
                });
            })
        );
    }
    
    if (event.data.action === 'getCacheStatus') {
        event.waitUntil(
            Promise.all([
                caches.open(CACHE_NAME).then(cache => cache.keys()),
                caches.open(DATA_CACHE_NAME).then(cache => cache.keys()),
                caches.open(IMAGE_CACHE_NAME).then(cache => cache.keys())
            ]).then(([appCache, dataCache, imageCache]) => {
                const status = {
                    version: CACHE_VERSION,
                    appShellSize: appCache.length,
                    dataSize: dataCache.length,
                    imageSize: imageCache.length,
                    totalSize: appCache.length + dataCache.length + imageCache.length
                };
                
                // Send status back to client
                event.source.postMessage({ 
                    action: 'cacheStatus', 
                    status 
                });
            })
        );
    }
    
    if (event.data.action === 'prefetchFAQs') {
        event.waitUntil(updateFAQsCache());
    }
});
