const CACHE_NAME = 'mastermind-store-v1';
const ASSETS = [
  './',
  './index.html',
  './Mastermind.css',
  './Mastermind.js',
  './mastermind.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      // استفاده از addAll با احتیاط: اگر فایلی نباشد کل نصب شکست می‌خورد
      // برای تست، فعلاً فقط فایل‌های اصلی را اضافه می‌کنیم
      return cache.addAll(ASSETS);
    }).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            return caches.delete(cache);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});
