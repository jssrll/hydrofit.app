// ========================================
// HYDROFIT - SERVICE WORKER
// ========================================

const CACHE_NAME = 'hydrofit-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/css/style.css',
  '/js/config.js',
  '/js/utils.js',
  '/js/api.js',
  '/js/auth.js',
  '/js/dashboard.js',
  '/js/profile.js',
  '/js/assessment.js',
  '/js/timer.js',
  '/js/ranking.js',
  '/js/bmi.js',
  '/js/heartrate.js',
  '/js/movement.js',
  '/js/injury.js',
  '/js/recovery.js',
  '/js/bodytype.js',
  '/js/bodyparts.js',
  '/js/app.js',
  '/assets/favicon-96x96.png',
  '/assets/apple-touch-icon.png',
  'https://fonts.googleapis.com/css2?family=Inter:opsz,wght@14..32,300;400;500;600;700;800&display=swap',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css'
];

// Install Service Worker
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

// Fetch Strategy: Cache First, then Network
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Cache hit - return response
        if (response) {
          return response;
        }
        
        // Clone the request
        const fetchRequest = event.request.clone();
        
        return fetch(fetchRequest).then(response => {
          // Check if valid response
          if (!response || response.status !== 200 || response.type !== 'basic') {
            return response;
          }
          
          // Clone the response
          const responseToCache = response.clone();
          
          caches.open(CACHE_NAME)
            .then(cache => {
              cache.put(event.request, responseToCache);
            });
            
          return response;
        });
      })
  );
});

// Activate Service Worker - Clean old caches
self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});